import axios from 'axios';
import * as fs from 'fs';
import path from 'path';

import { DEFAULT_MODEL, DEFAULT_OPENAI_URL } from '../config/constants';
import { printDirectoryStructure } from '../services/file';
import { CliOptions } from '../types/option';
import { t } from '../utils/i18n';
import { isValidUrl } from '../utils/validator';

// Set default values based on environment variables
// 根据环境变量设置默认值
export async function setDefault(argv: any) {
  // TODO: specify type
  const defaultApiKey = await getDefaultApiKey();

  argv['api-key'] = argv['api-key'] || process.env.API_KEY || defaultApiKey;
  argv['openai-url'] = argv['openai-url'] || process.env.OPENAI_URL || DEFAULT_OPENAI_URL;
  argv['model'] = argv['model'] || process.env.MODEL || DEFAULT_MODEL;
}

// Input validation function
// 输入验证函数
export function checkArgument(argv: any) {
  // TODO: specify type
  if (!argv.input && !argv.url) {
    throw new Error(t('cli.input.file.required'));
  }
  if (argv.input && argv.url) {
    throw new Error(t('cli.input.mutually.exclusive'));
  }
  if (argv.url && !isValidUrl(argv.url)) {
    throw new Error(t('cli.url.invalid'));
  }
  return true;
}

interface ApiKeyResponse {
  code: number;
  data: {
    api_key: string;
  };
}

export async function getDefaultApiKey(): Promise<string | null> {
  try {
    const response = await axios.get<ApiKeyResponse>(
      'https://dash-api.302.ai/bot/v1/302aitool11-prompter',
      {
        headers: {
          accept: 'application/json',
          'accept-language': 'zh-CN,zh;q=0.9',
          'cache-control': 'no-cache',
          pragma: 'no-cache',
        },
      },
    );

    if (response.status !== 200) {
      throw new Error(`Failed to fetch API key: HTTP ${response.status} - ${response.statusText}`);
    }

    const { code, data } = response.data;

    // TODO: Need to investigate API error codes and their meanings
    // If you know about the API documentation, could you give me the reference link?
    // I'll improve error handling once we have better understanding of possible error cases
    if (code !== 0) {
      throw new Error(
        `API key retrieval failed with code ${code}: ${JSON.stringify(response.data)}`,
      );
    }

    return data.api_key;
  } catch (error) {
    console.error(t('api.key.error'), error);
    return null;
  }
}

export function showVersion() {
  const packageJsonPath = path.join(__dirname, '../..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  console.log(`version: ${packageJson.version}`);
  process.exit(0);
}

/**
 * Display directory structure.
 * 显示目录结构。
 */
export function showDirectoryPath(argv: CliOptions) {
  const pathToShow = path.resolve(argv.path);
  console.log(`\n📂 Directory structure: ${pathToShow}`);
  console.log('.');

  // Create file filter based on user input
  // 根据用户输入创建文件过滤器
  const fileFilter = argv['file-filter']
    ? (filename: string) => {
        const extensions = (argv['file-filter'] ?? '')
          .split(',')
          .map((ext) => (ext.startsWith('.') ? ext : `.${ext}`));
        return extensions.some((ext) => filename.endsWith(ext));
      }
    : () => true;

  printDirectoryStructure(
    pathToShow,
    '',
    {
      showHidden: argv['show-hidden'] as boolean,
      showFiles: true,
      maxDepth: argv['max-depth'] as number,
      currentDepth: 0,
      fileFilter: fileFilter,
    },
    { dirs: 0, files: 0 },
  );

  if (!argv.input && !argv.url) {
    process.exit(0);
  }
}
