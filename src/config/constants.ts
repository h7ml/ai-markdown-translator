import * as path from 'path';

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_CONTENT_TYPES = ['text/markdown', 'text/plain', 'application/octet-stream'];

export const PROJECT_ROOT = process.cwd();
export const DEFAULT_LOG_DIR = path.resolve(PROJECT_ROOT, 'log');
export const DEFAULT_LOG_FILE = path.resolve(DEFAULT_LOG_DIR, 'translation.log');
export const FAIL_LOG = path.resolve(DEFAULT_LOG_DIR, 'translator-err.log');

export const DEFAULT_OPENAI_URL = 'https://api.302.ai/v1/chat/completions';
export const OFFICIAL_OPENAI_URL_V1 = 'https://api.openai.com/v1';
export const DEFAULT_MODEL = 'gpt-4o-mini';
