import * as path from 'path';
import * as fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { fileURLToPath } from 'url';
import { DEFAULT_MODEL, DEFAULT_OPENAI_URL } from '../config/constants';
import { getDefaultApiKey } from '../services/api';
import { SupportedLocale } from '../config/i18n';
import { setLocale } from '../utils/i18n';
import { isValidUrl } from '../utils/validator';
import { t } from '../utils/i18n';
import { printDirectoryStructure } from '../services/file';
import { DirectoryOptions } from '../types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Define and parse CLI options.
 * 定义并解析命令行选项。
 * CLI 옵션을 정의하고 파싱합니다.
 */
export async function parseCliOptions() {
  const defaultApiKey = await getDefaultApiKey();

  const argv = await yargs(hideBin(process.argv))
    .option('input', {
      alias: 'i',
      description:
        '입력 마크다운 파일 또는 폴더 / Input markdown file or folder / 输入的Markdown文件或文件夹',
      type: 'string',
    })
    .option('url', {
      alias: 'u',
      description: '입력 마크다운 URL / Input markdown URL / 输入的Markdown URL地址',
      type: 'string',
    })
    .option('extension', {
      alias: 'e',
      description:
        '번역할 파일 확장자 지정 (예: md) / Specify file extension to translate (e.g. md) / 指定要翻译的文件后缀（例如 md）',
      type: 'string',
    })
    .option('rename', {
      description: '파일명 수정 접미사 / File name modification suffix / 修改文件名称的后缀',
      type: 'string',
      default: null,
    })
    .check((argv) => {
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
    })
    .option('output', {
      alias: 'o',
      description: '출력 마크다운 파일 / Output markdown file / 输出的Markdown文件',
      type: 'string',
    })
    .option('language', {
      alias: 'l',
      description: '대상 언어 / Target language / 目标语言',
      type: 'string',
      demandOption: true,
    })
    .option('openai-url', {
      description: 'OpenAI API URL / OpenAI API 网址',
      type: 'string',
      default: process.env.OPENAI_URL || DEFAULT_OPENAI_URL,
    })
    .option('api-key', {
      description: 'OpenAI API Key / OpenAI API 密钥',
      type: 'string',
      default: process.env.API_KEY || defaultApiKey,
    })
    .option('model', {
      description: '사용할 OpenAI 모델 / OpenAI model to use / 使用的OpenAI模型',
      type: 'string',
      default: process.env.MODEL || DEFAULT_MODEL,
    })
    .option('show-version', {
      alias: 'v',
      description: '버전 표시 / Show version / 显示版本号',
      type: 'boolean',
    })
    .option('retry', {
      description:
        '번역 실패 파일 재시도 여부 / Whether to retry failed translation files / 是否重试翻译失败的文件',
      type: 'boolean',
      default: false,
    })
    .option('log', {
      description: '로그 표시 여부 / Whether to show logs / 是否显示日志',
      type: 'boolean',
      default: false,
    })
    .option('log-file', {
      description: '로그 파일 경로 / Log file path / 日志文件路径',
      type: 'string',
      default: path.join(__dirname, '../..', 'log', 'translator-err.log'),
    })
    .option('log-dir', {
      description: '로그 디렉토리 / Log directory / 日志目录',
      type: 'string',
      default: path.join(__dirname, '../..', 'log'),
    })
    .option('retry-count', {
      description: '재시도 횟수 / Retry count / 重试次数',
      type: 'number',
      default: 3,
    })
    .option('retry-delay', {
      description: '재시도 지연 시간(초) / Retry delay (seconds) / 重试延迟时间（秒）',
      type: 'number',
      default: 10,
    })
    .option('path', {
      description: '현재 파일 위치 디렉토리 / Current file location directory / 当前文件所在的目录',
      type: 'string',
      default: __dirname,
    })
    .option('show-path', {
      description:
        '현재 파일 위치 디렉토리 표시 / Show current file location directory / 显示当前文件所在的目录',
      type: 'boolean',
      default: false,
    })
    .option('show-hidden', {
      description: '숨김 파일 표시 / Show hidden files / 显示隐藏文件',
      type: 'boolean',
      default: false,
    })
    .option('max-depth', {
      description:
        '디렉토리 표시 최대 깊이 / Maximum depth for directory display / 目录显示的最大深度',
      type: 'number',
      default: 5,
    })
    .option('file-filter', {
      description:
        '파일 필터 (예: .md,.txt) / File filter (e.g. .md,.txt) / 文件过滤器（例如: .md,.txt）',
      type: 'string',
    })
    .option('locale', {
      alias: 'lang',
      description:
        '로그 메시지 언어 설정 (en, zh, ko) / Log message language setting / 日志消息语言设置',
      type: 'string',
      choices: ['en', 'zh', 'ko'],
      default: 'zh',
    })
    .help()
    .alias('help', 'h').argv;

  // 로케일 설정 / Set locale / 设置语言环境
  setLocale(argv.locale as SupportedLocale);

  return argv;
}

/**
 * Show version information.
 * 显示版本信息。
 * 버전 정보를 표시합니다.
 */
export function showVersion() {
  const packageJsonPath = path.join(__dirname, '../..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  console.log(`버전: ${packageJson.version}`);
  process.exit(0);
}

/**
 * Display directory structure.
 * 显示目录结构。
 * 디렉토리 구조를 표시합니다.
 */
export function showDirectoryPath(argv: any) {
  const pathToShow = path.resolve(argv.path as string);
  console.log(`\n📂 디렉토리 구조: ${pathToShow}`);
  console.log('.');

  const fileFilter = argv['file-filter']
    ? (filename: string) => {
        const extensions = (argv['file-filter'] as string)
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

/**
 * Prepare program options.
 * 准备程序选项。
 * 프로그램 옵션을 준비합니다.
 */
export function prepareOptions(argv: any): DirectoryOptions {
  return {
    log: argv.log as boolean,
    logFile: argv['log-file'] as string,
    logDir: argv['log-dir'] as string,
    retryCount: argv['retry-count'] as number,
    retryDelay: argv['retry-delay'] as number,
    path: argv.path as string,
    locale: argv.locale as SupportedLocale,
  };
}
