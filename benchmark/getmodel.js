import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

/**
 * 从JSON文件中提取所有模型的名称并写入指定文件
 * @param {string} inputFilePath - 输入JSON文件路径
 * @param {string} outputFilePath - 输出文件路径
 * @returns {string[]} 模型名称数组
 */
function extractAndSaveModelNames(inputFilePath, outputFilePath) {
  try {
    // 读取JSON文件
    const rawData = fs.readFileSync(inputFilePath, 'utf8');

    // 解析JSON内容
    const models = JSON.parse(rawData);

    // 检查是否是数组
    if (!Array.isArray(models) || models.length === 0) {
      throw new Error('文件内容不是一个数组 或 数组为空');
    }

    // 提取所有模型的name字段
    const modelNames = models.map(model => model.modelId);

    // 确保输出目录存在
    const outputDir = path.dirname(outputFilePath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 将结果写入文件
    fs.writeFileSync(outputFilePath, JSON.stringify(modelNames, null, 2), 'utf8');
    console.log(`模型名称已保存到: ${outputFilePath}`);

    return modelNames;
  } catch (error) {
    console.error('提取或保存模型名称时出错:', error.message);
    return [];
  }
}

// 使用示例
// 根据 https://bailian.console.aliyun.com/?userCode=okjhlpr5#/model-market 获取模型列表
// 接口 https://bailian.console.aliyun.com/data/api.json?action=BroadScopeAspnGateway&product=sfm_bailian&api=zeldaEasy.broadscope-platform.modelCenter.getModels&_v=undefined
// 相关说明 https://zhuanlan.zhihu.com/p/20988126752
// 模型列表保存在 model.json 文件中
const modelJsonPath = path.join(__dirname, 'benchmark', 'model.json');
const outputFilePath = path.join(__dirname, 'benchmark', 'modelNames.json');
const names = extractAndSaveModelNames(modelJsonPath, outputFilePath);
console.log('模型名称数量:', names.length);

// 如果只想导出函数
export { extractAndSaveModelNames };
