import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as glob from 'glob';
import axios from 'axios';
import { MAX_FILE_SIZE, ALLOWED_CONTENT_TYPES } from '../config/constants';
import { validateContent } from '../utils/validator';
import { formatFileSize } from '../utils/formatter';
import { DirectoryOptions, DirectoryStats, DirectoryPrintOptions } from '../types';
import { logMessage, logFailedFile, clearLogFile } from '../utils/logger';
import { translateText } from './api';
import { t } from '../utils/i18n';

export function readMarkdownFile(filePath: string): string {
  if (!fs.existsSync(filePath)) {
    throw new Error(t('file.not.exists', filePath));
  }
  if (fs.lstatSync(filePath).isDirectory()) {
    throw new Error(t('file.is.directory', filePath));
  }
  return fs.readFileSync(filePath, 'utf-8');
}

export function writeMarkdownFile(filePath: string, content: string): void {
  fs.writeFileSync(filePath, content, 'utf-8');
}

export async function getContentFromUrl(urlString: string): Promise<string> {
  const tempDir = os.tmpdir();
  const tempFile = path.join(tempDir, `md_${Date.now()}.md`);

  try {
    const response = await axios({
      method: 'get',
      url: urlString,
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Accept: 'text/markdown,text/plain,*/*',
      },
      responseType: 'arraybuffer',
      timeout: 5000,
      maxContentLength: MAX_FILE_SIZE,
      validateStatus: (status) => status === 200,
    });

    const contentType = response.headers['content-type']?.toLowerCase() || '';
    if (!ALLOWED_CONTENT_TYPES.some((type) => contentType.includes(type))) {
      throw new Error(t('file.content.type.unsupported', contentType));
    }

    const content = response.data.toString('utf-8');

    if (!validateContent(content)) {
      throw new Error(t('file.content.invalid'));
    }

    return content;
  } catch (firstError) {
    console.log(t('file.direct.fetch.failed'), firstError);
    try {
      const response = await axios({
        method: 'get',
        url: urlString,
        headers: {
          'User-Agent': 'Mozilla/5.0',
          Accept: 'application/octet-stream',
        },
        responseType: 'stream',
        timeout: 5000,
        maxContentLength: MAX_FILE_SIZE,
      });

      const contentType = response.headers['content-type']?.toLowerCase() || '';
      if (!ALLOWED_CONTENT_TYPES.some((type) => contentType.includes(type))) {
        throw new Error(t('file.content.type.unsupported', contentType));
      }

      const writer = fs.createWriteStream(tempFile);
      response.data.pipe(writer);

      await new Promise<void>((resolve, reject) => {
        writer.on('finish', () => resolve());
        writer.on('error', reject);
      });

      const content = fs.readFileSync(tempFile, 'utf-8');

      if (!validateContent(content)) {
        throw new Error(t('file.content.invalid'));
      }

      return content;
    } catch (secondError) {
      throw new Error(t('file.url.fetch.failed', urlString));
    } finally {
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    }
  }
}

export async function translateDirectory(
  inputDir: string,
  outputDir: string,
  targetLanguage: string,
  openaiUrl: string,
  apiKey: string,
  model: string,
  fileExtension: string | null,
  rename: string | null,
  options: DirectoryOptions,
) {
  console.log(t('file.check.api.key'), apiKey);

  if (options.log && !fs.existsSync(options.logDir)) {
    fs.mkdirSync(options.logDir, { recursive: true });
  }

  const pattern = fileExtension ? `**/*.${fileExtension}` : '**/*';
  const markdownFiles = glob.sync(`${inputDir}/${pattern}`, { nodir: true });

  console.log(t('file.target.files'), markdownFiles);
  const successfulFiles: string[] = [];

  for (const file of markdownFiles) {
    const relativePath = path.relative(inputDir, file);
    logMessage(t('file.start.processing', file), options);

    const content = readMarkdownFile(file);
    const translatedContent = await translateText(
      content,
      targetLanguage,
      openaiUrl,
      apiKey,
      model,
      {
        count: options.retryCount,
        delay: options.retryDelay,
        log: options.log,
        logFile: options.logFile,
        locale: options.locale,
      },
    );

    if (translatedContent) {
      try {
        let modifiedContent = translatedContent;
        if (modifiedContent.startsWith('```')) {
          const endOfFirstLine = modifiedContent.indexOf('\n');
          modifiedContent = modifiedContent.slice(endOfFirstLine + 1).trim();
        }

        if (modifiedContent.endsWith('```')) {
          const startOfLastLine = modifiedContent.lastIndexOf('\n');
          modifiedContent = modifiedContent.slice(0, startOfLastLine).trim();
        }

        const outputFileName = rename
          ? path.join(
              outputDir,
              path.dirname(relativePath),
              `${path.basename(file, path.extname(file))}-${rename}${path.extname(file)}`,
            )
          : path.join(outputDir, relativePath);

        const outputDirPath = path.dirname(outputFileName);
        if (!fs.existsSync(outputDirPath)) {
          fs.mkdirSync(outputDirPath, { recursive: true });
        }

        writeMarkdownFile(outputFileName, modifiedContent);
        logMessage(t('file.translation.complete', file, outputFileName), options);
        successfulFiles.push(file);
      } catch (writeError) {
        logMessage(t('file.write.failed', file), options);
        logFailedFile(file);
      }
    } else {
      logMessage(t('file.translation.failed', file), options);
      logFailedFile(file);
    }
  }

  if (successfulFiles.length > 0) {
    clearLogFile(successfulFiles);
    logMessage(t('file.log.cleared', successfulFiles.length), options);
  }
}

export function printDirectoryStructure(
  dirPath: string,
  prefix = '',
  options: DirectoryPrintOptions,
  stats: DirectoryStats = { dirs: 0, files: 0 },
): void {
  if (options.currentDepth > options.maxDepth) return;

  const items = fs
    .readdirSync(dirPath)
    .filter((item) => (options.showHidden ? true : !item.startsWith('.')))
    .filter((item) => {
      const fullPath = path.join(dirPath, item);
      const stats = fs.statSync(fullPath);
      return stats.isDirectory() || (options.showFiles && options.fileFilter(item));
    })
    .sort((a, b) => {
      const aPath = path.join(dirPath, a);
      const bPath = path.join(dirPath, b);
      const aIsDir = fs.statSync(aPath).isDirectory();
      const bIsDir = fs.statSync(bPath).isDirectory();
      if (aIsDir && !bIsDir) return -1;
      if (!aIsDir && bIsDir) return 1;
      return a.localeCompare(b);
    });

  items.forEach((item, index) => {
    const isLast = index === items.length - 1;
    const fullPath = path.join(dirPath, item);
    const itemStats = fs.statSync(fullPath);
    const isDir = itemStats.isDirectory();

    if (isDir) {
      stats.dirs++;
    } else {
      stats.files++;
    }

    const icon = isDir ? '📁' : '📄';
    const size = isDir ? '' : formatFileSize(itemStats.size);
    const displayPrefix = prefix + (isLast ? '└── ' : '├── ');
    const displaySize = size ? ` (${size})` : '';

    console.log(`${displayPrefix}${icon} ${item}${displaySize}`);

    if (isDir) {
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      printDirectoryStructure(
        fullPath,
        newPrefix,
        {
          ...options,
          currentDepth: options.currentDepth + 1,
        },
        stats,
      );
    }
  });

  if (options.currentDepth === 0) {
    console.log('\n🔍 ' + t('file.stats.title'));
    console.log('   ' + t('file.stats.dirs', stats.dirs));
    console.log('   ' + t('file.stats.files', stats.files));
    console.log('   ' + t('file.stats.total', stats.dirs + stats.files));
  }
}
