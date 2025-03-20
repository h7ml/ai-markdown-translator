export interface TranslationOptions {
  count: number;
  delay: number;
  log: boolean;
  logFile: string;
}

export interface DirectoryOptions {
  log: boolean;
  logFile: string;
  logDir: string;
  retryCount: number;
  retryDelay: number;
  path: string;
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
