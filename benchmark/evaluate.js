/* global console */
import { ChatOpenAI } from '@langchain/openai';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { config } from 'dotenv';
import { z } from 'zod';

// 加载环境变量
config({ path: '.env.local' });

/**
 * 获取特定模型的评估器
 * @param {string} modelName - 模型名称
 * @returns {ChatOpenAI} - LangChain Chat模型实例
 */
function getEvaluatorForModel(modelName) {
  return new ChatOpenAI({
    model: modelName,
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0,
    maxTokens: 1000,
    configuration: {
      baseUrl: process.env.OPENAI_BASE_URL,
    },
  });
}

/**
 * 评估翻译质量和格式保留
 * @param {Object} originalData - 原始文本数据
 * @param {Object} translatedData - 翻译后的文本数据
 * @param {string} targetLanguage - 目标语言
 * @param {string} evaluatorModelName - 评估器模型名称
 */
export async function evaluate(
  originalData,
  translatedData,
  targetLanguage,
  evaluatorModelName = 'gpt-4o',
) {
  const evaluator = getEvaluatorForModel(evaluatorModelName);

  // 定义评估结果的结构
  const parser = StructuredOutputParser.fromZodSchema(
    z.object({
      semanticAccuracy: z
        .number()
        .min(0)
        .max(10)
        .describe('语义准确性评分(0-10)，评估翻译是否准确传达了原文的含义和信息'),
      markdownPreservation: z
        .number()
        .min(0)
        .max(10)
        .describe('Markdown格式保留评分(0-10)，评估翻译是否正确保留了原文的所有Markdown格式'),
      terminologyConsistency: z
        .number()
        .min(0)
        .max(10)
        .describe('术语一致性评分(0-10)，评估专业术语翻译的准确性和一致性'),
      fluency: z
        .number()
        .min(0)
        .max(10)
        .describe('语言流畅度评分(0-10)，评估翻译文本的自然程度和可读性'),
      styleMatching: z
        .number()
        .min(0)
        .max(10)
        .describe('风格匹配评分(0-10)，评估翻译文本是否保持了原文的语言风格'),
      wrongStructure: z
        .boolean()
        .describe('输出结构是否错误，如果返回的不是有效的Markdown或缺少重要部分就标记为true'),
      issues: z
        .array(z.string())
        .describe('翻译中的具体问题列表，每个问题应具体描述错误位置和类型'),
      suggestions: z
        .array(z.string())
        .describe('改进建议列表，为每个发现的问题提供具体的改进建议'),
    }),
  );

  // 构建评估提示
  const prompt = PromptTemplate.fromTemplate(`你是一位精通多种语言的专业翻译评估专家，需要对机器翻译的质量进行评估。

原始文本 (Markdown格式):
\`\`\`
{originalData}
\`\`\`

翻译后文本 (目标语言: {targetLanguage}):
\`\`\`
{translatedData}
\`\`\`

请根据以下几个维度对翻译质量进行评估，每个维度的评分范围为0-10分：

1. 语义准确性：翻译是否准确传达了原文的含义和信息
2. Markdown格式保留：翻译是否正确保留了原文的所有Markdown格式
3. 术语一致性：专业术语翻译的准确性和一致性
4. 语言流畅度：翻译文本的自然程度和可读性
5. 风格匹配：翻译文本是否保持了原文的语言风格

同时，请检查翻译是否存在结构性错误（如不是有效的Markdown或缺少重要部分）。

最后，提供具体的问题列表和改进建议。

{formatInstructions}
`);

  try {
    const result = await prompt.pipe(evaluator).invoke({
      originalData,
      translatedData,
      targetLanguage,
      formatInstructions: parser.getFormatInstructions(),
    });

    const parsed = await parser.parse(result.content);
    console.log(parsed);
    return parsed;
  } catch (error) {
    console.error('评估过程出错:', error);
    // 返回默认评估结果
    return {
      semanticAccuracy: 0,
      markdownPreservation: 0,
      terminologyConsistency: 0,
      fluency: 0,
      styleMatching: 0,
      wrongStructure: true,
      issues: ['评估过程出错: ' + error.message],
      suggestions: ['重新运行评估或检查输入数据'],
    };
  }
}
