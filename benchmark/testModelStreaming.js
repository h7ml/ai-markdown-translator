import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { config } from 'dotenv';
import OpenAI from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 加载环境变量
config({ path: '.env.local' });

/**
 * 测试单个模型
 * @param {string} modelName 模型名称
 */
async function testModel(modelName) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL
  });

  console.log(`\n测试模型: ${modelName}`);

  try {
    // 测试非流式模式
    console.log('测试非流式输出...');
    const completion = await openai.chat.completions.create({
      model: modelName,
      messages: [{ role: 'user', content: '你好' }],
      stream: false
    });
    console.log('✅ 非流式输出测试通过');
  } catch (error) {
    console.log('❌ 非流式输出测试失败:', error.message);
  }

  try {
    // 测试流式模式
    console.log('测试流式输出...');
    const stream = await openai.chat.completions.create({
      model: modelName,
      messages: [{ role: 'user', content: '你好' }],
      stream: true
    });
    for await (const chunk of stream) {
      // 只需要确认能收到数据即可
      break;
    }
    console.log('✅ 流式输出测试通过');
  } catch (error) {
    console.log('❌ 流式输出测试失败:', error.message);
  }
}

// 主函数
async function main() {
  const modelName = process.argv[2];
  if (!modelName) {
    console.error('请提供模型名称作为参数');
    process.exit(1);
  }

  await testModel(modelName);
}

// 运行主函数
main().catch(console.error); 
