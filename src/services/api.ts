import fs from 'fs';
import path from 'path';

import { OFFICIAL_OPENAI_URL_V1, PROMPTS_DIR } from '../config/constants';
import { ChatData } from '../types/common';
import { RuntimeOptions } from '../types/option';
import { t } from '../utils/i18n';
import {
  translateTextWithCompletionsModule,
  translateTextWithOllama,
  translateTextWithRestApi,
} from './openai';

export async function translateText(text: string, options: RuntimeOptions): Promise<string | null> {
  const prompt = `将以下文本翻译成${options.language}。请保持格式不变:\n\n${text}`;
  const systemContent = await getFileContent('system.md');
  const inputContent = await getFileContent('input.md');
  const outputContent = await getFileContent('output.md');

  if (!(systemContent && inputContent && outputContent)) {
    console.error(t('api.prompt.error'));
    throw new Error(t('api.prompt.error'));
  }

  const data: ChatData = {
    model: options.apiType === 'ollama' ? options.ollamaModel || 'llama3' : options.model,
    messages: [
      { role: 'system', content: systemContent },
      {
        role: 'user',
        content: `请将以下文本翻译成英文。请保持格式不变:\n\n${inputContent}`,
      },
      { role: 'assistant', content: outputContent },
      { role: 'user', content: prompt },
    ],
  };

  // 使用Ollama API
  // Use Ollama API
  // Ollama API 사용
  if (options.apiType === 'ollama' && options.ollamaUrl) {
    return translateTextWithOllama(options.ollamaUrl, options.directoryOptions, data);
  }

  // 使用OpenAI官方API
  // Use OpenAI official API
  // OpenAI 공식 API 사용
  if (options.openaiUrl.includes(OFFICIAL_OPENAI_URL_V1)) {
    return translateTextWithCompletionsModule(options.apiKey, options.directoryOptions, data);
  }

  // 使用第三方API
  // Use third-party API
  // 제3자 API 사용
  return translateTextWithRestApi(
    options.apiKey,
    options.openaiUrl,
    options.directoryOptions,
    data,
  );
}

async function getFileContent(fileName: string): Promise<string> {
  const filePath = path.join(PROMPTS_DIR, fileName);

  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(t('api.prompt.error'), error);
    throw error;
  }
}
