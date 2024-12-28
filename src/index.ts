#!/usr/bin/env node

import * as fs from 'fs';
import axios from 'axios';
import { config } from 'dotenv';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as path from 'path';
import * as os from 'os';
import * as glob from 'glob';
import { fileURLToPath } from 'url';

config();

const __filename = fileURLToPath(import.meta.url); // 当前脚本的文件路径
const __dirname = path.dirname(__filename); // 当前文件所在目录

// 日志文件路径
const LOG_DIR = path.join(__dirname, './log');
const FAIL_LOG = path.join(LOG_DIR, 'translator-err.log');

// 常量配置
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_CONTENT_TYPES = [
  'text/markdown',
  'text/plain',
  'text/x-markdown',
  'application/octet-stream',
];

// 确保日志目录存在
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}
// 验证URL是否有效
function isValidUrl(urlString: string): boolean {
  try {
    // 支持标准协议
    if (urlString.match(/^(http|https|ftp|ssh|file):\/\//)) {
      new URL(urlString);
      return true;
    } // 支持 scp 格式的 SSH URL

    if (urlString.match(/^git@[^:]+:/)) {
      return true;
    } // 支持本地文件路径

    if (
      urlString.startsWith('file://') ||
      urlString.startsWith('/') ||
      /^[a-zA-Z]:\\/.test(urlString)
    ) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

function readMarkdownFile(filePath: string): string {
  if (!fs.existsSync(filePath)) {
    throw new Error(`输入文件 ${filePath} 不存在。`);
  }
  if (fs.lstatSync(filePath).isDirectory()) {
    throw new Error(`错误: ${filePath} 是一个目录。`);
  }
  return fs.readFileSync(filePath, 'utf-8');
}

function writeMarkdownFile(filePath: string, content: string): void {
  fs.writeFileSync(filePath, content, 'utf-8');
}

async function getFileContent(fileName: string): Promise<string> {
  const filePath = path.join(__dirname, fileName);
  return fs.readFileSync(filePath, 'utf-8');
}

async function getDefaultApiKey(): Promise<string> {
  try {
    const response = await axios({
      method: 'get',
      url: 'https://dash-api.302.ai/bot/v1/302aitool11-prompter',
      headers: {
        accept: 'application/json',
        'accept-language': 'zh-CN,zh;q=0.9',
        'cache-control': 'no-cache',
        pragma: 'no-cache',
      },
    });

    if (response.status === 200 && response.data) {
      const data = response.data;
      if (data.code === 0 && data.data && data.data.api_key) {
        return data.data.api_key;
      }
    }
    console.error('获取默认API Key失败: 接口返回数据格式错误');
    return '';
  } catch (error) {
    console.error('获取默认API Key失败:', error);
    return '';
  }
}
// 记录翻译失败的文件路径
function logFailedFile(filePath: string) {
  fs.appendFileSync(FAIL_LOG, `${filePath}\n`, 'utf-8');
}

// 从日志文件加载失败文件路径
function getFailedFiles(): string[] {
  if (fs.existsSync(FAIL_LOG)) {
    const content = fs.readFileSync(FAIL_LOG, 'utf-8');
    return content.split('\n').filter((line) => line.trim() !== '');
  }
  return [];
}

// 清除某些已翻译成功的文件记录
function clearLogFile(succeededFiles: string[]) {
  if (!fs.existsSync(FAIL_LOG)) return;
  const failedFiles = getFailedFiles();
  const remainingFiles = failedFiles.filter((file) => !succeededFiles.includes(file));
  fs.writeFileSync(FAIL_LOG, remainingFiles.join('\n') + '\n', 'utf-8');
}

// 添加新的工具函数
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 添加日志记录函数
function logMessage(message: string, options: { log: boolean; logFile: string }) {
  if (options.log) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(options.logFile, logMessage);
    console.log(message);
  }
}
async function translateText(
  text: string,
  targetLanguage: string,
  openaiUrl = 'https://api.302.ai/v1/chat/completions',
  apiKey: string,
  model = 'gpt-4o-mini',
  retryOptions = { count: 3, delay: 10, log: false, logFile: '' },
): Promise<string | null> {
  for (let attempt = 1; attempt <= retryOptions.count; attempt++) {
    try {
      const headers = {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      };

      const prompt = `将以下文本翻译成${targetLanguage}。请保持格式不变:\n\n${text}`;
      const systemContent = await getFileContent('system.md');
      const translateContent = await getFileContent('translate.md');
      const assistantContent = await getFileContent('assistant.md');

      const data = {
        model: model,
        messages: [
          { role: 'system', content: systemContent },
          {
            role: 'user',
            content: `请将以下文本翻译成英文。请保持格式不变:\n\n${translateContent}`,
          },
          { role: 'assistant', content: assistantContent },
          { role: 'user', content: prompt },
        ],
      };

      const response = await axios.post(openaiUrl, data, { headers });

      if (response.status === 200) {
        // 简化日志输出
        logMessage(
          attempt === 1 ? '翻译完成' : `重试成功 (${attempt}/${retryOptions.count})`,
          retryOptions,
        );
        return response.data.choices[0].message.content;
      }

      // 失败时的日志
      const errorMsg = `请求失败: ${response.status} - ${response.statusText}`;
      if (attempt < retryOptions.count) {
        logMessage(`${errorMsg}, 准备重试 (${attempt}/${retryOptions.count})`, retryOptions);
      } else {
        logMessage(`${errorMsg}, 已达到最大重试次数`, retryOptions);
      }
    } catch (error) {
      // 错误处理的日志
      const errorMsg = `翻译错误: ${error}`;
      if (attempt < retryOptions.count) {
        logMessage(
          `${errorMsg}, 将在 ${retryOptions.delay} 秒后重试 (${attempt}/${retryOptions.count})`,
          retryOptions,
        );
        await sleep(retryOptions.delay * 1000);
      } else {
        logMessage(`${errorMsg}, 已达到最大重试次数`, retryOptions);
      }
    }
  }

  return null;
}

async function getContentFromUrl(urlString: string): Promise<string> {
  const tempDir = os.tmpdir();
  const tempFile = path.join(tempDir, `md_${Date.now()}.md`);

  const validateContent = (content: string): boolean => {
    // 基本的 Markdown 格式验证
    const hasMarkdownSyntax = /[#*_[\]()-`]/.test(content);
    const hasText = /[a-zA-Z\u4e00-\u9fa5]/.test(content);
    return hasMarkdownSyntax && hasText;
  };

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

    // 验证内容类型
    const contentType = response.headers['content-type']?.toLowerCase() || '';
    if (!ALLOWED_CONTENT_TYPES.some((type) => contentType.includes(type))) {
      throw new Error(`不支持的内容类型: ${contentType}`);
    }

    const content = response.data.toString('utf-8');

    // 验证内容是否为有效的 Markdown
    if (!validateContent(content)) {
      throw new Error('内容不是有效的 Markdown 格式');
    }

    return content;
  } catch (firstError) {
    console.log('直接获取失败,尝试下载方式:', firstError);
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

      // 验证内容类型
      const contentType = response.headers['content-type']?.toLowerCase() || '';
      if (!ALLOWED_CONTENT_TYPES.some((type) => contentType.includes(type))) {
        throw new Error(`不支持的内容类型: ${contentType}`);
      }

      const writer = fs.createWriteStream(tempFile);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      const content = fs.readFileSync(tempFile, 'utf-8');

      // 验证内容是否为有效的 Markdown
      if (!validateContent(content)) {
        throw new Error('内容不是有效的 Markdown 格式');
      }

      return content;
    } catch (secondError) {
      throw new Error(`无法从 URL 获取内容: ${urlString}`);
    } finally {
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    }
  }
}

// 更新 translateDirectory 函数
async function translateDirectory(
  inputDir: string,
  outputDir: string,
  targetLanguage: string,
  openaiUrl: string,
  apiKey: string,
  model: string,
  fileExtension: string | null,
  rename: string | null,
  options: {
    log: boolean;
    logFile: string;
    logDir: string;
    retryCount: number;
    retryDelay: number;
  },
) {
  // 确保日志目录存在
  if (options.log && !fs.existsSync(options.logDir)) {
    fs.mkdirSync(options.logDir, { recursive: true });
  }

  const pattern = fileExtension ? `**/*.${fileExtension}` : '**/*';
  const markdownFiles = glob.sync(`${inputDir}/${pattern}`, { nodir: true });

  const successfulFiles: string[] = []; // 添加成功翻译文件的数组

  for (const file of markdownFiles) {
    const relativePath = path.relative(inputDir, file);
    logMessage(`开始处理文件: ${file}`, options);

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
        logMessage(`翻译完成: ${file} -> ${outputFileName}`, options);
        successfulFiles.push(file); // 添加到成功列表
      } catch (writeError) {
        logMessage(`写入文件失败: ${file}`, options);
        logFailedFile(file);
      }
    } else {
      logMessage(`翻译失败: ${file}`, options);
      logFailedFile(file);
    }
  }

  // 清理已成功翻译的文件记录
  if (successfulFiles.length > 0) {
    clearLogFile(successfulFiles);
    logMessage(`已清理 ${successfulFiles.length} 个成功翻译文件的记录`, options);
  }
}

/**
 * 打印目录结构
 * @param dirPath
 * @param prefix
 * @param options
 * @param stats
 * @returns
 */
function printDirectoryStructure(
  dirPath: string,
  prefix = '',
  options = {
    showHidden: false,
    showFiles: true,
    maxDepth: Infinity,
    currentDepth: 0,
    fileFilter: (filename: string) => true,
  },
  stats = { dirs: 0, files: 0 }, // 添加统计对象
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

    // 更新统计信息
    if (isDir) {
      stats.dirs++;
    } else {
      stats.files++;
    }

    // 添加图标和文件大小
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

  // 在根目录打印统计信息
  if (options.currentDepth === 0) {
    console.log('\n🔍 统计信息:');
    console.log(`   目录数量: ${stats.dirs}`);
    console.log(`   文件数量: ${stats.files}`);
    console.log(`   总计: ${stats.dirs + stats.files} 个项目`);
  }
}

// 添加文件大小格式化函数
function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

async function main() {
  const defaultApiKey = await getDefaultApiKey();

  const argv = await yargs(hideBin(process.argv))
    .option('input', {
      alias: 'i',
      description: '输入的Markdown文件或文件夹',
      type: 'string',
    })
    .option('url', {
      alias: 'u',
      description: '输入的Markdown URL地址',
      type: 'string',
    })
    .option('extension', {
      alias: 'e',
      description: '指定要翻译的文件后缀（例如 md）',
      type: 'string',
    })
    .option('rename', {
      description: '是否修改文件名称',
      type: 'string',
      default: null,
    })
    .check((argv) => {
      if (!argv.input && !argv.url) {
        throw new Error('必须提供 --input 或 --url 参数之一');
      }
      if (argv.input && argv.url) {
        throw new Error('--input 和 --url 参数不能同时使用');
      }
      if (argv.url && !isValidUrl(argv.url)) {
        throw new Error('提供的URL格式不正确');
      }
      return true;
    })
    .option('output', {
      alias: 'o',
      description: '输出的Markdown文件',
      type: 'string',
    })
    .option('language', {
      alias: 'l',
      description: '目标语言',
      type: 'string',
      demandOption: true,
    })
    .option('openai-url', {
      description: 'OpenAI API URL',
      type: 'string',
      default: process.env.OPENAI_URL || 'https://api.302.ai/v1/chat/completions',
    })
    .option('api-key', {
      description: 'OpenAI API Key',
      type: 'string',
      default: process.env.API_KEY || defaultApiKey,
    })
    .option('model', {
      description: '使用的OpenAI模型',
      type: 'string',
      default: process.env.MODEL || 'gpt-4o-mini',
    })
    .option('show-version', {
      alias: 'v',
      description: '显示版本号',
      type: 'boolean',
    })
    .option('retry', {
      description: '是否重试翻译失败的文件',
      type: 'boolean',
      default: false,
    })
    .option('log', {
      description: '是否显示日志',
      type: 'boolean',
      default: false,
    })
    .option('log-file', {
      description: '日志文件路径',
      type: 'string',
      default: path.join(__dirname, '..', 'log', 'translator-err.log'),
    })
    .option('log-dir', {
      description: '日志目录',
      type: 'string',
      default: path.join(__dirname, '..', 'log'),
    })
    .option('retry-count', {
      description: '重试次数',
      type: 'number',
      default: 3,
    })
    .option('retry-delay', {
      description: '重试延迟时间（秒）',
      type: 'number',
      default: 10,
    })
    .option('path', {
      description: '当前文件所在的目录',
      type: 'string',
      default: __dirname,
    })
    .option('show-path', {
      description: '显示当前文件所在的目录',
      type: 'boolean',
      default: false,
    })
    .option('show-hidden', {
      description: '显示隐藏文件',
      type: 'boolean',
      default: false,
    })
    .option('max-depth', {
      description: '目录显示的最大深度',
      type: 'number',
      default: 5,
    })
    .option('file-filter', {
      description: '文件过滤器（例如: .md,.txt）',
      type: 'string',
    })
    .help()
    .alias('help', 'h').argv;

  if (argv['show-version']) {
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    console.log(`版本号: ${packageJson.version}`);
    process.exit(0);
  }

  try {
    // 如果指定了 show-path 参数，显示目录结构
    if (argv['show-path']) {
      const pathToShow = path.resolve(argv.path as string);
      console.log(`\n📂 目录结构: ${pathToShow}`);
      console.log('.');

      const fileFilter = argv['file-filter']
        ? (filename: string) => {
            const extensions = (argv['file-filter'] as string)
              .split(',')
              .map((ext) => (ext.startsWith('.') ? ext : `.${ext}`));
            return extensions.some((ext) => filename.endsWith(ext));
          }
        : () => true;

      printDirectoryStructure(
        pathToShow,
        '',
        {
          showHidden: argv['show-hidden'] as boolean,
          showFiles: true,
          maxDepth: argv['max-depth'] as number,
          currentDepth: 0,
          fileFilter: fileFilter,
        },
        { dirs: 0, files: 0 },
      );

      // 如果没有其他操作参数，则退出程序
      if (!argv.input && !argv.url) {
        process.exit(0);
      }
    }
    if (!argv['openai-url']) {
      throw new Error('需要提供OpenAI URL。请通过--openai-url参数或OPENAI_URL环境变量提供。');
    }
    if (!argv['api-key']) {
      throw new Error('需要提供API Key。请通过--api-key参数或API_KEY环境变量提供。');
    }

    let markdownContent: string | null = null;
    const options = {
      log: argv.log as boolean,
      logFile: argv['log-file'] as string,
      logDir: argv['log-dir'] as string,
      retryCount: argv['retry-count'] as number,
      retryDelay: argv['retry-delay'] as number,
      path: argv.path as string,
    };

    if (argv.url) {
      markdownContent = await getContentFromUrl(argv.url as string);
    } else if (argv.input) {
      const inputPath = argv.input as string;
      const stats = fs.statSync(inputPath);
      if (stats.isDirectory()) {
        const outputDir = argv.output || inputPath;
        await translateDirectory(
          inputPath,
          outputDir,
          argv.language,
          argv['openai-url'] as string,
          argv['api-key'] as string,
          argv.model as string,
          argv.extension || null,
          argv.rename,
          options,
        );
      } else {
        markdownContent = readMarkdownFile(inputPath);
      }
    } else {
      throw new Error('必须提供 --input 或 --url 参数之一');
    }

    if (markdownContent) {
      if (markdownContent.startsWith('```')) {
        markdownContent = markdownContent.slice(3).trim();
      }
      if (markdownContent.endsWith('```')) {
        markdownContent = markdownContent.slice(0, -3).trim();
      }

      if (!argv.output && argv.input) {
        argv.output = argv.input;
      }

      if (typeof argv.output !== 'string') {
        throw new Error('输出文件名无效。');
      }

      const translatedContent = await translateText(
        markdownContent,
        argv.language,
        argv['openai-url'] as string,
        argv['api-key'] as string,
        argv.model as string,
        {
          count: options.retryCount,
          delay: options.retryDelay,
          log: options.log,
          logFile: options.logFile,
        },
      );

      if (translatedContent) {
        let modifiedContent = translatedContent;
        if (modifiedContent.startsWith('```')) {
          const endOfFirstLine = modifiedContent.indexOf('\n');
          modifiedContent = modifiedContent.slice(endOfFirstLine + 1).trim();
        }

        if (modifiedContent.endsWith('```')) {
          const startOfLastLine = modifiedContent.lastIndexOf('\n');
          modifiedContent = modifiedContent.slice(0, startOfLastLine).trim();
        }
        writeMarkdownFile(argv.output, modifiedContent);
        console.log(`翻译 ${argv.input} 完成。输出已保存到 ${argv.output}`);

        // 如果是单文件翻译，也清理日志
        if (typeof argv.input === 'string') {
          clearLogFile([argv.input]);
        }
      } else {
        console.log('翻译失败。');
        if (typeof argv.input === 'string') {
          logFailedFile(argv.input);
        }
      }
    }
  } catch (error: Error | unknown) {
    console.error(`错误: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

main()
  .catch((error) => {
    console.error('未处理的错误:', error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
