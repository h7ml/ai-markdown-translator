import { SupportedLocale } from '../config/i18n';

export interface DirectoryOptions {
  log: boolean;
  logFile: string;
  logDir: string;
  retryCount: number;
  retryDelay: number;
  path: string;
  locale?: SupportedLocale;
}

export interface DirectoryStats {
  dirs: number;
  files: number;
}

export interface DirectoryPrintOptions {
  showHidden: boolean;
  showFiles: boolean;
  maxDepth: number;
  currentDepth: number;
  fileFilter: (filename: string) => boolean;
}

export interface ChatData {
  model: string;
  messages: { role: 'developer' | 'user' | 'assistant'; content: string }[];
}

export type ApiType = 'completions' | 'responses'; // | 'assistants'

export interface CliOptions {
  input?: string;
  url?: string;
  output?: string;
  language: string;
  'openai-url': string;
  'api-key': string;
  model: string;
  extension?: string;
  rename: string | null;
  log: boolean;
  'log-file': string;
  'log-dir': string;
  'retry-count': number;
  'retry-delay': number;
  path: string;
  locale: SupportedLocale;
  'file-filter'?: string;
  'show-hidden': boolean;
  'max-depth': number;
  'api-type': ApiType;
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
