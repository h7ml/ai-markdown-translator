import { DEFAULT_OPENAI_URL, DEFAULT_MODEL } from '../config/constants';
import { ChatData, TranslationOptions } from '../types';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { t } from '../utils/i18n';
import { translateTextWithModule, translateTextWithRestApi } from './openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function translateText(
  text: string,
  targetLanguage: string,
  openaiUrl = DEFAULT_OPENAI_URL,
  apiKey: string,
  model = DEFAULT_MODEL,
  retryOptions: TranslationOptions,
): Promise<string | null> {
  const prompt = `将以下文本翻译成${targetLanguage}。请保持格式不变:\n\n${text}`;
  const systemContent = await getFileContent('system.md');
  const inputContent = await getFileContent('input.md');
  const outputContent = await getFileContent('output.md');

  if (!(systemContent && inputContent && outputContent)) {
    console.error(t('api.prompt.error'));
    throw new Error(t('api.prompt.error'));
  }

  const data: ChatData = {
    model: model,
    messages: [
      { role: 'developer', content: systemContent },
      {
        role: 'user',
        content: `请将以下文本翻译成英文。请保持格式不变:\n\n${inputContent}`,
      },
      { role: 'assistant', content: outputContent },
      { role: 'user', content: prompt },
    ],
  };

  if (openaiUrl == DEFAULT_OPENAI_URL) {
    return translateTextWithModule(apiKey, retryOptions, data);
  } else {
    return translateTextWithRestApi(apiKey, openaiUrl, retryOptions, data);
  }
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
