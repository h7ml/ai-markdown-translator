# ai-markdown-translator

<div>
  <a href="https://www.npmjs.org/package/ai-markdown-translator"><img src="https://img.shields.io/npm/v/ai-markdown-translator.svg?style=flat" alt="NPM 版本"></a>
  <a href="https://github.com/h7ml/ai-markdown-translator/actions/workflows/ci.yml"><img src="https://github.com/h7ml/ai-markdown-translator/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://github.com/h7ml/ai-markdown-translator/actions/workflows/release.yml"><img src="https://github.com/h7ml/ai-markdown-translator/actions/workflows/release.yml/badge.svg" alt="发布"></a>
  <a href="https://www.npmjs.org/package/ai-markdown-translator"><img src="https://img.shields.io/npm/dw/ai-markdown-translator" alt="NPM 下载量"></a>
  <a href="https://www.npmjs.org/package/ai-markdown-translator"><img src="https://img.shields.io/npm/l/ai-markdown-translator" alt="NPM 许可证"></a>
  <a href="https://github.com/h7ml/ai-markdown-translator/stargazers"><img src="https://img.shields.io/github/stars/h7ml/ai-markdown-translator.svg" alt="GitHub 星标"></a>
  <a href="https://github.com/h7ml/ai-markdown-translator/issues"><img src="https://img.shields.io/github/issues/h7ml/ai-markdown-translator.svg" alt="GitHub 问题"></a>
  <a href="https://github.com/h7ml/ai-markdown-translator/network/members"><img src="https://img.shields.io/github/forks/h7ml/ai-markdown-translator.svg" alt="GitHub 分叉"></a>
  <a href="https://github.com/h7ml/ai-markdown-translator/graphs/contributors"><img src="https://img.shields.io/github/contributors/h7ml/ai-markdown-translator.svg" alt="GitHub 贡献者"></a>
</div>

[English](README.md) | [中文](README-zh.md)

ai-markdown-translator 是一个命令行工具，使用 OpenAI 的语言模型将 Markdown 文件从一种语言翻译成另一种语言。它在翻译内容的同时保留了 Markdown 语法。

## 特性

- 将 Markdown 文件翻译成 OpenAI 模型支持的任何语言
- 在翻译过程中保留 Markdown 语法
- 支持递归目录翻译
- 自动重试机制，用于处理翻译失败
- 全面的日志系统
- 目录结构可视化
- 文件失败跟踪与恢复

## 先决条件

- Node.js (v14 或更高版本)
- npm (通常随 Node.js 一起安装)
- OpenAI API 密钥

## 安装

1. 克隆此仓库或下载源代码。
2. 在终端中进入项目目录。
3. 安装依赖：

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
- `lint`: 运行 ESLint 检查 TypeScript 文件的代码质量问题。
- `lint:fix`: 自动修复 TypeScript 文件中的 lint 问题。
- `format`: 使用 Prettier 格式化 `src` 目录中各种文件类型的代码。
- `format:check`: 检测 `src` 目录中各种文件类型的代码格式而不做更改。
- `postbuild`: 使编译后的 `index.js` 文件可执行。
- `changelog`: 根据规范提交生成变更日志。
- `version`: 在版本更新时更新变更日志并将其加入暂存区。
- `test`: 构建项目并运行测试。

## 使用方法

你可以使用 Node.js、`npx` 或独立可执行文件（如果你已将其打包）来运行 CLI 工具。

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

- `--input`, `-i`: 输入的 Markdown 文件或目录（替代 `--url`）。此选项允许你指定要翻译的 Markdown 文件或目录的路径。
- `--url`, `-u`: Markdown 文件的 URL，用于翻译（替代 `--input`）。使用此选项提供你想翻译的 Markdown 文件的直接链接。

- `--extension`, `-e`: 指定要翻译的文件扩展名（例如，`md`）。如果未提供，则会处理所有文件。此选项允许你根据文件扩展名筛选要翻译的文件。

- `--rename`: 是否修改文件名。如果为 true，则输出文件将命名为 `<original-filename>-translated.<extension>`。此选项允许你指定是否要在翻译后的文件名上附加后缀。

- `--output`, `-o`: 输出 Markdown 文件（如果未提供，则默认为输入文件的文件名）。此选项允许你指定保存翻译内容的输出文件名。

- `--language`, `-l`: 目标翻译语言（必选）。此选项指定你希望将 Markdown 内容翻译成的语言。

- `--openai-url`: OpenAI API URL（默认：使用 `OPENAI_URL` 环境变量）。如果需要，此选项允许你指定一个自定义的 OpenAI API URL。

- `--api-key`: OpenAI API 密钥（默认：使用 `API_KEY` 环境变量）。此选项用于提供你的 OpenAI API 密钥以进行认证。

- `--model`: 要使用的 OpenAI 模型（默认：使用 `MODEL` 环境变量或 `gpt-3.5-turbo`）。此选项允许你指定用于翻译的 OpenAI 模型。

- `--help`, `-h`: 显示帮助。此选项会显示命令行工具的帮助信息。

- `--show-version`, `-v`: 显示版本。此选项会显示当前工具的版本。

- `--log`: 启用日志记录（默认：false）。启用详细的翻译过程日志记录，包括成功和失败的信息。

- `--log-file`: 指定日志文件路径（默认：`<project_root>/log/translator-err.log`）。在此文件中记录翻译错误和失败信息。

- `--log-dir`: 指定日志目录（默认：`<project_root>/log`）。所有日志文件将存储在该目录中。

- `--retry-count`: 翻译失败后重试的次数（默认：3）。翻译器应尝试重试失败翻译的次数。

- `--retry-delay`: 重试尝试之间的延迟（秒）（默认：10）。每次重试之间的等待时间。

- `--path`, `-p`: 显示目录结构（默认：当前脚本目录）。以树状图显示指定目录结构。

> 注意：`--input` 和 `--url` 互斥；必须提供其中之一。

## 环境变量

你可以通过设置以下环境变量来代替在命令行中传递参数：

- `OPENAI_URL`: OpenAI API 的 URL。
- `API_KEY`: 你的 OpenAI API 密钥。
- `MODEL`: 要使用的 OpenAI 模型（例如，`'gpt-3.5-turbo'`）。

你可以在项目根目录下的 `.env` 文件中设置这些变量，或在 shell 中导出它们。

## 示例

1. **将一份 Markdown 文件从英文翻译成西班牙文：**

```bash
npx ai-markdown-translator -i english.md -o spanish.md -l "Spanish"
```

2. **使用特定的 OpenAI 模型进行翻译：**

```bash
npx ai-markdown-translator -i input.md -o output.md -l "French" --model "gpt-4"
```

3. **使用自定义 OpenAI URL 和 API 密钥进行翻译：**

```bash
npx ai-markdown-translator -i input.md -o output.md -l "German" --openai-url "https://api.302.ai/v1/chat/completions" --api-key "sk-302-api-key"
```

4. **翻译来自 URL 的 Markdown 内容：**

```bash
npx ai-markdown-translator -u https://gitee.com/h7ml/ai-markdown-translator/raw/main/README.md -o output.md -l "Italian"
```

5. **翻译目录中的所有 Markdown 文件并重命名：**

```bash
npx ai-markdown-translator -i ./markdown-files -l "Chinese" --rename
```

6. **翻译 Markdown 文件并指定输出文件名：**

```bash
npx ai-markdown-translator -i example.md -o translated_example.md -l "Japanese"
```

7. **使用日志记录和重试选项进行翻译：**

```bash
npx ai-markdown-translator -i ./docs -o ./translated -l "Chinese" --log --retry-count 5 --retry-delay 15
```

8. **使用自定义日志目录进行翻译：**

```bash
npx ai-markdown-translator -i input.md -o output.md -l "Japanese" --log --log-dir "./custom-logs"
```

9. **使用所有日志记录和重试选项进行翻译：**

```bash
npx ai-markdown-translator -i ./markdown-files -l "French" \
  --log \
  --log-dir "./logs" \
  --log-file "./logs/translation.log" \
  --retry-count 3 \
  --retry-delay 5
```

10. **显示目录结构：**

```bash
npx ai-markdown-translator -p ./src
```

输出示例：

```
📂 目录结构: /path/to/src
.
├── 📁 components
│   ├── 📄 Button.tsx
│   └── 📄 Input.tsx
├── 📁 utils
│   ├── 📄 logger.ts
│   └── 📄 translator.ts
└── 📄 index.ts
```

11. **使用自动重试和日志记录进行翻译：**

```bash
npx ai-markdown-translator -i ./docs -o ./translated -l "Chinese" \
  --log \
  --retry-count 5 \
  --retry-delay 15 \
  --log-file "./logs/translation.log"
```

12. **翻译目录并跟踪失败情况：**

```bash
npx ai-markdown-translator -i ./markdown-files -o ./output -l "Japanese" \
  --log \
  --log-dir "./logs" \
  --retry-count 3 \
  --retry-delay 10
```

## 许可证

[MIT License](LICENSE)

## Git 信息

- **仓库**: [h7ml/ai-markdown-translator](https://github.com/h7ml/ai-markdown-translator)
- **问题**: [Report Issues](https://github.com/h7ml/ai-markdown-translator/issues)

## 版本信息

- **当前版本**: 1.0.13
- **NPM 包**: [ai-markdown-translator](https://www.npmjs.com/package/ai-markdown-translator)

## CI 信息

该项目使用 GitHub Actions 进行持续集成。CI 工作流包括：

- 使用 ESLint 对代码进行 lint 检查
- 运行测试（如果适用）
- 构建项目
- 缓存依赖以加快构建速度

## 贡献

欢迎贡献！请随时提交 Pull Request。

## 支持

如果你遇到任何问题或有任何疑问，请在此仓库中提交一个 issue。