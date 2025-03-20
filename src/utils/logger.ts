import * as fs from 'fs';
import { FAIL_LOG } from '../config/constants';

export function logMessage(message: string, options: { log: boolean; logFile: string }) {
  if (options.log) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(options.logFile, logMessage);
    console.log(message);
  }
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
