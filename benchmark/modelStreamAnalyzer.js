import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';

// 加载环境变量
config({ path: '.env.local' });

const __dirname = process.cwd();

// 存储临时结果的路径
const TEMP_RESULTS_PATH = path.join(__dirname, 'benchmark', 'modelStreamingTempResults.json');

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
 * 带超时的Promise包装器
 * @param {Promise} promise - 原始Promise
 * @param {number} timeout - 超时时间(毫秒)
 * @param {string} errorMessage - 超时错误信息
 * @returns {Promise} 带超时的Promise
 */
function withTimeout(promise, timeout = 30000, errorMessage = '请求超时') {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeout)
    )
  ]);
}

/**
 * 测试模型是否支持非流式输出
 * @param {string} modelName - 模型名称
 * @returns {Promise<boolean>} 是否支持非流式输出
 */
async function testNonStreamSupport(modelName) {
  try {
    process.stdout.write(`测试模型非流式输出: ${modelName} `);
    const llm = getEvaluatorForModel(modelName);

    await withTimeout(
      llm.invoke('你好', { streaming: false }),
      30000,
      `模型 ${modelName} 非流式输出测试超时(30s)`
    );

    process.stdout.write(`✅\n`);
    return true;
  } catch (error) {
    process.stdout.write(`❌\n`);
    console.error(`  错误: ${error.message}`);
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
    process.stdout.write(`测试模型流式输出: ${modelName} `);
    const llm = getEvaluatorForModel(modelName);

    await withTimeout(
      llm.invoke('你好', { streaming: true }),
      30000,
      `模型 ${modelName} 流式输出测试超时(30s)`
    );

    process.stdout.write(`✅\n`);
    return true;
  } catch (error) {
    process.stdout.write(`❌\n`);
    console.error(`  错误: ${error.message}`);
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
    process.stdout.write(`\n开始测试模型: ${modelName}\n`);

    // 测试非流式输出
    const supportsNonStream = await testNonStreamSupport(modelName);

    // 无论非流式测试结果如何，都测试流式输出
    const supportsStream = await testStreamSupport(modelName);

    // 记录测试结果
    const result = {
      name: modelName,
      supportsNonStream,
      supportsStream,
      testedAt: new Date().toISOString()
    };

    // 打印当前模型的测试结果
    let status;
    if (supportsNonStream && supportsStream) {
      status = "同时支持流式和非流式输出";
    } else if (supportsNonStream) {
      status = "仅支持非流式输出";
    } else if (supportsStream) {
      status = "仅支持流式输出";
    } else {
      status = "不支持任何输出模式";
    }
    console.log(`模型 ${modelName} 测试结果: ${status}`);

    return result;
  } catch (error) {
    console.error(`模型 ${modelName} 测试失败:`, error.message);
    return {
      name: modelName,
      supportsNonStream: false,
      supportsStream: false,
      error: error.message,
      testedAt: new Date().toISOString()
    };
  }
}

/**
 * 保存临时分析结果
 * @param {Object} results - 分析结果
 * @param {Array} processedModels - 已处理的模型名称
 */
function saveTempResults(results, processedModels) {
  const tempData = {
    results,
    processedModels,
    timestamp: new Date().toISOString()
  };
  fs.writeFileSync(TEMP_RESULTS_PATH, JSON.stringify(tempData, null, 2));
  console.log(`临时结果已保存，已处理 ${processedModels.length} 个模型`);
}

/**
 * 加载临时分析结果
 * @returns {Object|null} 临时分析结果或null
 */
function loadTempResults() {
  try {
    if (fs.existsSync(TEMP_RESULTS_PATH)) {
      const rawData = fs.readFileSync(TEMP_RESULTS_PATH, 'utf8');
      const tempData = JSON.parse(rawData);
      console.log(`加载了临时结果，继续处理剩余模型...`);
      console.log(`上次保存时间: ${tempData.timestamp}`);
      return tempData;
    }
  } catch (error) {
    console.error('加载临时结果时出错:', error.message);
  }
  return null;
}

/**
 * 创建简单的控制台进度条
 * @param {number} current - 当前进度
 * @param {number} total - 总数
 * @param {number} barLength - 进度条长度
 * @returns {string} 格式化的进度条
 */
function progressBar(current, total, barLength = 30) {
  const progress = Math.min(Math.floor((current / total) * barLength), barLength);
  const emptyProgress = barLength - progress;
  const progressText = '█'.repeat(progress);
  const emptyProgressText = '░'.repeat(emptyProgress);
  const progressPercentage = Math.floor((current / total) * 100);

  return `[${progressText}${emptyProgressText}] ${current}/${total} (${progressPercentage}%)`;
}

/**
 * 分析所有模型的流式输出支持情况
 * @param {boolean} continueFromTemp - 是否从临时结果继续
 * @returns {Promise<Object>} 分析结果
 */
async function analyzeAllModels(continueFromTemp = true) {
  // 加载模型名称
  const modelNames = loadModelNames();
  console.log(`加载了${modelNames.length}个模型名称`);

  // 尝试加载临时结果
  let results = {
    streamOnly: [], // 仅支持流式输出
    nonStreamOnly: [], // 仅支持非流式输出
    both: [], // 同时支持流式和非流式输出
    none: [], // 不支持任何输出模式
    all: {} // 所有模型结果
  };

  let processedModels = [];

  if (continueFromTemp) {
    const tempData = loadTempResults();
    if (tempData) {
      results = tempData.results;
      processedModels = tempData.processedModels;
      console.log(`从上次中断处继续，已处理 ${processedModels.length} 个模型`);
    }
  }

  // 过滤出尚未处理的模型
  const remainingModels = modelNames.filter(name => !processedModels.includes(name));
  console.log(`剩余 ${remainingModels.length} 个模型需要处理`);

  // 显示初始进度条
  process.stdout.write(`\n${progressBar(processedModels.length, modelNames.length)}\n\n`);

  // 分析每个剩余模型
  for (const modelName of remainingModels) {
    try {
      const analysisResult = await analyzeModelStreamingSupport(modelName);

      // 记录详细信息
      results.all[modelName] = analysisResult;

      // 根据支持情况分类
      if (analysisResult.supportsNonStream && analysisResult.supportsStream) {
        results.both.push(modelName);
      } else if (analysisResult.supportsNonStream) {
        results.nonStreamOnly.push(modelName);
      } else if (analysisResult.supportsStream) {
        results.streamOnly.push(modelName);
      } else {
        results.none.push(modelName);
      }

      // 添加到已处理列表
      processedModels.push(modelName);

      // 每处理完一个模型就保存一次临时结果
      saveTempResults(results, processedModels);

      // 更新进度条
      const currentProgress = processedModels.length;
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(`${progressBar(currentProgress, modelNames.length)}\n`);

    } catch (error) {
      console.error(`处理模型 ${modelName} 时出错:`, error.message);
      processedModels.push(modelName);
      saveTempResults(results, processedModels);
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
