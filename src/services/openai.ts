import axios from 'axios';
import OpenAI from 'openai';

import { DirectoryOptions } from '../types/option';
import { sleep } from '../utils/formatter';
import { t } from '../utils/i18n';
import { logLocalizedMessage } from '../utils/logger';

type ApiCallFunction<T> = () => Promise<T>;

async function withRetry<T>(
  apiCall: ApiCallFunction<T>,
  directoryOptions: DirectoryOptions,
): Promise<T | null> {
  for (let attempt = 1; attempt <= directoryOptions.retryCount; attempt++) {
    try {
      const result = await apiCall();
      logLocalizedMessage(
        attempt === 1 ? 'api.translation.complete' : 'api.translation.retry.success',
        directoryOptions,
        attempt,
        directoryOptions.retryCount,
      );
      return result;
    } catch (error: unknown) {
      await handleError(error, directoryOptions, attempt);
      if (attempt === directoryOptions.retryCount) {
        return null;
      }
    }
  }
  return null;
}

export async function translateTextWithCompletionsModule(
  apiKey: string,
  retryOptions: DirectoryOptions,
  data: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming,
): Promise<string | null> {
  const openai = new OpenAI({ apiKey });

  return withRetry(async () => {
    const response = await openai.chat.completions.create(data);

    if (response.choices && response.choices.length > 0) {
      console.log('Translation successful');
      return response.choices[0].message.content;
    } else {
      console.log('API response structure invalid:', JSON.stringify(response));
      throw new Error(t('api.translation.failed'));
    }
  }, retryOptions);
}

export async function translateTextWithRestApi(
  apiKey: string,
  openaiUrl: string,
  directoryOptions: DirectoryOptions,
  data: {
    model: string;
    messages: { role: string; content: string }[];
  },
): Promise<string | null> {
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };

  return withRetry(async () => {
    const response = await axios.post(openaiUrl, data, { headers });

    if (response.status === 200) {
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
    throw new Error(errorMsg);
  }, directoryOptions);
}

async function handleError(error: unknown, directoryOptions: DirectoryOptions, attempt: number) {
  const errorMsg = t(
    'api.error.retry',
    error instanceof Error ? error.message : String(error),
    directoryOptions.retryDelay,
    attempt,
    directoryOptions.retryCount,
  );
  if (attempt < directoryOptions.retryCount) {
    logLocalizedMessage(
      'api.error.retry',
      directoryOptions,
      error instanceof Error ? error.message : errorMsg,
      directoryOptions.retryDelay,
      attempt,
      directoryOptions.retryCount,
    );
    await sleep(directoryOptions.retryDelay * 1000);
  } else {
    logLocalizedMessage(
      'api.error.max',
      directoryOptions,
      error instanceof Error ? error.message : errorMsg,
    );
  }
}
