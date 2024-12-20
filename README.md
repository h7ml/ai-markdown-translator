# ai-markdown-translator

<div>
  <a href="https://www.npmjs.org/package/ai-markdown-translator"><img src="https://img.shields.io/npm/v/ai-markdown-translator.svg?style=flat" alt="NPM version"></a>
  <a href="https://github.com/h7ml/ai-markdown-translator/actions/workflows/ci.yml"><img src="https://github.com/h7ml/ai-markdown-translator/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://github.com/h7ml/ai-markdown-translator/actions/workflows/release.yml"><img src="https://github.com/h7ml/ai-markdown-translator/actions/workflows/release.yml/badge.svg" alt="Release"></a>
  <a href="https://www.npmjs.org/package/ai-markdown-translator"><img src="https://img.shields.io/npm/dw/ai-markdown-translator" alt="NPM Downloads"></a>
  <a href="https://www.npmjs.org/package/ai-markdown-translator"><img src="https://img.shields.io/npm/l/ai-markdown-translator" alt="NPM License"></a>
  <a href="https://github.com/h7ml/ai-markdown-translator/stargazers"><img src="https://img.shields.io/github/stars/h7ml/ai-markdown-translator.svg" alt="GitHub Stars"></a>
  <a href="https://github.com/h7ml/ai-markdown-translator/issues"><img src="https://img.shields.io/github/issues/h7ml/ai-markdown-translator.svg" alt="GitHub Issues"></a>
  <a href="https://github.com/h7ml/ai-markdown-translator/network/members"><img src="https://img.shields.io/github/forks/h7ml/ai-markdown-translator.svg" alt="GitHub Forks"></a>
  <a href="https://github.com/h7ml/ai-markdown-translator/graphs/contributors"><img src="https://img.shields.io/github/contributors/h7ml/ai-markdown-translator.svg" alt="GitHub Contributors"></a>
</div>

[English](README.md) | [中文](README-zh.md)

`ai-markdown-translator` is a command-line tool that translates Markdown files from one language to another using OpenAI's language models. It preserves the Markdown syntax while translating the content.

## Features

- Translate Markdown files to any language supported by OpenAI's models.
- Preserve Markdown syntax during translation.
- Flexible configuration through command-line arguments or environment variables.

## Prerequisites

- Node.js (v14 or later)
- npm (usually comes with Node.js)
- An OpenAI API key

## Installation

1. Clone this repository or download the source code.
2. Navigate to the project directory in your terminal.
3. Install the dependencies:

```bash
npm install
```

4. Build the project:

```bash
npm run build
```

## Scripts

- `build`: Compiles TypeScript files to JavaScript.
- `start`: Runs the compiled JavaScript using Node.js.
- `lint`: Runs ESLint to check for code quality issues in TypeScript files.
- `lint:fix`: Automatically fixes linting issues in TypeScript files.
- `format`: Formats code using Prettier for various file types in the `src` directory.
- `format:check`: Checks code formatting without making changes for various file types in the `src` directory.
- `postbuild`: Makes the compiled `index.js` file executable.
- `changelog`: Generates a changelog based on conventional commits.
- `version`: Updates the changelog and stages it for commit when versioning.
- `test`: Builds the project and runs the test.

## Usage

You can run the CLI tool using Node.js, `npx`, or as a standalone executable (if you've packaged it).

### Using Node.js

```bash
node dist/index.js --input <input-file> --output <output-file> --language <target-language> [options]
```

### Using npx

```bash
npx ai-markdown-translator -i <input-file> -o <output-file> -l <target-language> [options]
```

For example:

```bash
npx ai-markdown-translator -u https://gitee.com/h7ml/ai-markdown-translator/raw/main/README.md -o output.md -l "Italian"
```

### Using the standalone executable

```bash
./ai-markdown-translator --input <input-file> --output <output-file> --language <target-language> [options]
```

## Options

- `--input`, `-i`: Input Markdown file or directory (alternative to `--url`). This option allows you to specify the path to the Markdown file or directory you want to translate.
- `--url`, `-u`: URL of a Markdown file to translate (alternative to `--input`). Use this option to provide a direct link to a Markdown file that you want to translate.

- `--extension`, `-e`: Specify the file extension to translate (e.g., `md`). If not provided, all files will be processed. This option allows you to filter which files to translate based on their extension.

- `--rename`: Whether to modify the file name. If true, the output file will be named `<original-filename>-translated.<extension>`. This option allows you to specify if you want to append a suffix to the translated file name.

- `--output`, `-o`: Output Markdown file (if not provided, defaults to the input file name). This option allows you to specify the name of the output file where the translated content will be saved.

- `--language`, `-l`: Target language for translation (required). This option specifies the language into which you want the Markdown content to be translated.

- `--openai-url`: OpenAI API URL (default: uses `OPENAI_URL` environment variable). This option allows you to specify a custom URL for the OpenAI API if needed.

- `--api-key`: OpenAI API Key (default: uses `API_KEY` environment variable). This option is used to provide your OpenAI API key for authentication.

- `--model`: OpenAI Model to use (default: uses `MODEL` environment variable or `gpt-3.5-turbo`). This option allows you to specify which OpenAI model to use for translation.

- `--help`, `-h`: Show help. This option displays the help information for the command-line tool.

- `--show-version`, `-v`: Show version. This option displays the current version of the tool.

> Note: `--input` and `--url` are mutually exclusive; you must provide one or the other.

## Environment Variables

You can set the following environment variables instead of passing them as command-line arguments:

- `OPENAI_URL`: The URL for the OpenAI API.
- `API_KEY`: Your OpenAI API key.
- `MODEL`: The OpenAI model to use (e.g., `'gpt-3.5-turbo'`).

You can set these in a `.env` file in the project root or export them in your shell.

## Examples

1. **Translate a Markdown file from English to Spanish:**

```bash
npx ai-markdown-translator -i english.md -o spanish.md -l "Spanish"
```

2. **Translate using a specific OpenAI model:**

```bash
npx ai-markdown-translator -i input.md -o output.md -l "French" --model "gpt-4"
```

3. **Translate with custom OpenAI URL and API key:**

```bash
npx ai-markdown-translator -i input.md -o output.md -l "German" --openai-url "https://api.302.ai/v1/chat/completions" --api-key "sk-302-api-key"
```

4. **Translate the Markdown content of a URL:**

```bash
npx ai-markdown-translator -u https://gitee.com/h7ml/ai-markdown-translator/raw/main/README.md -o output.md -l "Italian"
```

5. **Translate all Markdown files in a directory and rename them:**

```bash
npx ai-markdown-translator -i ./markdown-files -l "Chinese" --rename
```

6. **Translate a Markdown file and specify the output file name:**

```bash
npx ai-markdown-translator -i example.md -o translated_example.md -l "Japanese"
```

## License

[MIT License](LICENSE)

## Git Information

- **Repository**: [h7ml/ai-markdown-translator](https://github.com/h7ml/ai-markdown-translator)
- **Issues**: [Report Issues](https://github.com/h7ml/ai-markdown-translator/issues)

## Version Information

- **Current Version**: 1.0.11
- **NPM Package**: [ai-markdown-translator](https://www.npmjs.com/package/ai-markdown-translator)

## CI Information

This project uses GitHub Actions for continuous integration. The CI workflow includes:

- Linting the code with ESLint
- Running tests (if applicable)
- Building the project
- Caching dependencies for faster builds

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any problems or have any questions, please open an issue in this repository.
