这是 `ai-markdown-translator` 文档的修订和合并版本，将 `npx` 和 `./ai-markdown-translator` 的示例结合在一起：

---

# ai-markdown-translator

[![NPM 版本](https://img.shields.io/npm/v/ai-markdown-translator.svg?style=flat)](https://www.npmjs.org/package/ai-markdown-translator)  
[![CI](https://github.com/h7ml/ai-markdown-translator/actions/workflows/ci.yml/badge.svg)](https://github.com/h7ml/ai-markdown-translator/actions/workflows/ci.yml)  
[![Release](https://github.com/h7ml/ai-markdown-translator/actions/workflows/release.yml/badge.svg)](https://github.com/h7ml/ai-markdown-translator/actions/workflows/release.yml)  
[![NPM 下载量](https://img.shields.io/npm/dw/ai-markdown-translator)](https://www.npmjs.org/package/ai-markdown-translator)  
[![NPM 许可证](https://img.shields.io/npm/l/ai-markdown-translator)](https://www.npmjs.org/package/ai-markdown-translator)
[![GitHub Stars](https://img.shields.io/github/stars/h7ml/ai-markdown-translator.svg)](https://github.com/h7ml/ai-markdown-translator/stargazers)  
[![GitHub Issues](https://img.shields.io/github/issues/h7ml/ai-markdown-translator.svg)](https://github.com/h7ml/ai-markdown-translator/issues)  
[![GitHub Forks](https://img.shields.io/github/forks/h7ml/ai-markdown-translator.svg)](https://github.com/h7ml/ai-markdown-translator/network/members)  
[![GitHub Contributors](https://img.shields.io/github/contributors/h7ml/ai-markdown-translator.svg)](https://github.com/h7ml/ai-markdown-translator/graphs/contributors)

[English](README.md) | [中文](README-zh.md)

`ai-markdown-translator` 是一个命令行工具，可以使用 OpenAI 的语言模型将 Markdown 文件从一种语言翻译成另一种语言。它在翻译内容的同时保留了 Markdown 语法。

## 功能

- 将 Markdown 文件翻译为 OpenAI 模型支持的任何语言。
- 在翻译过程中保留 Markdown 语法。
- 通过命令行参数或环境变量进行灵活配置。

## 先决条件

- Node.js (v14 或更高版本)
- npm (通常随 Node.js 一起安装)
- 一个 OpenAI API 密钥

## 安装

1. 克隆此存储库或下载源代码。
2. 在终端中导航到项目目录。
3. 安装依赖项：

```bash
npm install
```

4. 构建项目：

```bash
npm run build
```

## 脚本

- `build`: 将 TypeScript 文件编译为 JavaScript。
- `start`: 使用 Node.js 运行编译后的 JavaScript。
- `lint`: 使用 ESLint 检查 TypeScript 文件中的代码质量问题。
- `lint:fix`: 自动修复 TypeScript 文件中的 lint 问题。
- `format`: 使用 Prettier 格式化 `src` 目录中各种文件类型的代码。
- `format:check`: 检查代码格式而不对 `src` 目录中各种文件类型进行更改。
- `postbuild`: 使编译后的 `index.js` 文件可执行。
- `changelog`: 根据常规提交生成更改日志。
- `version`: 在版本控制时更新更改日志并将其暂存为提交。
- `test`: 构建项目并运行测试。

## 使用方法

您可以使用 Node.js、`npx` 或作为独立可执行文件（如果已打包）来运行 CLI 工具。

### 使用 Node.js

```bash
node dist/index.js --input <input-file> --output <output-file> --language <target-language> [options]
```

### 使用 npx

```bash
npx ai-markdown-translator -i <input-file> -o <output-file> -l <target-language> [options]
```

例如：

```bash
npx ai-markdown-translator -u https://gitee.com/h7ml/ai-markdown-translator/raw/main/README.md -o output.md -l "Italian"
```

### 使用独立可执行文件

```bash
./ai-markdown-translator --input <input-file> --output <output-file> --language <target-language> [options]
```

## 选项

- `--input`, `-i`: 输入的 Markdown 文件（作为 `--url` 的替代）。
- `--url`, `-u`: 要翻译的 Markdown 文件的 URL（作为 `--input` 的替代）。
- `--output`, `-o`: 输出的 Markdown 文件（必填）。
- `--language`, `-l`: 翻译的目标语言（必填）。
- `--openai-url`: OpenAI API 的 URL（默认使用 `OPENAI_URL` 环境变量）。
- `--api-key`: OpenAI API 密钥（默认使用 `API_KEY` 环境变量）。
- `--model`: 使用的 OpenAI 模型（默认使用 `MODEL` 环境变量或 `gpt-3.5-turbo`）。
- `--help`, `-h`: 显示帮助。
- `--show-version`, `-v`: 显示版本。

> 注意：`--input` 和 `--url` 是互斥的；必须提供其中之一。

## 环境变量

可以设置以下环境变量，而不是作为命令行参数传递：

- `OPENAI_URL`: OpenAI API 的 URL。
- `API_KEY`: 您的 OpenAI API 密钥。
- `MODEL`: 使用的 OpenAI 模型（例如 `'gpt-3.5-turbo'`）。

可以在项目根目录的 `.env` 文件中设置这些变量或在 shell 中导出它们。

## 示例

1. **将 Markdown 文件从英文翻译成西班牙语：**

```bash
npx ai-markdown-translator -i english.md -o spanish.md -l "Spanish"
```

2. **使用特定 OpenAI 模型进行翻译：**

```bash
npx ai-markdown-translator -i input.md -o output.md -l "French" --model "gpt-4"
```

3. **使用自定义 OpenAI URL 和 API 密钥进行翻译：**

```bash
npx ai-markdown-translator -i input.md -o output.md -l "German" --openai-url "https://api.302.ai/v1/chat/completions" --api-key "sk-302-api-key"
```

4. **翻译 URL 的 Markdown 内容：**

```bash
npx ai-markdown-translator -u https://gitee.com/h7ml/ai-markdown-translator/raw/main/README.md -o output.md -l "Italian"
```

## 许可证

[MIT License](LICENSE)

## Git 信息

- **仓库**: [h7ml/ai-markdown-translator](https://github.com/h7ml/ai-markdown-translator)
- **问题**: [报告问题](https://github.com/h7ml/ai-markdown-translator/issues)

## 版本信息

- **当前版本**: 1.0.6
- **NPM 包**: [ai-markdown-translator](https://www.npmjs.com/package/ai-markdown-translator)

## CI 信息

该项目使用 GitHub Actions 进行持续集成。CI 工作流包括：

- 使用 ESLint 对代码进行 lint 检查
- 运行测试（如适用）
- 构建项目
- 缓存依赖项以加快构建速度

## 贡献

欢迎贡献！请随时提交 Pull Request。

## 支持

如果遇到任何问题或有任何问题，请在此存储库中打开一个问题。

---

此版本将 `npx` 和独立可执行文件 (`./ai-markdown-translator`) 的使用示例合并到一个连贯的部分中。如需进一步调整，请告诉我！