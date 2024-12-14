以下是经过修订和整合的 `ai-markdown-translator` 文档，其中结合了 `npx` 和 `./ai-markdown-translator` 的示例：

---

# ai-markdown-translator

<div>
  <a href="https://www.npmjs.org/package/ai-markdown-translator"><img src="https://img.shields.io/npm/v/ai-markdown-translator.svg?style=flat" alt="NPM版本"></a>
  <a href="https://github.com/h7ml/ai-markdown-translator/actions/workflows/ci.yml"><img src="https://github.com/h7ml/ai-markdown-translator/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://github.com/h7ml/ai-markdown-translator/actions/workflows/release.yml"><img src="https://github.com/h7ml/ai-markdown-translator/actions/workflows/release.yml/badge.svg" alt="Release"></a>
  <a href="https://www.npmjs.org/package/ai-markdown-translator"><img src="https://img.shields.io/npm/dw/ai-markdown-translator" alt="NPM下载"></a>
  <a href="https://www.npmjs.org/package/ai-markdown-translator"><img src="https://img.shields.io/npm/l/ai-markdown-translator" alt="NPM许可证"></a>
  <a href="https://github.com/h7ml/ai-markdown-translator/stargazers"><img src="https://img.shields.io/github/stars/h7ml/ai-markdown-translator.svg" alt="GitHub Stars"></a>
  <a href="https://github.com/h7ml/ai-markdown-translator/issues"><img src="https://img.shields.io/github/issues/h7ml/ai-markdown-translator.svg" alt="GitHub问题"></a>
  <a href="https://github.com/h7ml/ai-markdown-translator/network/members"><img src="https://img.shields.io/github/forks/h7ml/ai-markdown-translator.svg" alt="GitHub分支"></a>
  <a href="https://github.com/h7ml/ai-markdown-translator/graphs/contributors"><img src="https://img.shields.io/github/contributors/h7ml/ai-markdown-translator.svg" alt="GitHub贡献者"></a>
</div>

[English](README.md) | [中文](README-zh.md)

`ai-markdown-translator` 是一个命令行工具，能利用OpenAI的语言模型将Markdown文件从一种语言翻译成另一种语言。它在翻译内容的同时保持了Markdown语法的完整性。

## 特性

- 使用OpenAI的模型将Markdown文件翻译成任何受支持的语言。
- 在翻译过程中保持Markdown语法。
- 通过命令行参数或环境变量灵活配置。

## 先决条件

- Node.js（v14或更高版本）
- npm（通常与Node.js一起提供）
- OpenAI API密钥

## 安装

1. 克隆此仓库或下载源代码。
2. 在终端中导航到项目目录。
3. 安装依赖：

```bash
npm install
```

4. 构建项目：

```bash
npm run build
```

## 脚本

- `build`：将TypeScript文件编译成JavaScript。
- `start`：使用Node.js运行编译的JavaScript。
- `lint`：运行ESLint以检查 TypeScript 文件中的代码质量问题。
- `lint:fix`：自动修复 TypeScript 文件中的linting问题。
- `format`：使用Prettier格式化`src`目录中多种文件类型的代码。
- `format:check`：检查代码格式，但不进行修改`src`目录中多种文件类型的代码。
- `postbuild`：使编译的`index.js`文件可执行。
- `changelog`：基于常规提交生成更新日志。
- `version`：在版本控制时更新更新日志并将其暂存为提交。
- `test`：构建项目并运行测试。

## 使用方法

你可以使用Node.js、`npx`或者作为独立的可执行文件运行CLI工具（如果你打包过它）。

### 使用Node.js

```bash
node dist/index.js --input <输入文件> --output <输出文件> --language <目标语言> [选项]
```

### 使用npx

```bash
npx ai-markdown-translator -i <输入文件> -o <输出文件> -l <目标语言> [选项]
```

例如：

```bash
npx ai-markdown-translator -u https://gitee.com/h7ml/ai-markdown-translator/raw/main/README.md -o output.md -l "Italian"
```

### 使用独立的可执行文件

```bash
./ai-markdown-translator --input <输入文件> --output <输出文件> --language <目标语言> [选项]
```

## 选项

- `--input`, `-i`：输入Markdown文件（`--url`的替代选项）。
- `--url`, `-u`：要翻译的Markdown文件的URL（`--input`的替代选项）。
- `--output`, `-o`：输出Markdown文件（如果未提供，则默认为输入文件名）。
- `--language`, `-l`：翻译的目标语言（必需）。
- `--openai-url`：OpenAI API URL (默认：使用 `OPENAI_URL` 环境变量）。
- `--api-key`：OpenAI API密钥 (默认：使用 `API_KEY` 环境变量）。
- `--model`：要使用的OpenAI模型 (默认：使用 `MODEL` 环境变量或 `gpt-3.5-turbo`）。
- `--help`, `-h`：显示帮助。
- `--show-version`, `-v`：显示版本。

> 注意：`--input` 和 `--url` 是互斥的；你必须提供其中之一。

## 环境变量

你可以设置以下环境变量，而不是将它们作为命令行参数传递：

- `OPENAI_URL`：OpenAI API的URL。
- `API_KEY`：你的OpenAI API密钥。
- `MODEL`：要使用的OpenAI模型（例如，`'gpt-3.5-turbo'`）。

你可以在项目根目录中的`.env`文件中设置这些变量，或者在你的shell中导出它们。

## 示例

1. **将Markdown文件从英语翻译成西班牙语：**

```bash
npx ai-markdown-translator -i english.md -o spanish.md -l "Spanish"
```

2. **使用特定的OpenAI模型进行翻译：**

```bash
npx ai-markdown-translator -i input.md -o output.md -l "French" --model "gpt-4"
```

3. **使用自定义的OpenAI URL和API密钥进行翻译：**

```bash
npx ai-markdown-translator -i input.md -o output.md -l "German" --openai-url "https://api.302.ai/v1/chat/completions" --api-key "sk-302-api-key"
```

4. **翻译URL中的Markdown内容：**

```bash
npx ai-markdown-translator -u https://gitee.com/h7ml/ai-markdown-translator/raw/main/README.md -o output.md -l "Italian"
```

## 许可证

[MIT许可证](LICENSE)

## Git信息

- **仓库**：[h7ml/ai-markdown-translator](https://github.com/h7ml/ai-markdown-translator)
- **问题**：[报告问题](https://github.com/h7ml/ai-markdown-translator/issues)

## 版本信息

- **当前版本**：1.0.6
- **NPM包**：[ai-markdown-translator](https://www.npmjs.com/package/ai-markdown-translator)

## CI信息

此项目使用GitHub Actions进行持续集成。CI工作流包括：

- 使用ESLint对代码进行linting
- 运行测试（如果适用）
- 构建项目
- 缓存依赖以加速构建

## 贡献

欢迎贡献！请随时提交Pull Request。

## 支持

如果你遇到任何问题或有任何问题，请在这个仓库中打开一个issue。

---

这个版本将 `npx` 和独立可执行文件 (`./ai-markdown-translator`) 的使用示例合并成了一个连贯的部分。如果你想进行任何进一步的调整，请告诉我！