import { DEFAULT_LOG_DIR, DEFAULT_LOG_FILE, EXECUTE_PATH } from '../config/constants';
import { CliOptions, DirectoryOptions, OptionDefinition, RuntimeOptions } from '../types/option';

// Options definition separated into an object
// 将选项定义分离到对象中
// 옵션 정의를 객체로 분리
export const OPTIONS: Record<keyof CliOptions, OptionDefinition> = {
  input: {
    alias: 'i',
    description: {
      zh: '输入的Markdown文件或文件夹',
      en: 'Input markdown file or folder',
      ko: '입력 마크다운 파일 또는 폴더',
    },
    type: 'string',
  },
  url: {
    alias: 'u',
    description: {
      zh: '输入的Markdown URL地址',
      en: 'Input markdown URL',
      ko: '입력 마크다운 URL',
    },
    type: 'string',
  },
  extension: {
    alias: 'e',
    description: {
      zh: '指定要翻译的文件后缀（例如 md）',
      en: 'Specify file extension to translate (e.g. md)',
      ko: '번역할 파일 확장자 지정 (예: md)',
    },
    type: 'string',
  },
  rename: {
    description: {
      zh: '文件名修改后缀',
      en: 'File name modification suffix',
      ko: '파일명 수정 접미사',
    },
    type: 'string',
    default: null,
  },
  output: {
    alias: 'o',
    description: {
      zh: '输出的Markdown文件',
      en: 'Output markdown file',
      ko: '출력 마크다운 파일',
    },
    type: 'string',
  },
  language: {
    alias: 'l',
    description: {
      zh: '目标语言',
      en: 'Target language',
      ko: '대상 언어',
    },
    type: 'string',
    demandOption: true,
  },
  'openai-url': {
    description: {
      zh: 'OpenAI API 网址',
      en: 'OpenAI API URL',
      ko: 'OpenAI API URL',
    },
    type: 'string',
  },
  'api-key': {
    description: {
      zh: 'OpenAI API 密钥',
      en: 'OpenAI API Key',
      ko: 'OpenAI API Key',
    },
    type: 'string',
  },
  model: {
    description: {
      zh: '使用的OpenAI模型',
      en: 'OpenAI model to use',
      ko: '사용할 OpenAI 모델',
    },
    type: 'string',
  },
  'api-type': {
    description: {
      zh: 'OpenAI API 类型 (completions/responses)',
      en: 'OpenAI API type (completions/responses)',
      ko: 'OpenAI API 타입 (completions/responses)',
    },
    type: 'string',
    choices: ['completions', 'responses'],
    default: 'completions',
    disabled: true,
  },
  'show-version': {
    alias: 'v',
    description: {
      zh: '显示版本号',
      en: 'Show version',
      ko: '버전 표시',
    },
    type: 'boolean',
  },
  retry: {
    description: {
      zh: '是否重试翻译失败的文件',
      en: 'Whether to retry failed translation files',
      ko: '번역 실패 파일 재시도 여부',
    },
    type: 'boolean',
    default: false,
  },
  log: {
    description: {
      zh: '是否显示日志',
      en: 'Whether to show logs',
      ko: '로그 표시 여부',
    },
    type: 'boolean',
    default: false,
  },
  'log-file': {
    description: {
      zh: '日志文件路径',
      en: 'Log file path',
      ko: '로그 파일 경로',
    },
    type: 'string',
    default: DEFAULT_LOG_FILE,
  },
  'log-dir': {
    description: {
      zh: '日志目录',
      en: 'Log directory',
      ko: '로그 디렉토리',
    },
    type: 'string',
    default: DEFAULT_LOG_DIR,
  },
  'retry-count': {
    description: {
      zh: '重试次数',
      en: 'Retry count',
      ko: '재시도 횟수',
    },
    type: 'number',
    default: 3,
  },
  'retry-delay': {
    description: {
      zh: '重试延迟时间（秒）',
      en: 'Retry delay (seconds)',
      ko: '재시도 지연 시간(초)',
    },
    type: 'number',
    default: 10,
  },
  path: {
    description: {
      zh: '当前文件所在的目录',
      en: 'Current file location directory',
      ko: '현재 파일 위치 디렉토리',
    },
    type: 'string',
    default: EXECUTE_PATH,
  },
  'show-path': {
    description: {
      zh: '显示当前文件所在的目录',
      en: 'Show current file location directory',
      ko: '현재 파일 위치 디렉토리 표시',
    },
    type: 'boolean',
    default: false,
  },
  'show-hidden': {
    description: {
      zh: '显示隐藏文件',
      en: 'Show hidden files',
      ko: '숨김 파일 표시',
    },
    type: 'boolean',
    default: false,
  },
  'max-depth': {
    description: {
      zh: '目录显示的最大深度',
      en: 'Maximum depth for directory display',
      ko: '디렉토리 표시 최대 깊이',
    },
    type: 'number',
    default: 5,
  },
  'file-filter': {
    description: {
      zh: '文件过滤器（例如: .md,.txt）',
      en: 'File filter (e.g. .md,.txt)',
      ko: '파일 필터 (예: .md,.txt)',
    },
    type: 'string',
  },
  locale: {
    description: {
      zh: '日志消息语言设置',
      en: 'Log message language setting',
      ko: '로그 메시지 언어 설정',
    },
    type: 'string',
    choices: ['en', 'zh', 'ko'],
    default: 'zh',
  },
};

/**
 * Prepare program options.
 * 准备程序选项。
 * 프로그램 옵션을 준비합니다.
 */
export function prepareOptions(argv: CliOptions): RuntimeOptions {
  const directoryOptions: DirectoryOptions = {
    log: argv.log,
    logFile: argv['log-file'],
    logDir: argv['log-dir'],
    retryCount: argv['retry-count'],
    retryDelay: argv['retry-delay'],
    path: argv.path,
    locale: argv.locale,
  };

  return {
    input: argv.input,
    url: argv.url,
    output: argv.output || '',
    language: argv.language,
    openaiUrl: argv['openai-url'],
    apiKey: argv['api-key'],
    model: argv.model,
    apiType: argv['api-type'],
    extension: argv.extension || null,
    rename: argv.rename || undefined,
    directoryOptions,
  };
}
