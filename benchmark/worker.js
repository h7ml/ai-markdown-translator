import { parentPort } from 'worker_threads';
import { runBenchmark } from './benchmark.js';
import { fileURLToPath } from 'url';
import path from 'path';

// 设置 __filename 和 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 监听来自主线程的消息
parentPort.on('message', async ({ model, testCases, iteration, intervalMs }) => {
  try {
    for (const testCase of testCases) {
      // 发送进度信息到主线程
      parentPort.postMessage({
        type: 'progress',
        message: `执行基准测试 [${iteration}]: ${model.name} / ${testCase.name}`
      });

      const result = await runBenchmark(model, testCase);

      // 发送结果到主线程
      parentPort.postMessage({
        type: 'result',
        result,
        model: model.name,
        testCase: testCase.name,
        timeCost: result.timeCost,
        cost: result.inputTokensCost + result.outputTokensCost
      });

      // 测试用例之间添加间隔
      if (testCase !== testCases[testCases.length - 1]) {
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
      }
    }

    // 通知主线程该模型的所有测试已完成
    parentPort.postMessage({
      type: 'complete',
      model: model.name
    });
  } catch (error) {
    // 发送错误信息到主线程
    parentPort.postMessage({
      type: 'error',
      error: error.message,
      model: model.name
    });
  }
}); 
