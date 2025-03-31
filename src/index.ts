#!/usr/bin/env node

import { config } from 'dotenv';
import * as fs from 'fs';

import { showDirectoryPath, showVersion } from './cli/helper';
import { parseCliOptions } from './cli/main';
import { prepareOptions } from './cli/options';
import { processInputPath, processUrlContent } from './cli/processor';
import { DEFAULT_LOG_DIR } from './config/constants';
import { CliOptions } from './types/option';
import { t } from './utils/i18n';
import { cosmi } from './config/cosmi';

config();

// 检查日志目录是否存在 / Check if log directory exists
if (!fs.existsSync(DEFAULT_LOG_DIR)) {
  fs.mkdirSync(DEFAULT_LOG_DIR, { recursive: true });
}

async function main() {
  try {
    // 解析 CLI 选项 / Parse CLI options
    const argv = await parseCliOptions();

    // 显示版本 / Show version
    if (argv['show-version']) {
      showVersion();
    }

    // 显示目录结构 / Show directory structure
    if (argv['show-path']) {
      showDirectoryPath(argv as CliOptions);
    }

    // 验证必需的 OpenAI URL 和 API 密钥 / Validate required OpenAI URL and API key
    if (!argv['openai-url']) {
      throw new Error(t('cli.openai.url.required'));
    }
    if (!argv['api-key']) {
      throw new Error(t('cli.api.key.required'));
    }

    const config = cosmi();
    console.log('cosmiconfig:', config);

    // 准备选项 / Prepare options
    const runtimeOptions = prepareOptions(argv as CliOptions);

    // 处理 URL 或文件/目录 / Process URL or file/directory
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
