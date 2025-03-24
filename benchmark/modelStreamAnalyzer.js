import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';

// 加载环境变量
config({ path: '.env.local' });

const __dirname = process.cwd();

/**
 * 动态加载模型名称
 * @returns {string[]} 模型名称数组
 */
function loadModelNames() {
  try {
    const modelNamesPath = path.join(__dirname, 'benchmark', 'modelNames.json');
    if (fs.existsSync(modelNamesPath)) {
      const rawData = fs.readFileSync(modelNamesPath, 'utf8');
      return JSON.parse(rawData);
    } else {
      console.error(`文件不存在: ${modelNamesPath}`);
      return [];
    }
  } catch (error) {
    console.error('加载模型名称时出错:', error.message);
    return [];
  }
}

/**
 * 获取特定模型的评估器
 * @param {string} modelName - 模型名称
 * @returns {ChatOpenAI} - LangChain Chat模型实例
 */
function getEvaluatorForModel(modelName) {
  let model = new ChatOpenAI({
    model: modelName,
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0,
    maxTokens: 100,
    configuration: {
      baseUrl: process.env.OPENAI_BASE_URL,
    },
  });

  return model;
}

/**
 * 测试模型是否支持非流式输出
 * @param {string} modelName - 模型名称
 * @returns {Promise<boolean>} 是否支持非流式输出
 */
async function testNonStreamSupport(modelName) {
  try {
    console.log(`测试模型非流式输出: ${modelName}`);
    const llm = getEvaluatorForModel(modelName);

    const result = await llm.invoke('你好', {
      streaming: false
    });

    console.log(`模型 ${modelName} 支持非流式输出`);
    return true;
  } catch (error) {
    console.error(`模型 ${modelName} 不支持非流式输出:`, error.message);
    return false;
  }
}

/**
 * 测试模型是否支持流式输出
 * @param {string} modelName - 模型名称
 * @returns {Promise<boolean>} 是否支持流式输出
 */
async function testStreamSupport(modelName) {
  try {
    console.log(`测试模型流式输出: ${modelName}`);
    const llm = getEvaluatorForModel(modelName);

    const result = await llm.invoke('你好', {
      streaming: true
    });

    console.log(`模型 ${modelName} 支持流式输出`);
    return true;
  } catch (error) {
    console.error(`模型 ${modelName} 不支持流式输出:`, error.message);
    return false;
  }
}

/**
 * 分析单个模型的流式输出支持情况
 * @param {string} modelName - 模型名称
 * @returns {Promise<Object>} 模型支持情况
 */
async function analyzeModelStreamingSupport(modelName) {
  try {
    console.log(`\n开始测试模型: ${modelName}`);

    // 先测试非流式输出
    const supportsNonStream = await testNonStreamSupport(modelName);

    // 再测试流式输出
    const supportsStream = await testStreamSupport(modelName);

    return {
      name: modelName,
      supportsNonStream,
      supportsStream
    };
  } catch (error) {
    console.error(`模型 ${modelName} 测试失败:`, error.message);
    return {
      name: modelName,
      supportsNonStream: false,
      supportsStream: false,
      error: error.message
    };
  }
}

/**
 * 分析所有模型的流式输出支持情况
 * @returns {Promise<Object>} 分析结果
 */
async function analyzeAllModels() {
  // 加载模型名称
  const modelNames = loadModelNames();
  console.log(`加载了${modelNames.length}个模型名称`);

  // 存储分析结果
  const results = {
    streamOnly: [], // 只支持流式输出的模型
    nonStreamOnly: [], // 只支持非流式输出的模型
    both: [], // 同时支持流式和非流式输出的模型
    none: [], // 两种方式都不支持的模型
    all: {} // 所有模型的详细信息
  };

  // 分析每个模型
  for (const modelName of modelNames) {
    const analysisResult = await analyzeModelStreamingSupport(modelName);

    // 记录详细信息
    results.all[modelName] = analysisResult;

    // 根据支持情况分类
    if (analysisResult.supportsStream && analysisResult.supportsNonStream) {
      results.both.push(modelName);
    } else if (analysisResult.supportsStream) {
      results.streamOnly.push(modelName);
    } else if (analysisResult.supportsNonStream) {
      results.nonStreamOnly.push(modelName);
    } else {
      results.none.push(modelName);
    }
  }

  return results;
}

/**
 * 保存分析结果到文件
 * @param {Object} results - 分析结果
 * @returns {string} 输出文件路径
 */
function saveResults(results) {
  const outputPath = path.join(__dirname, 'benchmark', 'modelStreamingSupport.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log('\n分析结果统计:');
  console.log(`同时支持流式和非流式输出: ${results.both.length} 个模型`);
  console.log(`仅支持流式输出: ${results.streamOnly.length} 个模型`);
  console.log(`仅支持非流式输出: ${results.nonStreamOnly.length} 个模型`);
  console.log(`两种方式都不支持: ${results.none.length} 个模型`);

  console.log('\n仅支持非流式输出的模型:');
  console.log(results.nonStreamOnly.join(', '));

  console.log('\n仅支持流式输出的模型:');
  console.log(results.streamOnly.join(', '));

  console.log('\n同时支持两种模式的模型:');
  console.log(results.both.join(', '));

  console.log(`\n结果已保存到: ${outputPath}`);

  return outputPath;
}

/**
 * 主函数
 */
async function main() {
  const results = await analyzeAllModels();
  saveResults(results);
}

// 直接调用时执行主函数
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

// 导出函数供其他模块使用
export {
  analyzeAllModels,
  analyzeModelStreamingSupport,
  saveResults
};
