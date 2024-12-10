# ai-markdown-translator

[![NPM版本](https://img.shields.io/npm/v/ai-markdown-translator.svg?style=flat)](https://www.npmjs.org/package/ai-markdown-translator)
[![ci](https://github.com/h7ml/ai-markdown-translator/actions/workflows/ci.yml/badge.svg)](https://github.com/h7ml/ai-markdown-translator/actions/workflows/ci.yml)
[![NPM下载量](https://img.shields.io/npm/dm/ai-markdown-translator.svg)](https://npmcharts.com/compare/ai-markdown-translator?minimal=true)
[![License](https://img.shields.io/npm/l/ai-markdown-translator.svg)](https://github.com/h7ml/ai-markdown-translator/blob/master/LICENSE)

ai-markdown-translator是一个命令行工具，使用OpenAI的语言模型将Markdown文件从一种语言翻译到另一种语言。它在翻译内容的同时保留Markdown语法。

## 特性

- 使用OpenAI的模型将Markdown文件翻译成任何支持的语言
- 在翻译过程中保留Markdown语法
- 通过命令行参数或环境变量进行灵活的配置
- 跨平台支持（Windows，macOS，Linux）

## 前提条件

- Node.js（v14或更高版本）
- npm（通常与Node.js一起提供）
- 一个OpenAI API密钥

## 安装

1. 克隆此仓库或下载源代码。
2. 在终端中导航到项目目录。
3. 安装依赖项：

```bash
npm install
```

4. 构建项目：

```bash
npm run build
```

5. （可选）将CLI打包成一个独立的可执行文件：

```bash
npm run package
```

这将在`bin`目录下创建Windows，macOS和Linux的可执行文件。

## 脚本

- **构建**：将TypeScript文件编译为JavaScript。
- **启动**：使用Node.js运行CLI工具。
- **打包**：为CLI创建独立的可执行文件。
- **代码检查**：运行ESLint检查代码质量问题。
- **代码修复**：自动修复lint问题。
- **格式化**：使用Prettier格式化代码。
- **格式检查**：在不进行更改的情况下检查代码格式。

## 用法

您可以使用Node.js或作为独立的可执行文件（如果您已经打包过了）运行CLI工具。

### 使用Node.js

```bash
node dist/index.js --input <输入文件> --output <输出文件> --language <目标语言> [选项]
```

### 使用独立的可执行文件

```bash
./ai-markdown-translator --input <输入文件> --output <输出文件> --language <目标语言> [选项]
```

### 选项

- `--input`, `-i`: 输入Markdown文件（必需）
- `--output`, `-o`: 输出Markdown文件（必需）
- `--language`, `-l`: 翻译的目标语言（必需）
- `--openai-url`: OpenAI API URL（默认：使用OPENAI_URL环境变量）
- `--api-key`: OpenAI API密钥（默认：使用API_KEY环境变量）
- `--model`: 使用的OpenAI模型（默认：使用MODEL环境变量或'gpt-3.5-turbo'）
- `--help`, `-h`: 显示帮助

## 环境变量

您可以设置以下环境变量，而无需将它们作为命令行参数传递：

- `OPENAI_URL`: OpenAI API的URL
- `API_KEY`: 您的OpenAI API密钥
- `MODEL`: 要使用的OpenAI模型（例如，'gpt-3.5-turbo'）

您可以在项目根目录中的`.env`文件中设置这些环境变量，或在shell中导出它们。

## 示例

1. 将Markdown文件从英语翻译成西班牙语：

```bash
./ai-markdown-translator --input english.md --output spanish.md --language "西班牙语"
```

2. 使用指定的OpenAI模型翻译：

```bash
./ai-markdown-translator --input input.md --output output.md --language "法语" --model "gpt-4"
```

3. 使用自定义的OpenAI URL和API密钥翻译：

```bash
./ai-markdown-translator --input input.md --output output.md --language "德语" --openai-url "https://api.302.ai/v1/chat/completions" --api-key "sk-302-api-key"
```

## 许可证

[MIT许可证](LICENSE)

## Git信息

- **仓库**：[h7ml/ai-markdown-translator](https://github.com/h7ml/ai-markdown-translator)
- **问题**：[提交问题](https://github.com/h7ml/ai-markdown-translator/issues)

## 版本信息

- **当前版本**：1.0.0
- **NPM包**：[ai-markdown-translator](https://www.npmjs.com/package/ai-markdown-translator)

## CI信息

此项目使用GitHub Actions进行持续集成。CI工作流程包括：

- 使用ESLint进行代码缩进
- 运行测试（如果适用）
- 构建项目
- 缓存依赖项以加快构建速度

## 贡献

欢迎做出贡献！请随意提交Pull Request。

## 支持

如果您遇到任何问题或有任何疑问，请在此仓库中开启一个问题。