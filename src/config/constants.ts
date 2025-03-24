import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_CONTENT_TYPES = ['text/markdown', 'text/plain', 'application/octet-stream'];
export const DEFAULT_LOG_DIR = path.join(__dirname, '../../logs');
export const DEFAULT_LOG_FILE = path.join(DEFAULT_LOG_DIR, 'translation.log');

export const LOG_DIR = path.join(__dirname, '../../log');
export const FAIL_LOG = path.join(LOG_DIR, 'translator-err.log');

export const DEFAULT_OPENAI_URL = 'https://api.302.ai/v1/chat/completions';
export const OPENAI_URL_COMPLETIONS = 'https://api.openai.com/v1/chat/completions';
export const DEFAULT_MODEL = 'gpt-4o-mini';
