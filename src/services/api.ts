import axios from 'axios';
import { DEFAULT_OPENAI_URL, DEFAULT_MODEL } from '../config/constants';
import { logMessage } from '../utils/logger';
import { sleep } from '../utils/formatter';
import { TranslationOptions } from '../types';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getDefaultApiKey(): Promise<string> {
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

export async function translateText(
  text: string,
  targetLanguage: string,
  openaiUrl = DEFAULT_OPENAI_URL,
  apiKey: string,
  model = DEFAULT_MODEL,
  retryOptions: TranslationOptions,
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

      if (!(systemContent && translateContent && assistantContent)) {
        console.error('cannot read prompt contents');
        throw new Error('cannot read prompt contents');
      }

      console.log('read all system contents');

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

      console.log('post to', openaiUrl);

      const response = await axios.post(openaiUrl, data, { headers });

      if (response.status === 200) {
        logMessage(
          attempt === 1 ? '翻译完成' : `重试成功 (${attempt}/${retryOptions.count})`,
          retryOptions,
        );
        return response.data.choices[0].message.content;
      }

      console.log('response invalid');

      const errorMsg = `请求失败: ${response.status} - ${response.statusText}`;
      if (attempt < retryOptions.count) {
        logMessage(`${errorMsg}, 准备重试 (${attempt}/${retryOptions.count})`, retryOptions);
      } else {
        logMessage(`${errorMsg}, 已达到最大重试次数`, retryOptions);
      }
    } catch (error) {
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

async function getFileContent(fileName: string): Promise<string> {
  const filePath = path.join(__dirname, './', fileName);

  return fs.readFileSync(filePath, 'utf-8');
}
