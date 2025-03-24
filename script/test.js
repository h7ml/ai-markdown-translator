/* eslint-disable */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 从环境变量获取BaseURL，如果未设置则使用默认值
const baseUrl = process.env.OPENAI_BASE_URL || 'https://models.inference.ai.azure.com/chat/completions';

console.log(`Using API base URL: ${baseUrl}`);

// 确保输出目录存在
try {
  fs.mkdirSync(path.resolve(__dirname, '../prompts_translated'), { recursive: true });
  console.log('Created directory: prompts_translated');
} catch (error) {
  console.log('Directory already exists');
}

// 定义测试用例
const testCases = [
  {
    input: './src/prompts/system.md',
    output: './prompts_translated/system-gpt-4o-en.md',
    language: 'English',
    model: 'gpt-4o',
  },
  {
    input: './src/prompts/system.md',
    output: './prompts_translated/system-ministral-3b-ja.md',
    language: 'Japanese',
    model: 'Ministral-3B',
  },
  {
    input: './src/prompts/system.md',
    output: './prompts_translated/system-phi-3.5-mini-instruct-fr.md',
    language: '法语',
    model: 'Ministral-3B',
  },
  {
    input: './src/prompts/system.md',
    output: './prompts_translated/system-claude-3.5-zh.md',
    language: '中文',
    model: 'claude-3-5-sonnet',
  },
  {
    input: './src/prompts/system.md',
    output: './prompts_translated/system-gpt-4-de.md',
    language: 'German',
    model: 'gpt-4',
  },
  {
    input: './src/prompts/system.md',
    output: './prompts_translated/system-llama-3-70b-es.md',
    language: 'Spanish',
    model: 'llama-3-70b',
  },
  {
    input: './src/prompts/system.md',
    output: './prompts_translated/system-gemini-pro-ru.md',
    language: 'Russian',
    model: 'gemini-pro',
  },
  {
    input: './src/prompts/system.md',
    output: './prompts_translated/system-phi-3-mini-ko.md',
    language: 'Korean',
    model: 'phi-3-mini',
    locale: 'ko',
  },
];

// 执行每个测试用例
testCases.forEach((test, index) => {
  console.log(`\nRunning test case ${index + 1}/${testCases.length}...`);

  let command = `node ./dist/index.js -i ${test.input} -o ${test.output} -l ${test.language} --openai-url ${baseUrl} --api-key \${OPENAI_API_KEY} --model ${test.model} --log`;

  if (test.locale) {
    command += ` --locale ${test.locale}`;
  }

  console.log(
    `Executing: ${command.replace(/\${OPENAI_API_KEY}/, '****').replace(baseUrl, '[BASE_URL]')}`,
  );

  try {
    execSync(command, {
      stdio: 'inherit',
      env: { ...process.env },
    });
    console.log(`✅ Test case ${index + 1} completed successfully!`);
  } catch (error) {
    console.error(`❌ Test case ${index + 1} failed:`, error.message);
  }
});

console.log('\nAll tests completed!');
