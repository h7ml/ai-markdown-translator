# ai-markdown-translator

<div>
  <a href="https://www.npmjs.org/package/ai-markdown-translator"><img src="https://img.shields.io/npm/v/ai-markdown-translator.svg?style=flat" alt="NPM 版本"></a>
  <a href="https://github.com/h7ml/ai-markdown-translator/actions/workflows/ci.yml"><img src="https://github.com/h7ml/ai-markdown-translator/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://github.com/h7ml/ai-markdown-translator/actions/workflows/release.yml"><img src="https://github.com/h7ml/ai-markdown-translator/actions/workflows/release.yml/badge.svg" alt="发布"></a>
  <a href="https://www.npmjs.org/package/ai-markdown-translator"><img src="https://img.shields.io/npm/dw/ai-markdown-translator" alt="NPM 下载量"></a>
  <a href="https://www.npmjs.org/package/ai-markdown-translator"><img src="https://img.shields.io/npm/l/ai-markdown-translator" alt="NPM 许可证"></a>
  <a href="https://github.com/h7ml/ai-markdown-translator/stargazers"><img src="https://img.shields.io/github/stars/h7ml/ai-markdown-translator.svg" alt="GitHub 星标"></a>
  <a href="https://github.com/h7ml/ai-markdown-translator/issues"><img src="https://img.shields.io/github/issues/h7ml/ai-markdown-translator.svg" alt="GitHub 问题"></a>
  <a href="https://github.com/h7ml/ai-markdown-translator/network/members"><img src="https://img.shields.io/github/forks/h7ml/ai-markdown-translator.svg" alt="GitHub 分支"></a>
  <a href="https://github.com/h7ml/ai-markdown-translator/graphs/contributors"><img src="https://img.shields.io/github/contributors/h7ml/ai-markdown-translator.svg" alt="GitHub 贡献者"></a>
</div>

[English](README.md) | [中文](README-zh.md)

`ai-markdown-translator` 是一个命令行工具，用于使用 OpenAI 的语言模型将 Markdown 文件从一种语言翻译成另一种语言。它在翻译内容时保留 Markdown 语法。

## 特性

- 将 Markdown 文件翻译成 OpenAI 模型支持的任何语言
- 在翻译过程中保留 Markdown 语法
- 支持递归目录翻译
- 失败翻译的自动重试机制
- 综合日志系统
- 目录结构可视化
- 文件失败追踪和恢复

## 先决条件

- Node.js (v14 或更高)
- npm (通常随 Node.js 一起提供)
- 一个 OpenAI API 密钥

## 安装

1. 克隆此存储库或下载源代码。
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

- `build`：将 TypeScript 文件编译为 JavaScript。
- `start`：使用 Node.js 运行编译后的 JavaScript。
- `lint`：运行 ESLint 检查 TypeScript 文件中的代码质量问题。
- `lint:fix`：自动修复 TypeScript 文件中的 lint 问题。
- `format`：使用 Prettier 格式化 `src` 目录中各种文件类型的代码。
- `format:check`：检查 `src` 目录中各种文件类型的代码格式而不进行更改。
- `postbuild`：使编译后的 `index.js` 文件可执行。
- `changelog`：根据约定式提交生成变更日志。
- `version`：在版本更新时更新变更日志并暂存它以进行提交。
- `test`：构建项目并运行测试。

## 用法

您可以使用 Node.js、`npx` 或作为独立可执行文件（如果您已将其打包）运行 CLI 工具。

### 使用 Node.js

```bash
node dist/index.js --input <输入文件> --output <输出文件> --language <目标语言> [选项]
```

### 使用 npx

```bash
npx ai-markdown-translator -i <输入文件> -o <输出文件> -l <目标语言> [选项]
```

例如：

```bash
npx ai-markdown-translator -u https://gitee.com/h7ml/ai-markdown-translator/raw/main/README.md -o output.md -l "意大利语"
```

### 使用独立可执行文件

```bash
./ai-markdown-translator --input <输入文件> --output <输出文件> --language <目标语言> [选项]
```

## 选项

- `--input`, `-i`：输入的 Markdown 文件或目录（替代 `--url`）。此选项允许您指定要翻译的 Markdown 文件或目录的路径。
- `--url`, `-u`：要翻译的 Markdown 文件的 URL（替代 `--input`）。使用此选项提供您要翻译的 Markdown 文件的直接链接。

- `--extension`, `-e`：指定要翻译的文件扩展名（例如，`md`）。如果不提供，则处理所有文件。此选项允许您根据扩展名过滤要翻译的文件。

- `--rename`：是否修改文件名。如果为 true，输出文件将命名为 `<原始文件名>-translated.<扩展名>`。此选项允许您指定是否要向翻译后的文件名添加后缀。

- `--output`, `-o`：输出的 Markdown 文件（如果未提供，则默认为输入文件名）。此选项允许您指定输出文件的名称，其中将保存翻译后的内容。

- `--language`, `-l`：翻译的目标语言（必需）。此选项指定您希望将 Markdown 内容翻译成的语言。

- `--openai-url`：OpenAI API URL（默认：使用 `OPENAI_URL` 环境变量）。此选项允许您在需要时为 OpenAI API 指定自定义 URL。

- `--api-key`：OpenAI API 密钥（默认：使用 `API_KEY` 环境变量）。此选项用于提供您的 OpenAI API 密钥以进行身份验证。

- `--model`：要使用的 OpenAI 模型（默认：使用 `MODEL` 环境变量或 `gpt-3.5-turbo`）。此选项允许您指定要用于翻译的 OpenAI 模型。

- `--help`, `-h`：显示帮助。此选项显示命令行工具的帮助信息。

- `--show-version`, `-v`：显示版本。此选项显示当前工具的版本。

- `--log`：启用日志记录（默认：false）。启用翻译过程的详细日志记录，包括成功和失败信息。

- `--log-file`：指定日志文件路径（默认：`<项目根>/log/translator-err.log`）。用于记录翻译错误和失败的文件。

- `--log-dir`：指定日志目录（默认：`<项目根>/log`）。所有日志文件将存储的目录。

- `--retry-count`：失败翻译的重试次数（默认：3）。翻译器应重试失败翻译的次数。

- `--retry-delay`：重试尝试之间的延迟（单位：秒，默认：10）。重试之间的等待时间。

- `--path`, `-p`：显示目录结构（默认：当前脚本目录）。显示指定目录结构的树状视图。

> 注意：`--input` 和 `--url` 是互斥的；您必须提供一个。

## 环境变量

您可以设置以下环境变量，而不是作为命令行参数传递它们：

- `OPENAI_URL`：OpenAI API 的 URL。
- `API_KEY`：您的 OpenAI API 密钥。
- `MODEL`：要使用的 OpenAI 模型（例如，`'gpt-3.5-turbo'`）。

您可以在项目根目录中的 `.env` 文件中设置这些变量，或在您的终端中导出它们。

## 示例

1. **将 Markdown 文件从英语翻译成西班牙语：**

```bash
npx ai-markdown-translator -i english.md -o spanish.md -l "西班牙语"
```

2. **使用特定的 OpenAI 模型进行翻译：**

```bash
npx ai-markdown-translator -i input.md -o output.md -l "法语" --model "gpt-4"
```

3. **使用自定义 OpenAI URL 和 API 密钥进行翻译：**

```bash
npx ai-markdown-translator -i input.md -o output.md -l "德语" --openai-url "https://api.302.ai/v1/chat/completions" --api-key "sk-302-api-key"
```

4. **翻译 URL 的 Markdown 内容：**

```bash
npx ai-markdown-translator -u https://gitee.com/h7ml/ai-markdown-translator/raw/main/README.md -o output.md -l "意大利语"
```

5. **翻译目录中的所有 Markdown 文件并重命名：**

```bash
npx ai-markdown-translator -i ./markdown-files -l "中文" --rename
```

6. **翻译 Markdown 文件并指定输出文件名：**

```bash
npx ai-markdown-translator -i example.md -o translated_example.md -l "日语"
```

7. **使用日志和重试选项翻译：**

```bash
npx ai-markdown-translator -i ./docs -o ./translated -l "中文" --log --retry-count 5 --retry-delay 15
```

8. **使用自定义日志目录进行翻译：**

```bash
npx ai-markdown-translator -i input.md -o output.md -l "日语" --log --log-dir "./custom-logs"
```

9. **使用所有日志和重试选项进行翻译：**

```bash
npx ai-markdown-translator -i ./markdown-files -l "法语" \
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
📂 目录结构：/path/to/src
.
├── 📁 components
│   ├── 📄 Button.tsx
│   └── 📄 Input.tsx
├── 📁 utils
│   ├── 📄 logger.ts
│   └── 📄 translator.ts
└── 📄 index.ts
```

11. **使用自动重试和日志进行翻译：**

```bash
npx ai-markdown-translator -i ./docs -o ./translated -l "中文" \
  --log \
  --retry-count 5 \
  --retry-delay 15 \
  --log-file "./logs/translation.log"
```

12. **翻译带有失败追踪的目录：**

```bash
npx ai-markdown-translator -i ./markdown-files -o ./output -l "日语" \
  --log \
  --log-dir "./logs" \
  --retry-count 3 \
  --retry-delay 10
```

## 许可证

[MIT 许可证](LICENSE)

## Git 信息

- **仓库**：[h7ml/ai-markdown-translator](https://github.com/h7ml/ai-markdown-translator)
- **问题**：[报告问题](https://github.com/h7ml/ai-markdown-translator/issues)

## 版本信息

- **当前版本**：1.0.13
- **NPM 包**：[ai-markdown-translator](https://www.npmjs.com/package/ai-markdown-translator)

## CI 信息

该项目使用 GitHub Actions 进行持续集成。CI 工作流包括：

- 使用 ESLint 进行代码检查
- 运行测试（如适用）
- 构建项目
- 缓存依赖以加快构建速度

## 贡献

欢迎贡献！请随时提交 Pull Request。

## 支持

如果您遇到任何问题或有任何疑问，请在此存储库中打开一个问题。
