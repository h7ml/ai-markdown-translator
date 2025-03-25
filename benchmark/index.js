/* global console */

import { Worker } from 'worker_threads';
import { testModels, testCases } from './testsuit.js';
import { analyzeReports } from './analyze.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取 report 目录的路径
const reportDir = path.join(__dirname, 'report');

// 确保 report 目录存在
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

// 创建worker实例
function createWorker(model, iteration, intervalMs) {
  return new Promise((resolve, reject) => {
    const workerPath = path.join(__dirname, 'worker.js');
    const worker = new Worker(workerPath);

    worker.on('message', (message) => {
      switch (message.type) {
        case 'progress':
          console.log(message.message);
          break;
        case 'result':
          reportOutput(message.result);
          console.log(
            `完成! ${message.model} / ${message.testCase} (耗时: ${message.timeCost.toFixed(2)}s, 成本: $${message.cost.toFixed(5)})`
          );
          break;
        case 'complete':
          console.log(`模型 ${message.model} 的所有测试完成`);
          resolve();
          worker.terminate();
          break;
        case 'error':
          console.error(`基准测试失败 (${message.model}): ${message.error}`);
          resolve();
          worker.terminate();
          break;
      }
    });

    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });

    // 将测试用例数据也传递给worker
    worker.postMessage({
      model,
      testCases,
      iteration,
      intervalMs
    });
  });
}

async function runBenchmarkWithInterval(iterations = 10, intervalMs = 1000) {
  const startTime = new Date();
  console.log(`开始基准测试: ${startTime.toLocaleString()}`);
  console.log(`加载了${testModels.length}个模型`);

  // 设置并发执行的worker数量
  const maxWorkers = 35;

  for (let i = 0; i < iterations; i++) {
    // 将模型列表分成多个批次
    for (let j = 0; j < testModels.length; j += maxWorkers) {
      const modelBatch = testModels.slice(j, Math.min(j + maxWorkers, testModels.length));
      console.log(`\n执行第 ${i + 1}/${iterations} 轮，批次 ${Math.floor(j / maxWorkers) + 1}/${Math.ceil(testModels.length / maxWorkers)}`);

      // 创建并发worker
      const workerPromises = modelBatch.map(model =>
        createWorker(model, i + 1, intervalMs)
      );

      // 等待当前批次完成
      await Promise.all(workerPromises);

      // 批次之间添加间隔，避免API限流
      if (j + maxWorkers < testModels.length || i < iterations - 1) {
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
      }
    }
  }

  const endTime = new Date();
  const totalTimeInSeconds = (endTime - startTime) / 1000;
  console.log(`\n基准测试结束: ${endTime.toLocaleString()}`);
  console.log(`总运行时间: ${totalTimeInSeconds.toFixed(2)} 秒`);
  console.log('所有基准测试完成！');

  // 分析报告
  try {
    await analyzeReports();
  } catch (error) {
    console.error('报告分析失败:', error);
  }
}

function reportOutput(result) {
  // 生成文件名: 模型名_测试用例名_目标语言_日期.json
  const fileName = `${result.modelName}_${result.testCaseName}_${result.targetLanguage || 'unknown'}_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  const filePath = path.join(reportDir, fileName);

  // 将结果保存为JSON文件
  fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
}

// 运行基准测试
// 每个模型运行2次，每次间隔1秒，确保总消耗token不超过0.2美元
runBenchmarkWithInterval(2, 1000);
