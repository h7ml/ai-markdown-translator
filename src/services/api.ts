import { ChatData, RuntimeOptions } from '../types';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { t } from '../utils/i18n';
import { translateTextWithCompletionsModule, translateTextWithRestApi } from './openai';
import { OFFICIAL_OPENAI_URL_V1 } from '../config/constants';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    model: options.model,
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

  if (options.openaiUrl.includes(OFFICIAL_OPENAI_URL_V1)) {
    if (options.apiType === 'completions') {
      return translateTextWithCompletionsModule(options.apiKey, options.directoryOptions, data);
    }
  }

  return translateTextWithRestApi(
    options.apiKey,
    options.openaiUrl,
    options.directoryOptions,
    data,
  );
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
