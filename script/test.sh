#!/bin/bash

# 确保输出目录存在
mkdir -p prompts_translated

# 使用环境变量设置BaseURL，如果未设置则使用默认值
OPENAI_BASE_URL=${OPENAI_BASE_URL:-"https://models.inference.ai.azure.com/chat/completions"}
echo "使用API基础URL: ${OPENAI_BASE_URL}"

# 翻译为英文 - GPT-4o
echo "翻译为英文 - GPT-4o"
node ./dist/index.js -i ./src/prompts/system.md -o ./prompts_translated/system-gpt-4o-en.md -l English --openai-url ${OPENAI_BASE_URL} --api-key ${OPENAI_API_KEY} --model gpt-4o

# 翻译为日文 - Ministral-3B
echo "翻译为日文 - Ministral-3B"
node ./dist/index.js -i ./src/prompts/system.md -o ./prompts_translated/system-ministral-3b-ja.md -l Japanese --openai-url ${OPENAI_BASE_URL} --api-key ${OPENAI_API_KEY} --model Ministral-3B

# 翻译为法语 - Ministral-3B
echo "翻译为法语 - Ministral-3B"
node ./dist/index.js -i ./src/prompts/system.md -o ./prompts_translated/system-phi-3.5-mini-instruct-fr.md -l 法语 --openai-url ${OPENAI_BASE_URL} --api-key ${OPENAI_API_KEY} --model Ministral-3B

# 翻译为中文 - Claude 3.5
echo "翻译为中文 - Claude 3.5"
node ./dist/index.js -i ./src/prompts/system.md -o ./prompts_translated/system-claude-3.5-zh.md -l 中文 --openai-url ${OPENAI_BASE_URL} --api-key ${OPENAI_API_KEY} --model claude-3-5-sonnet

# 翻译为德语 - GPT-4
echo "翻译为德语 - GPT-4"
node ./dist/index.js -i ./src/prompts/system.md -o ./prompts_translated/system-gpt-4-de.md -l German --openai-url ${OPENAI_BASE_URL} --api-key ${OPENAI_API_KEY} --model gpt-4

# 翻译为西班牙语 - Llama 3
echo "翻译为西班牙语 - Llama 3"
node ./dist/index.js -i ./src/prompts/system.md -o ./prompts_translated/system-llama-3-70b-es.md -l Spanish --openai-url ${OPENAI_BASE_URL} --api-key ${OPENAI_API_KEY} --model llama-3-70b

# 翻译为俄语 - Gemini Pro
echo "翻译为俄语 - Gemini Pro"
node ./dist/index.js -i ./src/prompts/system.md -o ./prompts_translated/system-gemini-pro-ru.md -l Russian --openai-url ${OPENAI_BASE_URL} --api-key ${OPENAI_API_KEY} --model gemini-pro

# 翻译为韩语 - Phi-3 Mini
echo "翻译为韩语 - Phi-3 Mini"
node ./dist/index.js -i ./src/prompts/system.md -o ./prompts_translated/system-phi-3-mini-ko.md -l Korean --openai-url ${OPENAI_BASE_URL} --api-key ${OPENAI_API_KEY} --model phi-3-mini --locale ko

echo "测试完成!"
