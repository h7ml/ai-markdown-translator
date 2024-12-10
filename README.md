# ai-markdown-translator

[![NPM version](https://img.shields.io/npm/v/ai-markdown-translator.svg?style=flat)](https://www.npmjs.org/package/ai-markdown-translator)
[![CI](https://github.com/h7ml/ai-markdown-translator/actions/workflows/ci.yml/badge.svg)](https://github.com/h7ml/ai-markdown-translator/actions/workflows/ci.yml)
![NPM Downloads](https://img.shields.io/npm/dw/ai-markdown-translator)
![GitHub License](https://img.shields.io/github/license/h7ml/ai-markdown-translator)

ai-markdown-translator is a command-line tool that translates Markdown files from one language to another using OpenAI's language models. It preserves the Markdown syntax while translating the content.

## Features

- Translate Markdown files to any language supported by OpenAI's models
- Preserve Markdown syntax during translation
- Flexible configuration through command-line arguments or environment variables
- Cross-platform support (Windows, macOS, Linux)

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

5. (Optional) Package the CLI into a standalone executable:

```bash
npm run package
```

This will create executables for Windows, macOS, and Linux in the `bin` directory.

## Scripts

- **build**: Compile TypeScript files to JavaScript.
- **start**: Run the CLI tool using Node.js.
- **package**: Create standalone executables for the CLI.
- **lint**: Run ESLint to check for code quality issues.
- **lint:fix**: Automatically fix linting issues.
- **format**: Format code using Prettier.
- **format:check**: Check code formatting without making changes.

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

### Using the standalone executable

```bash
./ai-markdown-translator --input <input-file> --output <output-file> --language <target-language> [options]
```

### Options

- `--input`, `-i`: Input Markdown file (required)
- `--output`, `-o`: Output Markdown file (required)
- `--language`, `-l`: Target language for translation (required)
- `--openai-url`: OpenAI API URL (default: uses OPENAI_URL environment variable)
- `--api-key`: OpenAI API Key (default: uses API_KEY environment variable)
- `--model`: OpenAI Model to use (default: uses MODEL environment variable or 'gpt-3.5-turbo')
- `--help`, `-h`: Show help

## Environment Variables

You can set the following environment variables instead of passing them as command-line arguments:

- `OPENAI_URL`: The URL for the OpenAI API
- `API_KEY`: Your OpenAI API key
- `MODEL`: The OpenAI model to use (e.g., 'gpt-3.5-turbo')

You can set these in a `.env` file in the project root or export them in your shell.

## Examples

1. Translate a Markdown file from English to Spanish:

```bash
./ai-markdown-translator --input english.md --output spanish.md --language "Spanish"
```

2. Translate using a specific OpenAI model:

```bash
./ai-markdown-translator --input input.md --output output.md --language "French" --model "gpt-4"
```

3. Translate with custom OpenAI URL and API key:

```bash
./ai-markdown-translator --input input.md --output output.md --language "German" --openai-url "https://api.302.ai/v1/chat/completions" --api-key "sk-302-api-key"
```

4. Translate a Markdown file using `npx`:

```bash
npx ai-markdown-translator -i input.md -o output.md -l "Italian"
```

## License

[MIT License](LICENSE)

## Git Information

- **Repository**: [h7ml/ai-markdown-translator](https://github.com/h7ml/ai-markdown-translator)
- **Issues**: [Report Issues](https://github.com/h7ml/ai-markdown-translator/issues)

## Version Information

- **Current Version**: 1.0.3
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
