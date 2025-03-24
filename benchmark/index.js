/* global console, setTimeout */

import { runBenchmark } from './benchmark.js';
import { testModels, testCases } from './testsuit.js';
import { analyzeReports } from './analyze.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// 获取 report 目录的路径
const reportDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'report');

// 确保 report 目录存在
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

async function runBenchmarkWithInterval(iterations = 10, intervalMs = 1000) {
  for (let i = 0; i < iterations; i++) {
    for (const model of testModels) {
      for (const testCase of testCases) {
        console.log(`执行基准测试 [${i + 1}/${iterations}]: ${model.name} / ${testCase.name}`);

        try {
          const result = await runBenchmark(model, testCase);
          reportOutput(result);
          console.log(
            `完成! 耗时: ${result.timeCost.toFixed(2)}s, 成本: $${(
              result.inputTokensCost + result.outputTokensCost
            ).toFixed(5)}`,
          );

          // 添加间隔，避免API限流
          if (
            i < iterations - 1 ||
            model !== testModels[testModels.length - 1] ||
            testCase !== testCases[testCases.length - 1]
          ) {
            await new Promise((resolve) => setTimeout(resolve, intervalMs));
          }
        } catch (error) {
          console.error(`基准测试失败: ${error.message}`);
        }
      }
    }
  }

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
  const fileName = `${result.modelName}_${result.testCaseName}_${result.targetLanguage || 'unknown'
    }_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  const filePath = path.join(reportDir, fileName);

  // 将结果保存为JSON文件
  fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
}

// 运行基准测试
// 每个模型运行1次，每次间隔1秒，确保总消耗token不超过0.2美元
runBenchmarkWithInterval(1, 1000);
