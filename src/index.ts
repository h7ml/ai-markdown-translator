#!/usr/bin/env node

import * as fs from 'fs';
import axios from 'axios';
import { config } from 'dotenv';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as path from 'path';
import * as os from 'os';

config();

// 添加新函数
function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
}

function readMarkdownFile(filePath: string): string {
  if (!fs.existsSync(filePath)) {
    throw new Error(`输入文件 ${filePath} 不存在。`);
  }
  return fs.readFileSync(filePath, 'utf-8');
}

function writeMarkdownFile(filePath: string, content: string): void {
  fs.writeFileSync(filePath, content, 'utf-8');
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

  const prompt = `将以下文本翻译成${targetLanguage}。请保持Markdown语法不变:\n\n${text}`;

  const data = {
    model: model,
    messages: [{ role: 'user', content: prompt }],
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
  try {
    // 第一次尝试：直接获取内容
    const response = await axios({
      method: 'get',
      url: urlString,
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Accept: 'text/markdown,text/plain,*/*',
      },
      responseType: 'arraybuffer',
      timeout: 5000, // 5秒超时
    });
    return response.data.toString('utf-8');
  } catch (firstError) {
    console.log('firstError', firstError);
    try {
      // 第二次尝试：作为文件下载
      const response = await axios({
        method: 'get',
        url: urlString,
        headers: {
          'User-Agent': 'Mozilla/5.0',
          Accept: 'application/octet-stream',
        },
        responseType: 'stream',
        timeout: 5000,
      });

      // 写入临时文件
      const writer = fs.createWriteStream(tempFile);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      // 读取临时文件内容
      const content = fs.readFileSync(tempFile, 'utf-8');
      // 删除临时文件
      fs.unlinkSync(tempFile);
      return content;
    } catch (secondError) {
      // 简化错误信息
      throw new Error(`无法从 URL 获取内容: ${urlString}`);
    }
  }
}

async function main() {
  const defaultApiKey = await getDefaultApiKey();

  const argv = await yargs(hideBin(process.argv))
    .option('input', {
      alias: 'i',
      description: '输入的Markdown文件',
      type: 'string',
    })
    .option('url', {
      alias: 'u',
      description: '输入的Markdown URL地址',
      type: 'string',
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
      demandOption: true,
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
    .option('url', {
      description: '从URL获取Markdown文件',
      type: 'string',
    })
    .help()
    .alias('help', 'h').argv;

  try {
    if (!argv['openai-url']) {
      throw new Error('需要提供OpenAI URL。请通过--openai-url参数或OPENAI_URL环境变量提供。');
    }
    if (!argv['api-key']) {
      throw new Error('需要提供API Key。请通过--api-key参数或API_KEY环境变量提供。');
    }

    let markdownContent: string;
    if (argv.url) {
      markdownContent = await getContentFromUrl(argv.url as string);
    } else if (argv.input) {
      markdownContent = readMarkdownFile(argv.input as string);
    } else {
      throw new Error('必须提供 --input 或 --url 参数之一');
    }

    if (markdownContent.startsWith('```')) {
      markdownContent = markdownContent.slice(3).trim();
    }
    if (markdownContent.endsWith('```')) {
      markdownContent = markdownContent.slice(0, -3).trim();
    }

    const translatedContent = await translateText(
      markdownContent,
      argv.language,
      argv['openai-url'] as string,
      argv['api-key'] as string,
      argv.model as string,
    );

    if (translatedContent) {
      writeMarkdownFile(argv.output, translatedContent);
      console.log(`翻译完成。输出已保存到 ${argv.output}。`);
    } else {
      console.log('翻译失败。');
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
