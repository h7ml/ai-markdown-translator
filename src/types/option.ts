import { SupportedLocale } from '../config/i18n';
import { ApiType } from './common';

// Option definition interface
// 选项定义接口
// 옵션 정의 인터페이스
export interface OptionDefinition {
  alias?: string;
  description: {
    zh: string;
    en: string;
    ko: string;
  };
  type: string;
  default?: unknown;
  demandOption?: boolean;
  choices?: string[];
}

export interface CliOptions {
  input?: string;
  url?: string;
  output?: string;
  language: string;
  'openai-url': string;
  'api-key': string;
  'show-version': string;
  retry: boolean;
  model: string;
  extension?: string;
  rename: string | null;
  log: boolean;
  'log-file': string;
  'log-dir': string;
  'retry-count': number;
  'retry-delay': number;
  path: string;
  'show-path': boolean;
  locale: SupportedLocale;
  'file-filter'?: string;
  'show-hidden': boolean;
  'max-depth': number;
  'api-type': ApiType;
}

export interface DirectoryPrintOptions {
  showHidden: boolean;
  showFiles: boolean;
  maxDepth: number;
  currentDepth: number;
  fileFilter: (filename: string) => boolean;
}

export interface RuntimeOptions {
  input?: string;
  url?: string;
  output: string;
  language: string;
  openaiUrl: string;
  apiKey: string;
  model: string;
  extension: string | null;
  rename?: string;
  directoryOptions: DirectoryOptions;
  apiType: ApiType;
}

export interface DirectoryOptions {
  log: boolean;
  logFile: string;
  logDir: string;
  retryCount: number;
  retryDelay: number;
  path: string;
  locale?: SupportedLocale;
}
