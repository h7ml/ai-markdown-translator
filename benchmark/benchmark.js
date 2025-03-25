/* global console, process */
import { ChatOpenAI } from '@langchain/openai';
import { config } from 'dotenv';
import { evaluate } from './evaluate.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import os from 'os';

import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = promisify(exec);

// 加载环境变量
config({ path: '.env.local' });

// 测试样本
const sampleMarkdownText = `
# 测试文档标题

这是一个**测试**文档，用于评估不同模型的*翻译*能力。

## 功能列表

- 功能1：基本文本翻译
- 功能2：保留Markdown格式
- 功能3：代码块处理

\`\`\`javascript
function testFunction() {
  console.log("这是一个测试函数");
  return true;
}
\`\`\`

> 这是一个引用块，用于测试格式保留。

请注意表格处理：

| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据1 | 数据2 | 数据3 |
| 行2数据1 | 行2数据2 | 行2数据3 |
`;

/**
 * 将结果转换为Markdown表格格式
 * @param {Object} result - 测试结果
 * @returns {string} - Markdown表格字符串
 */
function resultToMarkdownTable(result) {
  return `
| 指标 | 值 |
|------|-----|
| 模型名称 | ${result.modelName} |
| 测试用例 | ${result.testCaseName} |
| 目标语言 | ${result.targetLanguage} |
| 耗时 | ${result.timeCost.toFixed(2)}s |
| 输入Token数 | ${result.inputTokens} |
| 输出Token数 | ${result.outputTokens} |
| 输入Token成本 | $${result.inputTokensCost.toFixed(5)} |
| 输出Token成本 | $${result.outputTokensCost.toFixed(5)} |
| 总成本 | $${(result.inputTokensCost + result.outputTokensCost).toFixed(5)} |
| 语义准确性 | ${result.semanticAccuracy}/10 |
| Markdown格式保留 | ${result.markdownPreservation}/10 |
| 术语一致性 | ${result.terminologyConsistency}/10 |
| 语言流畅度 | ${result.fluency}/10 |
| 风格匹配 | ${result.styleMatching}/10 |
| 结构错误 | ${result.wrongStructure ? '是' : '否'} |
${result.issues.length > 0
      ? '**问题：**\n' + result.issues.map((issue) => `- ${issue}`).join('\n')
      : ''}
${result.suggestions.length > 0
      ? '**建议：**\n' + result.suggestions.map((suggestion) => `- ${suggestion}`).join('\n')
      : ''}
`;
}

// 定义基准测试目录结构
const benchmarkDir = path.join(__dirname);
const inputDir = path.join(benchmarkDir, 'input');
const outputDir = path.join(benchmarkDir, 'output');

// 确保目录存在
[inputDir, outputDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * 执行一次基准测试
 * @param {Object} model - 模型配置
 * @param {Object} testCase - 测试用例
 * @returns {Promise<Object>} - 测试结果
 */
export async function runBenchmark(model, testCase) {
  console.log(`开始基准测试: ${model.name} / ${testCase.name} -> ${testCase.targetLanguage}`);

  // 使用更清晰的文件命名
  const timestamp = Date.now();
  const safeModelName = model.name.replace(/[^a-zA-Z0-9-]/g, '-');
  const inputFile = path.join(inputDir, `input-${safeModelName}-${testCase.name}-${testCase.targetLanguage}-${timestamp}.md`);
  const outputFile = path.join(outputDir, `output-${safeModelName}-${testCase.name}-${testCase.targetLanguage}-${timestamp}.md`);

  // 记录开始时间
  const startTime = Date.now();

  try {
    // 写入测试内容到输入文件
    fs.writeFileSync(inputFile, testCase.content, 'utf8');
    fs.writeFileSync(outputFile, '', 'utf8');
    // 构建命令
    const cmd = `node "${path.resolve(__dirname, '../dist/index.js')}" --input "${inputFile}" --output "${outputFile}" --language "${testCase.targetLanguage}" --model "${model.name}" --log`;

    const { stdout, stderr } = await execAsync(cmd);

    if (stdout) console.log('命令输出:', stdout);
    if (stderr) console.error('命令错误:', stderr);

    // 检查输出文件是否存在
    if (!fs.existsSync(outputFile)) {
      throw new Error(`翻译后的输出文件不存在: ${outputFile}`);
    }

    // 读取翻译结果
    const translatedText = fs.readFileSync(outputFile, 'utf8');

    // 计算耗时（秒）
    const timeCost = (Date.now() - startTime) / 1000;

    // 评估翻译质量
    let evaluationResult;
    try {
      evaluationResult = await evaluate(
        testCase.content,
        translatedText,
        testCase.targetLanguage,
        'deepseek-r1', // 使用deepseek-r1进行评估
      );
    } catch (evalError) {
      console.error('评估失败:', evalError);
      evaluationResult = {
        semanticAccuracy: 0,
        markdownPreservation: 0,
        terminologyConsistency: 0,
        fluency: 0,
        styleMatching: 0,
        wrongStructure: true,
        issues: ['评估过程出错'],
        suggestions: [],
      };
    }

    // 清理文件
    try {
      fs.unlinkSync(inputFile);
      fs.unlinkSync(outputFile);
    } catch (e) {
      console.warn('清理文件失败:', e.message);
    }

    // 返回测试结果
    const resultObj = {
      modelName: model.name,
      testCaseName: testCase.name,
      targetLanguage: testCase.targetLanguage,
      inputText: testCase.content,
      translatedText,
      timeCost,
      inputTokens: 0, // 由于使用命令行工具,这里暂时无法获取token数
      outputTokens: 0,
      inputTokensCost: 0,
      outputTokensCost: 0,
      ...evaluationResult,
    };
    return resultObj;
  } catch (error) {
    // 清理文件
    try {
      if (fs.existsSync(inputFile)) fs.unlinkSync(inputFile);
      if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
    } catch (e) {
      console.warn('清理文件失败:', e.message);
    }

    // 格式化错误信息
    const errorDetails = {
      message: error.message,
      code: error.code || 'UNKNOWN',
      type: error.type || 'UNKNOWN',
      status: error.status || 'UNKNOWN',
      requestId: error.request_id || 'UNKNOWN'
    };

    console.error('错误详情:', JSON.stringify(errorDetails, null, 2));

    // 返回错误结果
    const errorResult = {
      modelName: model.name,
      testCaseName: testCase.name,
      targetLanguage: testCase.targetLanguage,
      error: errorDetails,
      timeCost: (Date.now() - startTime) / 1000,
      inputTokensCost: 0,
      outputTokensCost: 0,
      semanticAccuracy: 0,
      markdownPreservation: 0,
      terminologyConsistency: 0,
      fluency: 0,
      styleMatching: 0,
      wrongStructure: true,
      issues: [`执行失败: ${errorDetails.message}`],
      suggestions: ['请检查模型配置和API参数设置'],
    };

    return errorResult;
  }
}

/**
 * 获取特定模型的LLM客户端
 * @param {Object} model - 模型配置
 * @returns {Object} - LLM客户端
 */
function getLLMForModel(model) {
  if (model.type === 'azure') {
    // 使用LangChain的ChatOpenAI支持Azure OpenAI
    return new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.1,
      maxTokens: 4000,
      configuration: {
        baseUrl: process.env.OPENAI_BASE_URL,
      },
    });
  } else if (model.type === 'openai' || model.type === 'aliyun') {
    // 使用环境变量中的端点和API密钥
    return new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      model: model.name,
      temperature: 0.1, // 降低随机性
      maxTokens: 4000, // 根据文档长度调整
      maxRetries: 3,
      timeout: 120000, // 2分钟超时
      configuration: {
        baseUrl: process.env.OPENAI_BASE_URL,
      },
    });
  } else if (model.type === 'anthropic') {
    // Anthropic模型通过API请求直接实现
    return { type: 'anthropic' };
  } else {
    throw new Error(`不支持的模型类型: ${model.type}`);
  }
}

/**
 * 翻译Markdown文本
 * @param {Object} llm - LLM客户端
 * @param {string} markdown - Markdown文本
 * @param {string} targetLanguage - 目标语言
 * @param {Object} model - 模型配置
 * @returns {Promise<Object>} - 翻译结果
 */
async function translateMarkdown(llm, markdown, targetLanguage, model) {
  // 构建系统提示
  const systemPrompt = `你是一个专业的翻译助手，擅长将文本翻译成${targetLanguage}，同时保持原文的格式、风格和专业性。
特别注意：
1. 保留所有Markdown格式，包括标题、列表、代码块、表格等
2. 保持专业术语的一致性和准确性
3. 保留原文中的代码部分，不要翻译代码块中的代码或变量名
4. 保持原文的段落结构和空行`;

  // 构建用户提示
  const userPrompt = `请将以下Markdown文本翻译成${targetLanguage}，确保保留所有Markdown语法和格式：

${markdown}

要求：
1. 保留所有Markdown格式和语法
2. 代码块内的代码和变量名请保持原样不要翻译
3. 表格结构和对齐方式需要保持不变
4. 保持专业术语的准确性`;

  try {
    let translatedText = '';
    let inputTokens = 0;
    let outputTokens = 0;

    if (model.type === 'azure' || model.type === 'openai' || model.type === 'aliyun') {
      // OpenAI 或 Azure OpenAI API via LangChain
      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ];

      const response = await llm.invoke(messages);
      translatedText = response.content;
      // 只能估算token数量，因为LangChain不直接提供这些信息
      // 简单估算：每个单词约1.3个token
      const wordCount = (systemPrompt + userPrompt).split(/\s+/).length;
      inputTokens = Math.round(wordCount * 1.3);
      outputTokens = Math.round(translatedText.split(/\s+/).length * 1.3);
    } else if (model.type === 'anthropic') {
      // Anthropic API
      const API_KEY = process.env.ANTHROPIC_API_KEY;

      // 使用axios调用API
      const response = await axios({
        method: 'POST',
        url: 'https://api.anthropic.com/v1/messages',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
        },
        data: {
          model: model.name,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
          max_tokens: 4000,
          temperature: 0.1,
        },
      });

      // axios直接返回解析后的JSON数据
      const data = response.data;

      if (data.error) {
        throw new Error(`Anthropic API错误: ${data.error.message}`);
      }

      translatedText = data.content[0].text;
      // Anthropic不直接提供token信息，使用估算
      const wordCount = (systemPrompt + userPrompt).split(/\s+/).length;
      inputTokens = Math.round(wordCount * 1.3);
      outputTokens = Math.round(translatedText.split(/\s+/).length * 1.3);
    }

    return {
      translatedText,
      inputTokens,
      outputTokens,
    };
  } catch (error) {
    console.error('翻译错误详情:', {
      message: error.message,
      code: error.code || 'UNKNOWN',
      type: error.type || 'UNKNOWN',
      status: error.status || 'UNKNOWN',
      requestId: error.request_id || 'UNKNOWN',
      model: model.name,
      targetLanguage
    });

    if (error.error && error.error.message) {
      console.error('API错误信息:', error.error.message);
    }

    throw error;  // 继续抛出错误，但已经打印了有用的信息
  }
}
