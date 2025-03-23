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
}
