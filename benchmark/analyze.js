/* global console, process */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 获取 report 目录路径（用于读取原始数据）
const reportDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'report');

// 分析指标 - 更新为翻译质量评估指标
const METRICS = [
  'timeCost',
  'inputTokensCost',
  'outputTokensCost',
  'semanticAccuracy',
  'markdownPreservation',
  'terminologyConsistency',
  'fluency',
  'styleMatching',
];

/**
 * 将原始结果转换为报告格式
 * @param {Object[]} results - 原始结果数组
 * @returns {Object} 格式化的报告数据
 */
function formatResultsForReport(results) {
  // 按模型分组
  const modelGroups = {};
  // 按测试用例分组
  const testCaseGroups = {};

  // 收集所有问题和建议
  const issues = new Map();
  const suggestions = new Map();

  // 处理每个测试结果
  results.forEach((result) => {
    // 模型分组
    if (!modelGroups[result.modelName]) {
      modelGroups[result.modelName] = {
        name: result.modelName,
        testResults: [],
        totalTests: 0,
        totalTimeCost: 0,
        totalCost: 0,
        totalSemanticAccuracy: 0,
        totalMarkdownPreservation: 0,
        totalTerminologyConsistency: 0,
        totalFluency: 0,
        totalStyleMatching: 0,
      };
    }

    const modelGroup = modelGroups[result.modelName];
    modelGroup.testResults.push(result);
    modelGroup.totalTests++;
    modelGroup.totalTimeCost += result.timeCost || 0;
    modelGroup.totalCost += (result.inputTokensCost || 0) + (result.outputTokensCost || 0);
    modelGroup.totalSemanticAccuracy += result.semanticAccuracy || 0;
    modelGroup.totalMarkdownPreservation += result.markdownPreservation || 0;
    modelGroup.totalTerminologyConsistency += result.terminologyConsistency || 0;
    modelGroup.totalFluency += result.fluency || 0;
    modelGroup.totalStyleMatching += result.styleMatching || 0;

    // 测试用例分组
    if (!testCaseGroups[result.testCaseName]) {
      testCaseGroups[result.testCaseName] = {
        name: result.testCaseName,
        totalTests: 0,
        totalTimeCost: 0,
        totalCost: 0,
        totalSemanticAccuracy: 0,
        totalMarkdownPreservation: 0,
        totalTerminologyConsistency: 0,
        totalFluency: 0,
        totalStyleMatching: 0,
      };
    }

    const testCaseGroup = testCaseGroups[result.testCaseName];
    testCaseGroup.totalTests++;
    testCaseGroup.totalTimeCost += result.timeCost || 0;
    testCaseGroup.totalCost += (result.inputTokensCost || 0) + (result.outputTokensCost || 0);
    testCaseGroup.totalSemanticAccuracy += result.semanticAccuracy || 0;
    testCaseGroup.totalMarkdownPreservation += result.markdownPreservation || 0;
    testCaseGroup.totalTerminologyConsistency += result.terminologyConsistency || 0;
    testCaseGroup.totalFluency += result.fluency || 0;
    testCaseGroup.totalStyleMatching += result.styleMatching || 0;

    // 收集问题和建议
    if (result.issues) {
      result.issues.forEach((issue) => {
        issues.set(issue, (issues.get(issue) || 0) + 1);
      });
    }
    if (result.suggestions) {
      result.suggestions.forEach((suggestion) => {
        suggestions.set(suggestion, (suggestions.get(suggestion) || 0) + 1);
      });
    }
  });

  // 计算模型平均值
  const modelResults = Object.values(modelGroups).map((group) => ({
    name: group.name,
    averageTimeCost: group.totalTimeCost / group.totalTests,
    averageTotalCost: group.totalCost / group.totalTests,
    averageSemanticAccuracy: group.totalSemanticAccuracy / group.totalTests,
    averageMarkdownPreservation: group.totalMarkdownPreservation / group.totalTests,
    averageTerminologyConsistency: group.totalTerminologyConsistency / group.totalTests,
    averageFluency: group.totalFluency / group.totalTests,
    averageStyleMatching: group.totalStyleMatching / group.totalTests,
    testResults: group.testResults,
  }));

  // 计算测试用例平均值
  const testCaseResults = Object.values(testCaseGroups).map((group) => ({
    name: group.name,
    averageTimeCost: group.totalTimeCost / group.totalTests,
    averageTotalCost: group.totalCost / group.totalTests,
    averageSemanticAccuracy: group.totalSemanticAccuracy / group.totalTests,
    averageMarkdownPreservation: group.totalMarkdownPreservation / group.totalTests,
    averageTerminologyConsistency: group.totalTerminologyConsistency / group.totalTests,
    averageFluency: group.totalFluency / group.totalTests,
    averageStyleMatching: group.totalStyleMatching / group.totalTests,
  }));

  // 计算总体统计
  const totalTests = results.length;
  const overallStats = {
    totalTests,
    averageTimeCost: results.reduce((sum, r) => sum + (r.timeCost || 0), 0) / totalTests,
    averageTotalCost:
      results.reduce((sum, r) => sum + ((r.inputTokensCost || 0) + (r.outputTokensCost || 0)), 0) /
      totalTests,
    averageSemanticAccuracy:
      results.reduce((sum, r) => sum + (r.semanticAccuracy || 0), 0) / totalTests,
    averageMarkdownPreservation:
      results.reduce((sum, r) => sum + (r.markdownPreservation || 0), 0) / totalTests,
    averageTerminologyConsistency:
      results.reduce((sum, r) => sum + (r.terminologyConsistency || 0), 0) / totalTests,
    averageFluency: results.reduce((sum, r) => sum + (r.fluency || 0), 0) / totalTests,
    averageStyleMatching: results.reduce((sum, r) => sum + (r.styleMatching || 0), 0) / totalTests,
  };

  // 转换问题和建议为数组格式
  const commonIssues = Array.from(issues.entries())
    .map(([issue, count]) => ({ issue, count }))
    .sort((a, b) => b.count - a.count);

  const commonSuggestions = Array.from(suggestions.entries())
    .map(([suggestion, count]) => ({ suggestion, count }))
    .sort((a, b) => b.count - a.count);

  return {
    modelResults,
    testCaseResults,
    overallStats,
    commonIssues,
    commonSuggestions,
  };
}

/**
 * 保存分析报告
 * @param {Object[]} results - 分析结果
 * @returns {Promise<void>}
 */
async function saveReports(results) {
  const timestamp = new Date().toISOString().split('T')[0];
  const jsonPath = join(__dirname, `analysis_${timestamp}.json`);
  const mdPath = join(__dirname, `analysis_${timestamp}.md`);

  try {
    // 保存 JSON 格式
    await fs.writeFile(jsonPath, JSON.stringify(results, null, 2));
    console.log(`\n完整报告已保存至: ${jsonPath}`);

    // 转换结果格式并保存 Markdown 格式
    const formattedResults = formatResultsForReport(Object.values(results));
    await fs.writeFile(mdPath, generateMarkdownReport(formattedResults));
    console.log(`\n完整报告已保存至: ${mdPath}`);
  } catch (error) {
    console.error('保存报告失败:', error);
    throw error;
  }
}

/**
 * 生成Markdown格式的分析报告
 * @param {Object} results - 分析结果
 * @returns {string} Markdown格式的报告
 */
function generateMarkdownReport(results) {
  const { modelResults, testCaseResults, overallStats } = results;

  let report = `# AI翻译基准测试报告
生成时间: ${new Date().toLocaleString()}

## 总体统计

| 指标 | 值 |
|------|-----|
| 总测试次数 | ${overallStats.totalTests} |
| 平均耗时 | ${overallStats.averageTimeCost.toFixed(2)}s |
| 平均成本 | $${overallStats.averageTotalCost.toFixed(5)} |
| 平均语义准确性 | ${overallStats.averageSemanticAccuracy.toFixed(2)}/10 |
| 平均格式保留度 | ${overallStats.averageMarkdownPreservation.toFixed(2)}/10 |
| 平均术语一致性 | ${overallStats.averageTerminologyConsistency.toFixed(2)}/10 |
| 平均语言流畅度 | ${overallStats.averageFluency.toFixed(2)}/10 |
| 平均风格匹配度 | ${overallStats.averageStyleMatching.toFixed(2)}/10 |

## 模型性能对比

| 模型 | 平均耗时(s) | 平均成本($) | 语义准确性 | 格式保留 | 术语一致性 | 流畅度 | 风格匹配 |
|------|------------|------------|-----------|----------|------------|--------|----------|
${modelResults
      .map(
        (model) =>
          `| ${model.name} | ${model.averageTimeCost.toFixed(2)} | $${model.averageTotalCost.toFixed(
            5,
          )} | ${model.averageSemanticAccuracy.toFixed(
            2,
          )} | ${model.averageMarkdownPreservation.toFixed(
            2,
          )} | ${model.averageTerminologyConsistency.toFixed(2)} | ${model.averageFluency.toFixed(
            2,
          )} | ${model.averageStyleMatching.toFixed(2)} |`,
      )
      .join('\n')}

## 测试用例分析

| 测试用例 | 平均耗时(s) | 平均成本($) | 语义准确性 | 格式保留 | 术语一致性 | 流畅度 | 风格匹配 |
|---------|------------|------------|-----------|----------|------------|--------|----------|
${testCaseResults
      .map(
        (testCase) =>
          `| ${testCase.name} | ${testCase.averageTimeCost.toFixed(
            2,
          )} | $${testCase.averageTotalCost.toFixed(5)} | ${testCase.averageSemanticAccuracy.toFixed(
            2,
          )} | ${testCase.averageMarkdownPreservation.toFixed(
            2,
          )} | ${testCase.averageTerminologyConsistency.toFixed(2)} | ${testCase.averageFluency.toFixed(
            2,
          )} | ${testCase.averageStyleMatching.toFixed(2)} |`,
      )
      .join('\n')}

## 常见问题分析

### 最频繁出现的问题
${results.commonIssues.map((issue) => `- ${issue.issue} (出现${issue.count}次)`).join('\n')}

### 改进建议
${results.commonSuggestions
      .map((suggestion) => `- ${suggestion.suggestion} (提出${suggestion.count}次)`)
      .join('\n')}

## 详细测试记录

${modelResults
      .map(
        (model) => `
### ${model.name}

${model.testResults
            .map(
              (test) => `
#### 测试用例: ${test.testCaseName} (${test.targetLanguage})

| 指标 | 值 |
|------|-----|
| 耗时 | ${test.timeCost.toFixed(2)}s |
| 总成本 | $${(test.inputTokensCost + test.outputTokensCost).toFixed(5)} |
| 语义准确性 | ${test.semanticAccuracy}/10 |
| 格式保留 | ${test.markdownPreservation}/10 |
| 术语一致性 | ${test.terminologyConsistency}/10 |
| 流畅度 | ${test.fluency}/10 |
| 风格匹配 | ${test.styleMatching}/10 |

${test.issues && test.issues.length > 0
                  ? '**问题：**\n' + test.issues.map((issue) => `- ${issue}`).join('\n')
                  : ''
                }
${test.suggestions && test.suggestions.length > 0
                  ? '\n**建议：**\n' + test.suggestions.map((suggestion) => `- ${suggestion}`).join('\n')
                  : ''
                }`,
            )
            .join('\n')}`,
      )
      .join('\n')}
`;

  return report;
}

export async function analyzeReports() {
  try {
    // 读取所有 JSON 文件
    const files = await fs.readdir(reportDir);
    const jsonFiles = files.filter((file) => file.endsWith('.json'));

    // 读取并解析所有文件内容
    const reports = await Promise.all(
      jsonFiles.map(async (file) => {
        const content = await fs.readFile(path.join(reportDir, file), 'utf-8');
        return JSON.parse(content);
      }),
    );

    // 按模型、测试用例和目标语言分组
    const groupedReports = {};
    reports.forEach((report) => {
      const key = `${report.modelName}_${report.testCaseName}_${report.targetLanguage || 'unknown'
        }`;
      if (!groupedReports[key]) {
        groupedReports[key] = [];
      }
      groupedReports[key].push(report);
    });

    // 计算每组的平均值
    const results = {};
    for (const [key, group] of Object.entries(groupedReports)) {
      if (!group || group.length === 0) continue; // 添加检查，确保 group 已定义且不为空

      // 计算结构化生成能力得分
      const validRatio = group.filter((report) => !report.wrongStructure).length / group.length;

      // 结构稳定性评分规则：
      // 1.0: 100% 稳定 (10分)
      // 0.9-1.0: 90-99% 稳定 (8分)
      // 0.8-0.9: 80-90% 稳定 (6分)
      // 0.7-0.8: 70-80% 稳定 (4分)
      // 0.6-0.7: 60-70% 稳定 (2分)
      // <0.6: 不稳定 (0分)
      const structureScore =
        validRatio === 1
          ? 10
          : validRatio >= 0.9
            ? 8
            : validRatio >= 0.8
              ? 6
              : validRatio >= 0.7
                ? 4
                : validRatio >= 0.6
                  ? 2
                  : 0;

      // 过滤掉结构错误的数据
      const validReports = group.filter((report) => !report.wrongStructure);

      if (!validReports || validReports.length === 0) {
        // 添加检查，确保 validReports 已定义且不为空
        // 计算所有样本的平均时间和成本
        const avgTimeCost = group.reduce((sum, report) => sum + report.timeCost, 0) / group.length;
        const avgInputTokensCost =
          group.reduce((sum, report) => sum + report.inputTokensCost, 0) / group.length;
        const avgOutputTokensCost =
          group.reduce((sum, report) => sum + report.outputTokensCost, 0) / group.length;

        // 使用相同的惩罚计算规则
        const TIME_THRESHOLD = 5; // 更新为5秒，更符合翻译任务
        const TIME_MAX = 30;
        const COST_MAX = 0.25;

        // 时间惩罚计算
        const timePenalty = Math.max(
          0,
          Math.min(1, 1 - (avgTimeCost - TIME_THRESHOLD) / (TIME_MAX - TIME_THRESHOLD)),
        );

        // 成本惩罚计算
        const tokenCost = avgInputTokensCost + avgOutputTokensCost;
        const costPenalty = Math.max(0, Math.min(1, 1 - tokenCost / COST_MAX));

        // 结构稳定性为0分
        const structureScore = 0;

        results[key] = {
          modelName: group[0].modelName,
          testCaseName: group[0].testCaseName,
          targetLanguage: group[0].targetLanguage || 'unknown',
          sampleSize: group.length,
          validSamples: 0,
          structureScore: 0,
          translationScore: 0, // 更新为translationScore
          timePenalty: timePenalty * 10,
          costPenalty: costPenalty * 10,
          totalScore: timePenalty * 10 * 0.2 + costPenalty * 10 * 0.15,
          timeCost: avgTimeCost,
          inputTokensCost: avgInputTokensCost,
          outputTokensCost: avgOutputTokensCost,
          semanticAccuracy: 0,
          markdownPreservation: 0,
          terminologyConsistency: 0,
          fluency: 0,
          styleMatching: 0,
        };
        continue;
      }

      const avgMetrics = {};
      METRICS.forEach((metric) => {
        const values = validReports
          .map((report) => report[metric])
          .filter((value) => value !== undefined);

        if (values.length > 0) {
          avgMetrics[metric] = values.reduce((a, b) => a + b, 0) / values.length;
        }
      });

      // 计算翻译质量得分 (45%)
      const translationMetrics = [
        'semanticAccuracy',
        'markdownPreservation',
        'terminologyConsistency',
        'fluency',
        'styleMatching',
      ];
      const translationScore =
        translationMetrics.reduce((sum, metric) => {
          return sum + (avgMetrics[metric] || 0);
        }, 0) / translationMetrics.length;

      // 计算时间和成本的惩罚系数
      const TIME_THRESHOLD = 5; // 更新为5秒，更符合翻译任务
      const TIME_MAX = 30;
      const COST_THRESHOLD = 0.025;
      const COST_MAX = 0.25;

      // 时间惩罚：5秒内满分，5-30秒线性扣分，超过30秒为0分
      const timePenalty = Math.max(
        0,
        Math.min(1, 1 - (avgMetrics.timeCost - TIME_THRESHOLD) / (TIME_MAX - TIME_THRESHOLD)),
      );

      // 成本惩罚：每0.025元扣1分，0.25元及以上为0分
      const tokenCost = avgMetrics.inputTokensCost + avgMetrics.outputTokensCost;
      const costPenalty = Math.max(0, Math.min(1, 1 - tokenCost / COST_MAX));

      // 最终得分计算：
      // - 翻译质量占 45% (提高质量权重)
      // - 结构稳定占 20% (降低权重)
      // - 时间消耗占 20%
      // - 成本消耗占 15%
      const totalScore =
        translationScore * 0.45 +
        structureScore * 0.2 +
        timePenalty * 10 * 0.2 +
        costPenalty * 10 * 0.15;

      results[key] = {
        modelName: validReports[0].modelName,
        testCaseName: validReports[0].testCaseName,
        targetLanguage: validReports[0].targetLanguage || 'unknown',
        sampleSize: group.length, // 使用总样本数
        validSamples: validReports.length, // 有效样本数
        structureScore, // 结构化生成能力得分
        translationScore, // 翻译质量得分
        timePenalty: timePenalty * 10, // 时间惩罚得分
        costPenalty: costPenalty * 10, // 成本惩罚得分
        totalScore, // 综合得分
        ...avgMetrics,
      };
    }

    // 生成报告
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalTests: reports.length,
        uniqueModels: new Set(reports.map((r) => r.modelName)).size,
        uniqueTestCases: new Set(reports.map((r) => r.testCaseName)).size,
        uniqueLanguages: new Set(reports.map((r) => r.targetLanguage || 'unknown')).size,
      },
      results: Object.values(results).sort((a, b) => b.totalScore - a.totalScore),
    };

    // 保存报告
    await saveReports(results);

    return report;
  } catch (error) {
    console.error('分析报告生成失败:', error);
    throw error;
  }
}

// 如果直接运行此文件，则执行分析
if (import.meta.url === `file://${process.argv[1]}`) {
  analyzeReports().catch(console.error);
}
