# ai-markdown-translator

[![NPM 版本](https://img.shields.io/npm/v/ai-markdown-translator.svg?style=flat)](https://www.npmjs.org/package/ai-markdown-translator)
[![CI](https://github.com/h7ml/ai-markdown-translator/actions/workflows/ci.yml/badge.svg)](https://github.com/h7ml/ai-markdown-translator/actions/workflows/ci.yml)
![NPM 下载量](https://img.shields.io/npm/dw/ai-markdown-translator)
![GitHub 许可证](https://img.shields.io/github/license/h7ml/ai-markdown-translator)

ai-markdown-translator 是一个命令行工具，使用 OpenAI 的语言模型将 Markdown 文件从一种语言翻译成另一种语言。它在翻译内容的同时保留了 Markdown 语法。

## 特性

- 将 Markdown 文件翻译成 OpenAI 模型支持的任意语言
- 在翻译过程中保留 Markdown 语法
- 通过命令行参数或环境变量进行灵活配置
- 跨平台支持（Windows，macOS，Linux）

## 预备条件

- Node.js（v14 或更高版本）
- npm（通常与 Node.js 一起提供）
- 一个 OpenAI API 密钥

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

5. (可选) 将 CLI 打包成一个独立的可执行文件：

```bash
npm run package
```

在 `bin` 目录中为 Windows、macOS 和 Linux 创建可执行文件。

## 脚本

- **build**：将 TypeScript 文件编译为 JavaScript。
- **start**：使用 Node.js 运行 CLI 工具。
- **package**：为 CLI 创建独立的可执行文件。
- **lint**：运行 ESLint 检查代码质量问题。
- **lint:fix**：自动修复 linting 问题。
- **format**：使用 Prettier 格式化代码。
- **format:check**：检查代码格式，不作更改。

## 用法

可以使用 Node.js，`npx`，或作为一个独立的可执行程序运行 CLI 工具（如果你已经打包了它）。

### 使用 Node.js

```bash
node dist/index.js --input <输入文件> --output <输出文件> --language <目标语言> [选项]
```

### 使用 npx

```bash
npx ai-markdown-translator -i <输入文件> -o <输出文件> -l <目标语言> [选项]
```

### 使用独立的可执行程序

```bash
./ai-markdown-translator --input <输入文件> --output <输出文件> --language <目标语言> [选项]
```

### 选项

- `--input`, `-i`：输入 Markdown 文件（必需）
- `--output`, `-o`：输出 Markdown 文件（必需）
- `--language`, `-l`：目标翻译语言（必需）
- `--openai-url`：OpenAI API URL（默认：使用环境变量 OPENAI_URL）
- `--api-key`：OpenAI API 密钥（默认：使用环境变量 API_KEY）
- `--model`：使用的 OpenAI 模型（默认：使用环境变量 MODEL 或 'gpt-3.5-turbo'）
- `--help`, `-h`：显示帮助

## 环境变量

可以设置以下环境变量，而无需将它们作为命令行参数传递：

- `OPENAI_URL`：OpenAI API 的 URL
- `API_KEY`：你的 OpenAI API 密钥
- `MODEL`：要使用的 OpenAI 模型（例如，'gpt-3.5-turbo'）

你可以在项目根目录的 `.env` 文件中设置这些参数，或在你的 shell 中导出它们。

## 示例

1. 将 Markdown 文件从英语翻译成西班牙语：

```bash
./ai-markdown-translator --input english.md --output spanish.md --language "Spanish"
```

2. 使用指定的 OpenAI 模型进行翻译：

```bash
./ai-markdown-translator --input input.md --output output.md --language "French" --model "gpt-4"
```

3. 使用自定义的 OpenAI URL 和 API 密钥进行翻译：

```bash
./ai-markdown-translator --input input.md --output output.md --language "German" --openai-url "https://api.302.ai/v1/chat/completions" --api-key "sk-302-api-key"
```

4. 使用 `npx` 翻译 Markdown 文件：

```bash
npx ai-markdown-translator -i input.md -o output.md -l "Italian"
```

## 许可证

[MIT 许可证](LICENSE)

## Git 信息

- **仓库**：[h7ml/ai-markdown-translator](https://github.com/h7ml/ai-markdown-translator)
- **问题**：[报告问题](https://github.com/h7ml/ai-markdown-translator/issues)

## 版本信息

- **当前版本**：1.0.2
- **NPM 包**：[ai-markdown-translator](https://www.npmjs.com/package/ai-markdown-translator)

## CI 信息

此项目使用 GitHub Actions 进行持续集成。CI 工作流包括：

- 使用 ESLint 检查代码
- 运行测试（如果适用）
- 构建项目
- 缓存依赖项以加快构建速度

## 贡献

欢迎贡献！请随时提交拉取请求。

## 支持

如果遇到任何问题或有任何问题，请在此库开一个问题。
