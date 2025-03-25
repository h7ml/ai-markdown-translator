import * as fs from 'fs';

import { FAIL_LOG } from '../config/constants';
import { SupportedLocale } from '../config/i18n';
import { getLocale, t } from './i18n';

export interface LogOptions {
  log: boolean;
  logFile: string;
  locale?: SupportedLocale;
}

export function logMessage(message: string, options: LogOptions) {
  if (options.log) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(options.logFile, logMessage);
    console.log(message);
  }
}

export function logLocalizedMessage(key: string, options: LogOptions, ...args: unknown[]) {
  // 특정 로케일이 지정된 경우 해당 로케일 사용
  const currentLocale = options.locale || getLocale();
  options.locale = currentLocale;
  const message = t(key, ...args);
  logMessage(message, options);
}

export function logFailedFile(filePath: string) {
  fs.appendFileSync(FAIL_LOG, `${filePath}\n`, 'utf-8');
}

export function getFailedFiles(): string[] {
  if (fs.existsSync(FAIL_LOG)) {
    const content = fs.readFileSync(FAIL_LOG, 'utf-8');
    return content.split('\n').filter((line) => line.trim() !== '');
  }
  return [];
}

export function clearLogFile(succeededFiles: string[]) {
  if (!fs.existsSync(FAIL_LOG)) return;
  const failedFiles = getFailedFiles();
  const remainingFiles = failedFiles.filter((file) => !succeededFiles.includes(file));
  fs.writeFileSync(FAIL_LOG, remainingFiles.join('\n') + '\n', 'utf-8');
}
