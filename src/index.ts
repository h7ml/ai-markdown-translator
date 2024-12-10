#!/usr/bin/env node

import * as fs from 'fs';
import axios from 'axios';
import { config } from 'dotenv';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

config();

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
    const response = await fetch('https://dash-api.302.ai/bot/v1/302aitool11-prompter', {
      headers: {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'zh-CN,zh;q=0.9',
        'cache-control': 'no-cache',
        'pragma': 'no-cache',
        'priority': 'u=0, i',
        'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate', 
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1'
      },
      referrerPolicy: 'strict-origin-when-cross-origin',
      method: 'GET',
      mode: 'cors',
      credentials: 'omit'
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.code === 0) {
        return data.data.api_key;
      }
    }
    return '';
  } catch (error) {
    console.error('获取默认API Key失败:', error);
    return '';
  }
}

async function translateText(
  text: string,
  targetLanguage: string,
  openaiUrl: string = 'https://api.302.ai/v1/chat/completions',
  apiKey: string,
  model: string = 'gpt-4o-mini',
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

async function main() {
  const defaultApiKey = await getDefaultApiKey();
  
  const argv = await yargs(hideBin(process.argv))
    .option('input', {
      alias: 'i',
      description: '输入的Markdown文件',
      type: 'string',
      demandOption: true,
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
    .help()
    .alias('help', 'h').argv;

  try {
    if (!argv['openai-url']) {
      throw new Error(
        '需要提供OpenAI URL。请通过--openai-url参数或OPENAI_URL环境变量提供。',
      );
    }
    if (!argv['api-key']) {
      throw new Error(
        '需要提供API Key。请通过--api-key参数或API_KEY环境变量提供。',
      );
    }

    let markdownContent = readMarkdownFile(argv.input);

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
