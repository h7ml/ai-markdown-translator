import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

/**
 * 动态加载模型名称
 * @returns {string[]} 模型名称数组
 */
function loadModelNames() {
  try {
    const modelSupportPath = path.join(__dirname, 'benchmark', 'modelStreamingSupport.json');
    const rawData = fs.readFileSync(modelSupportPath, 'utf8');
    const supportData = JSON.parse(rawData);

    // 合并 both 和 nonStreamOnly 数组 
    // 只需要 deepseek 相关的
    const modelNames = [...supportData.both, ...supportData.nonStreamOnly];
    // 转化为小写
    return modelNames.filter(name => name.toLowerCase().includes('deepseek'));
  } catch (error) {
    console.error('加载模型名称时出错:', error.message);
    return [];
  }
}

// 使用模型名称
const modelNames = loadModelNames();
console.log(`加载了${modelNames.length}个模型名称`);

const inputFile = fs.readFileSync(path.join(__dirname, 'src', 'prompts', 'input.md'), 'utf8');
const complexCode = fs.readFileSync(path.join(__dirname, 'benchmark', 'complexCode.md'), 'utf8');

// 动态生成测试模型列表
export const testModels = modelNames.map(modelName => ({
  name: modelName,
  type: 'cli' // 使用命令行工具类型
}));

// 翻译测试用例
export const testCases = [
  {
    name: '复杂代码',
    targetLanguage: 'English',
    content: complexCode
  },
  {
    name: '复杂代码',
    targetLanguage: 'Japanese',
    content: complexCode
  },
  {
    name: '复杂代码',
    targetLanguage: 'French',
    content: complexCode
  },
  {
    name: '复杂代码',
    targetLanguage: 'German',
    content: complexCode
  },
  {
    name: '复杂代码',
    targetLanguage: 'Korean',
    content: complexCode
  },
  {
    name: '复杂代码',
    targetLanguage: 'Chinese',
    content: complexCode
  }
];
// 默认测试用例，如果没有指定则使用第一个
export const testCase = testCases[0];
