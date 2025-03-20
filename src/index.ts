#!/usr/bin/env node

import * as fs from 'fs';
import { config } from 'dotenv';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { LOG_DIR } from './config/constants';
import { isValidUrl } from './utils/validator';
import { getDefaultApiKey, translateText } from './services/api';
import {
  readMarkdownFile,
  writeMarkdownFile,
  getContentFromUrl,
  translateDirectory,
  printDirectoryStructure,
} from './services/file';
import { DirectoryOptions } from './types';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 确保日志目录存在
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
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
    const options: DirectoryOptions = {
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
      console.log('input path:', argv.input);
      const inputPath = path.resolve(argv.input);
      const stats = fs.statSync(inputPath);
      if (stats.isDirectory()) {
        const outputDir = argv.output ? path.resolve(argv.output) : inputPath;
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

      const outputPath = path.resolve(argv.output);
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
        writeMarkdownFile(outputPath, modifiedContent);
        console.log(`翻译 ${argv.input} 完成。输出已保存到 ${outputPath}`);
      } else {
        console.log('翻译失败。');
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
