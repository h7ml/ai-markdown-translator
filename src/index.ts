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
// 添加常量配置
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_CONTENT_TYPES = [
  'text/markdown',
  'text/plain',
  'text/x-markdown',
  'application/octet-stream',
];

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

async function translateText(
  text: string,
  targetLanguage: string,
  openaiUrl = 'https://api.302.ai/v1/chat/completions',
  apiKey: string,
  model = 'gpt-4o-mini',
): Promise<string | null> {
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
      { role: 'user', content: `请将以下文本翻译成英文。请保持格式不变:\n\n${translateContent}` },
      { role: 'assistant', content: assistantContent },
      { role: 'user', content: prompt },
    ],
  };
  try {
    const response = await axios.post(openaiUrl, data, { headers });
    if (response.status === 200) {
      return response.data.choices[0].message.content;
    } else {
      console.error(`错误: ${response.status} - ${response.statusText}`);
      return null;
    }
  } catch (error) {
    console.error(`请求失败: ${error}`);
    return null;
  }
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

async function translateDirectory(
  inputDir: string,
  outputDir: string,
  targetLanguage: string,
  openaiUrl: string,
  apiKey: string,
  model: string,
  fileExtension: string | null,
  rename: string | null,
) {
  // 使用glob递归获取所有文件
  const pattern = fileExtension ? `**/*.${fileExtension}` : '**/*';
  const markdownFiles = glob.sync(`${inputDir}/${pattern}`, { nodir: true });

  for (const file of markdownFiles) {
    const relativePath = path.relative(inputDir, file); // 获取相对路径
    const content = readMarkdownFile(file);

    const translatedContent = await translateText(
      content,
      targetLanguage,
      openaiUrl,
      apiKey,
      model,
    );

    if (translatedContent) {
      let modifiedContent = translatedContent; // 创建可修改的变量
      // 校验是否含有代码块标记，如果有则删除第一行和最后一行
      if (modifiedContent.startsWith('```')) {
        const endOfFirstLine = modifiedContent.indexOf('\n');
        modifiedContent = modifiedContent.slice(endOfFirstLine + 1).trim();
      }

      if (modifiedContent.endsWith('```')) {
        const endIndex = modifiedContent.lastIndexOf('```');
        if (endIndex !== -1) {
          modifiedContent = modifiedContent.slice(0, endIndex);
        }
      }
      // 根据相对路径生成输出文件路径
      const outputFileName = rename
        ? path.join(
            outputDir,
            path.dirname(relativePath),
            `${path.basename(file, path.extname(file))}-${rename}${path.extname(file)}`,
          )
        : path.join(
            outputDir,
            path.dirname(relativePath),
            `${path.basename(file, path.extname(file))}${path.extname(file)}`,
          );

      // 确保输出目录存在
      const outputDirPath = path.dirname(outputFileName);
      if (!fs.existsSync(outputDirPath)) {
        fs.mkdirSync(outputDirPath, { recursive: true });
      }

      // 写入翻译后的文件
      writeMarkdownFile(outputFileName, modifiedContent);
      console.log(`翻译完成。输出已保存到 ${outputFileName}`);
    } else {
      console.log('翻译失败。');
    }
  }
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
    .help()
    .alias('help', 'h').argv;

  if (argv['show-version']) {
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    console.log(`版本号: ${packageJson.version}`);
    process.exit(0);
  }

  try {
    if (!argv['openai-url']) {
      throw new Error('需要提供OpenAI URL。请通过--openai-url参数或OPENAI_URL环境变量提供。');
    }
    if (!argv['api-key']) {
      throw new Error('需要提供API Key。请通过--api-key参数或API_KEY环境变量提供。');
    }

    let markdownContent: string | null = null;
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
      );

      if (translatedContent) {
        let modifiedContent = translatedContent;
        if (modifiedContent.startsWith('```')) {
          const endOfFirstLine = modifiedContent.indexOf('\n');
          modifiedContent = modifiedContent.slice(endOfFirstLine + 1).trim();
        }

        if (modifiedContent.endsWith('```')) {
          const endIndex = modifiedContent.lastIndexOf('```');
          if (endIndex !== -1) {
            modifiedContent = modifiedContent.slice(0, endIndex);
          }
        }
        writeMarkdownFile(argv.output, modifiedContent);
        console.log(`翻译 ${argv.input} 完成。输出已保存到 ${argv.output}`);
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
