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
import { CliOptions } from './cli/options';

config();

// 检查日志目录是否存在 / Check if log directory exists / 로그 디렉토리 존재 확인
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

async function main() {
  try {
    // 解析 CLI 选项 / Parse CLI options / CLI 옵션 파싱
    const argv = await parseCliOptions();

    // 显示版本 / Show version / 버전 표시
    if (argv['show-version']) {
      showVersion();
    }

    // 显示目录结构 / Show directory structure / 디렉토리 구조 표시
    if (argv['show-path']) {
      showDirectoryPath(argv as CliOptions);
    }

    // 验证必需的 OpenAI URL 和 API 密钥 / Validate required OpenAI URL and API key / OpenAI URL 및 API 키 필수 검증
    if (!argv['openai-url']) {
      throw new Error(t('cli.openai.url.required'));
    }
    if (!argv['api-key']) {
      throw new Error(t('cli.api.key.required'));
    }

    // 准备选项 / Prepare options / 옵션 준비
    const runtimeOptions = prepareOptions(argv as CliOptions);

    // 处理 URL 或文件/目录 / Process URL or file/directory / URL 또는 파일/디렉토리 처리
    if (runtimeOptions.url) {
      await processUrlContent(runtimeOptions);
    } else if (runtimeOptions.input) {
      await processInputPath(runtimeOptions);
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
    console.error('Unresolved error:', error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
