import axios, { AxiosError } from 'axios';
import { DEFAULT_OPENAI_URL, DEFAULT_MODEL } from '../config/constants';
import { logLocalizedMessage } from '../utils/logger';
import { sleep } from '../utils/formatter';
import { TranslationOptions } from '../types';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { t } from '../utils/i18n';

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
    console.error(t('api.key.error'));
    return '';
  } catch (error) {
    console.error(t('api.key.request.error'), error);
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
      const translateContent = await getFileContent('input.md');
      const assistantContent = await getFileContent('output.md');

      if (!(systemContent && translateContent && assistantContent)) {
        console.error(t('api.prompt.error'));
        throw new Error(t('api.prompt.error'));
      }

      console.log('read all prompt contents');

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

      try {
        const response = await axios.post(openaiUrl, data, { headers });

        console.log('API response status:', response.status, response.statusText);

        if (response.status === 200) {
          logLocalizedMessage(
            attempt === 1 ? 'api.translation.complete' : 'api.translation.retry.success',
            retryOptions,
            attempt,
            retryOptions.count,
          );

          if (response.data.choices && response.data.choices.length > 0) {
            console.log('Translation successful');
            return response.data.choices[0].message.content;
          } else {
            console.log(
              'API response structure invalid:',
              JSON.stringify(response.data).substring(0, 200),
            );
            throw new Error(t('api.translation.failed'));
          }
        }

        console.log('API response invalid:', JSON.stringify(response.data).substring(0, 200));

        const errorMsg = t('api.request.failed', response.status, response.statusText);
        if (attempt < retryOptions.count) {
          logLocalizedMessage(
            'api.retry.preparing',
            retryOptions,
            errorMsg,
            attempt,
            retryOptions.count,
          );
        } else {
          logLocalizedMessage('api.retry.max', retryOptions, errorMsg);
        }
      } catch (innerError: unknown) {
        const axiosError = innerError as AxiosError;
        console.log('API request failed:', axiosError.message);
        console.log('API request error code:', axiosError.code);
        console.log(
          'API request error response:',
          axiosError.response
            ? JSON.stringify(axiosError.response.data).substring(0, 200)
            : 'No response',
        );
        throw innerError;
      }
    } catch (error: unknown) {
      const errorMsg = t(
        'api.error.retry',
        error instanceof Error ? error.message : String(error),
        retryOptions.delay,
        attempt,
        retryOptions.count,
      );
      if (attempt < retryOptions.count) {
        logLocalizedMessage(
          'api.error.retry',
          retryOptions,
          error instanceof Error ? error.message : errorMsg,
          retryOptions.delay,
          attempt,
          retryOptions.count,
        );
        await sleep(retryOptions.delay * 1000);
      } else {
        logLocalizedMessage(
          'api.error.max',
          retryOptions,
          error instanceof Error ? error.message : errorMsg,
        );
      }
    }
  }

  return null;
}

async function getFileContent(fileName: string): Promise<string> {
  const filePath = path.join(__dirname, './prompts/', fileName);

  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(t('api.prompt.error'), error);
    throw error;
  }
}
