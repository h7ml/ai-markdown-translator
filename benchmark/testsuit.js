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
    const modelNames = [...supportData.both, ...supportData.nonStreamOnly];

    return modelNames;
  } catch (error) {
    console.error('加载模型名称时出错:', error.message);
    return [];
  }
}

// 使用模型名称
const modelNames = loadModelNames();
console.log(`加载了${modelNames.length}个模型名称`);

/**
 * 所有待测试模型
 * name: 模型名称
 * type: 模型类型，"openai"、"azure"或"anthropic"
 * tokenCostInfo: token成本信息
 */
// 根据模型名称确定类型和成本信息
function getModelTypeAndCost(modelName) {
  // 默认成本信息
  const defaultCost = {
    inputTokenCost: 5.0,
    outputTokenCost: 15.0
  };

  // 根据模型名称前缀确定类型和成本
  if (modelName.startsWith('gpt-')) {
    return {
      type: 'openai',
      tokenCostInfo: {
        inputTokenCost: 8.75,
        outputTokenCost: 35.0
      }
    };
  } else if (modelName.startsWith('qwen-')) {
    return {
      type: 'aliyun',
      tokenCostInfo: {
        inputTokenCost: 3.5,
        outputTokenCost: 14.0
      }
    };
  } else if (modelName.startsWith('deepseek-')) {
    return {
      type: 'openai',
      tokenCostInfo: {
        inputTokenCost: 22.33,
        outputTokenCost: 65.45
      }
    };
  } else if (modelName.startsWith('llama')) {
    return {
      type: 'openai',
      tokenCostInfo: {
        inputTokenCost: 6.0,
        outputTokenCost: 20.0
      }
    };
  } else if (modelName.startsWith('claude')) {
    return {
      type: 'anthropic',
      tokenCostInfo: {
        inputTokenCost: 10.0,
        outputTokenCost: 32.0
      }
    };
  }

  // 默认类型
  return {
    type: 'openai',
    tokenCostInfo: defaultCost
  };
}

// 动态生成测试模型列表
export const testModels = modelNames.slice(0, modelNames.length - 1).map(modelName => {
  const { type, tokenCostInfo } = getModelTypeAndCost(modelName);
  return {
    name: modelName,
    type: type,
    tokenCostInfo: tokenCostInfo
  };
});

// 如果需要包含特定的模型，可以手动添加
if (!testModels.some(model => model.name === 'gpt-4o')) {
  testModels.push({
    name: 'gpt-4o',
    type: 'openai',
    tokenCostInfo: {
      inputTokenCost: 8.75,
      outputTokenCost: 35
    }
  });
}

// 翻译测试用例
export const testCases = [
  {
    name: '技术文档',
    targetLanguage: 'Japanese',
    content: `# 示例技术文档
    
## 功能特点

这是一个针对**技术用户**设计的文档示例，包含以下特点：

1. 支持 *Markdown* 格式
2. 包含代码块示例
3. 支持表格展示

### 代码示例

\`\`\`javascript
function example() {
  console.log("Hello World!");
  return true;
}
\`\`\`

### 表格示例

| 功能 | 描述 | 支持状态 |
|------|------|----------|
| Markdown | 支持基本语法 | ✅ |
| 代码高亮 | 支持多种语言 | ✅ |
| 表格 | 支持基本表格格式 | ✅ |

请访问 [GitHub](https://github.com) 了解更多。`,
  },
  {
    name: '简单文本',
    targetLanguage: 'English',
    content: `# 简单示例

这是一个非常简单的Markdown文件，用于测试基本翻译功能。

## 第一部分

这里包含一些**加粗文本**和*斜体文本*。

## 第二部分

- 这是一个列表项
- 这是另一个列表项
  - 这是一个嵌套列表项`
  },
];

// 默认测试用例，如果没有指定则使用第一个
export const testCase = testCases[0];
