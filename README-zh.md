# ai-markdown-translator

[![NPM version](https://img.shields.io/npm/v/ai-markdown-translator.svg?style=flat)](https://www.npmjs.org/package/ai-markdown-translator)
[![CI](https://github.com/h7ml/ai-markdown-translator/actions/workflows/ci.yml/badge.svg)](https://github.com/h7ml/ai-markdown-translator/actions/workflows/ci.yml)
![NPM Downloads](https://img.shields.io/npm/dw/ai-markdown-translator)
![GitHub License](https://img.shields.io/github/license/h7ml/ai-markdown-translator)

ai-markdown-translator是一个命令行工具，可以使用OpenAI的语言模型，将Markdown文件从一种语言翻译成另一种语言。它在翻译内容的同时保留了Markdown的语法。

## 特性

- 使用OpenAI的模型将Markdown文件翻译成任何支持的语言
- 在翻译过程中保留Markdown语法
- 支持通过命令行参数或环境变量进行灵活配置
- 跨平台支持（Windows、macOS、Linux）

## 先决条件

- Node.js (v14或更高版本)
- npm（通常随Node.js一起提供）
- OpenAI API密钥

## 安装

1. 克隆此仓库或下载源代码。
2. 在终端中导航至项目目录。
3. 安装依赖项:

```bash
npm install
```

4. 构建项目:

```bash
npm run build
```

5. （可选）将CLI打包为一个独立可执行文件:

```bash
npm run package
```

这将在 `bin` 目录中为Windows，macOS和Linux创建可执行文件。

## 脚本

- **build**: 将TypeScript文件编译为JavaScript。
- **start**: 使用Node.js运行CLI工具。
- **package**: 创建CLI的独立可执行文件。
- **lint**: 运行ESLint以检查代码质量问题。
- **lint:fix**: 自动修复lint问题。
- **format**: 使用Prettier格式化代码。
- **format:check**: 检查代码格式化情况，但不做修改。

## 使用方法

您可以使用Node.js，`npx`，或作为一个独立的可执行文件（如果您已经打包过它）来运行CLI工具。

### 使用Node.js

```bash
node dist/index.js --input <input-file> --output <output-file> --language <target-language> [options]
```

### 使用npx

```bash
npx ai-markdown-translator -i <input-file> -o <output-file> -l <target-language> [options]
```

### 使用独立的可执行文件

```bash
./ai-markdown-translator --input <input-file> --output <output-file> --language <target-language> [options]
```

### 选项

- `--input`, `-i`: 输入Markdown文件（必须）
- `--output`, `-o`: 输出Markdown文件（必须）
- `--language`, `-l`: 目标翻译语言（必须）
- `--openai-url`: OpenAI API URL（默认: 使用OPENAI_URL环境变量）
- `--api-key`: OpenAI API Key（默认: 使用API_KEY环境变量）
- `--model`: 使用的OpenAI Model（默认: 使用MODEL环境变量或'gpt-3.5-turbo'）
- `--help`, `-h`: 显示帮助

## 环境变量

您可以设置以下环境变量，而不是将它们作为命令行参数传递：

- `OPENAI_URL`: OpenAI API的URL
- `API_KEY`: 您的OpenAI API密钥
- `MODEL`: 要使用的OpenAI模型（例如'gpt-3.5-turbo'）

您可以在项目根目录的`.env`文件中设置这些变量，或者在shell中导出它们。

## 示例

1. 将一个Markdown文件从英语翻译成西班牙语:

```bash
./ai-markdown-translator --input english.md --output spanish.md --language "Spanish"
```

2. 使用特定的OpenAI模型进行翻译:

```bash
./ai-markdown-translator --input input.md --output output.md --language "French" --model "gpt-4"
```

3. 使用自定义的OpenAI URL和API密码进行翻译:

```bash
./ai-markdown-translator --input input.md --output output.md --language "German" --openai-url "https://api.302.ai/v1/chat/completions" --api-key "sk-302-api-key"
```

4. 使用`npx`来翻译一个Markdown文件：

```bash
npx ai-markdown-translator -i input.md -o output.md -l "Italian"
```

## 许可证

[MIT许可](LICENSE)

## Git信息

- **仓库**: [h7ml/ai-markdown-translator](https://github.com/h7ml/ai-markdown-translator)
- **问题**: [报告问题](https://github.com/h7ml/ai-markdown-translator/issues)

## 版本信息

- **当前版本**: 1.0.1
- **NPM包**: [ai-markdown-translator](https://www.npmjs.com/package/ai-markdown-translator)

## CI信息

此项目使用GitHub Action进行持续集成。CI工作流包括:

- 使用ESLint对代码进行lint
- 运行测试（如果适用）
- 构建项目
- 缓存依赖项以加速构建

## 贡献

欢迎大家提交Pull Request对本项目进行贡献！

## 技术支持

如果您遇到任何问题或有任何疑问，请在本仓库开一共新的问题。
