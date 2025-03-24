import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_CONTENT_TYPES = ['text/markdown', 'text/plain', 'application/octet-stream'];

export const MODULE_PATH = __dirname;
export const PROMPTS_DIR = path.resolve(MODULE_PATH, 'prompts');

export const EXECUTE_PATH = process.cwd();
export const DEFAULT_LOG_DIR = path.resolve(EXECUTE_PATH, 'log');
export const DEFAULT_LOG_FILE = path.resolve(DEFAULT_LOG_DIR, 'translation.log');
export const FAIL_LOG = path.resolve(DEFAULT_LOG_DIR, 'translator-err.log');

export const DEFAULT_OPENAI_URL = 'https://api.302.ai/v1/chat/completions';
export const OFFICIAL_OPENAI_URL_V1 = 'https://api.openai.com/v1';
export const DEFAULT_MODEL = 'gpt-4o-mini';
