#!/usr/bin/env node

import { analyzeAllModels, saveResults } from './modelStreamAnalyzer.js';

/**
 * 主函数
 */
async function main() {
  console.log('开始分析模型流式输出支持情况...');
  const results = await analyzeAllModels();
  const outputPath = saveResults(results);
  console.log(`分析完成，结果已保存到 ${outputPath}`);
}

main().catch(error => {
  console.error('分析过程出错:', error);
  process.exit(1);
}); 
