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
// 환경 변수 기반 기본값 설정
export async function setDefault(argv: any) {
  // TODO: specify type
  const defaultApiKey = await getDefaultApiKey();

  argv['api-key'] = argv['api-key'] || process.env.API_KEY || defaultApiKey;
  argv['openai-url'] = argv['openai-url'] || process.env.OPENAI_URL || DEFAULT_OPENAI_URL;
  argv['model'] = argv['model'] || process.env.MODEL || DEFAULT_MODEL;
}

// Input validation function
// 输入验证函数
// 기본 동작 체크 함수
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

export function showVersion() {
  const packageJsonPath = path.join(__dirname, '../..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  console.log(`version: ${packageJson.version}`);
  process.exit(0);
}

/**
 * Display directory structure.
 * 显示目录结构。
 * 디렉토리 구조를 표시합니다.
 */
export function showDirectoryPath(argv: CliOptions) {
  const pathToShow = path.resolve(argv.path);
  console.log(`\n📂 Directory structure: ${pathToShow}`);
  console.log('.');

  // Create file filter based on user input
  // 根据用户输入创建文件过滤器
  // 파일 필터 생성
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
