#!/usr/bin/env node

import * as fs from 'fs';
import { config } from 'dotenv';
import { LOG_DIR } from './config/constants';
import { t } from './utils/i18n';
import {
  parseCliOptions,
  showVersion,
  showDirectoryPath,
  prepareOptions,
  processUrlContent,
  processInputPath,
} from './cli';

config();

// 로그 디렉토리 존재 확인
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

async function main() {
  try {
    // CLI 옵션 파싱
    const argv = await parseCliOptions();

    // 버전 표시
    if (argv['show-version']) {
      showVersion();
    }

    // 디렉토리 구조 표시
    if (argv['show-path']) {
      showDirectoryPath(argv);
    }

    // OpenAI URL 및 API 키 필수 검증
    if (!argv['openai-url']) {
      throw new Error(t('cli.openai.url.required'));
    }
    if (!argv['api-key']) {
      throw new Error(t('cli.api.key.required'));
    }

    // 옵션 준비
    const options = prepareOptions(argv);

    // URL 또는 파일/디렉토리 처리
    if (argv.url) {
      await processUrlContent(
        argv.url as string,
        argv.output as string,
        argv.language as string,
        argv['openai-url'] as string,
        argv['api-key'] as string,
        argv.model as string,
        options,
      );
    } else if (argv.input) {
      await processInputPath(
        argv.input as string,
        argv.output as string,
        argv.language as string,
        argv['openai-url'] as string,
        argv['api-key'] as string,
        argv.model as string,
        argv.extension || null,
        argv.rename,
        options,
      );
    } else {
      throw new Error(t('cli.input.file.required'));
    }
  } catch (error: Error | unknown) {
    console.error(`${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

main()
  .catch((error) => {
    console.error('처리되지 않은 오류:', error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
