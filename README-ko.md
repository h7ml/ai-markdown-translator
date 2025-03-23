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

[영어](README.md) | [중국어](README-zh.md)

`ai-markdown-translator` is a command-line tool that translates Markdown files from one language to another using OpenAI's language models. It preserves the Markdown syntax while translating the content.  
→  
`ai-markdown-translator`는 OpenAI의 언어 모델을 사용하여 Markdown 파일을 한 언어에서 다른 언어로 번역하는 커맨드라인 도구입니다. 번역하는 동안 Markdown 구문을 유지합니다.

## Features  
→  
## 기능

- Translate Markdown files to any language supported by OpenAI's models  
  → OpenAI 모델에서 지원하는 모든 언어로 Markdown 파일을 번역합니다.
- Preserve Markdown syntax during translation  
  → 번역 시 Markdown 구문을 유지합니다.
- Support for recursive directory translation  
  → 하위 디렉터리를 재귀적으로 번역할 수 있습니다.
- Automatic retry mechanism for failed translations  
  → 번역 실패 시 자동 재시도 메커니즘을 제공합니다.
- Comprehensive logging system  
  → 종합적인 로깅 시스템을 갖추고 있습니다.
- Directory structure visualization  
  → 디렉터리 구조 시각화를 지원합니다.
- File failure tracking and recovery  
  → 파일 실패 추적 및 복구 기능을 제공합니다.

## Prerequisites  
→  
## 사전 요구 사항

- Node.js (v14 or later)  
  → Node.js (v14 이상)
- npm (usually comes with Node.js)  
  → npm (보통 Node.js에 포함됨)
- An OpenAI API key  
  → OpenAI API 키

## Installation  
→  
## 설치

1. Clone this repository or download the source code.  
   → 이 리포지토리를 클론하거나 소스 코드를 다운로드합니다.
2. Navigate to the project directory in your terminal.  
   → 터미널에서 프로젝트 디렉토리로 이동합니다.
3. Install the dependencies:  
   → 의존성을 설치합니다:

```bash
npm install
```

4. Build the project:  
   → 프로젝트를 빌드합니다:

```bash
npm run build
```

## Scripts  
→  
## 스크립트

- `build`: Compiles TypeScript files to JavaScript.  
  → `build`: TypeScript 파일을 JavaScript로 컴파일합니다.
- `start`: Runs the compiled JavaScript using Node.js.  
  → `start`: Node.js를 사용하여 컴파일된 JavaScript를 실행합니다.
- `lint`: Runs ESLint to check for code quality issues in TypeScript files.  
  → `lint`: TypeScript 파일의 코드 품질 문제를 확인하기 위해 ESLint를 실행합니다.
- `lint:fix`: Automatically fixes linting issues in TypeScript files.  
  → `lint:fix`: TypeScript 파일의 린트 문제를 자동으로 수정합니다.
- `format`: Formats code using Prettier for various file types in the `src` directory.  
  → `format`: `src` 디렉토리 내의 다양한 파일 종류에 대해 Prettier를 사용하여 코드를 포맷합니다.
- `format:check`: Checks code formatting without making changes for various file types in the `src` directory.  
  → `format:check`: 변경 없이 `src` 디렉토리 내의 다양한 파일 종류의 코드 형식을 확인합니다.
- `postbuild`: Makes the compiled `index.js` file executable.  
  → `postbuild`: 컴파일된 `index.js` 파일을 실행 파일로 만듭니다.
- `changelog`: Generates a changelog based on conventional commits.  
  → `changelog`: Conventional Commits를 기반으로 변경 로그를 생성합니다.
- `version`: Updates the changelog and stages it for commit when versioning.  
  → `version`: 버전 관리를 할 때 변경 로그를 업데이트하고 커밋할 준비를 합니다.
- `test`: Builds the project and runs the test.  
  → `test`: 프로젝트를 빌드하고 테스트를 실행합니다.

## Usage  
→  
## 사용 방법

You can run the CLI tool using Node.js, `npx`, or as a standalone executable (if you've packaged it).  
→  
Node.js, `npx` 또는 독립 실행 파일로(패키지화한 경우) CLI 도구를 실행할 수 있습니다.

### Using Node.js  
→  
### Node.js 사용

```bash
node dist/index.js --input <input-file> --output <output-file> --language <target-language> [options]
```

### Using npx  
→  
### npx 사용

```bash
npx ai-markdown-translator -i <input-file> -o <output-file> -l <target-language> [options]
```

For example:  
→  
예시:

```bash
npx ai-markdown-translator -u https://gitee.com/h7ml/ai-markdown-translator/raw/main/README.md -o output.md -l "Italian"
```

### Using the standalone executable  
→  
### 독립 실행 파일 사용

```bash
./ai-markdown-translator --input <input-file> --output <output-file> --language <target-language> [options]
```

## Options  
→  
## 옵션

- `--input`, `-i`: Input Markdown file or directory (alternative to `--url`). This option allows you to specify the path to the Markdown file or directory you want to translate.  
  → `--input`, `-i`: 입력 Markdown 파일 또는 디렉토리 ( `--url`의 대안). 이 옵션을 사용하여 번역할 Markdown 파일이나 디렉토리의 경로를 지정할 수 있습니다.
- `--url`, `-u`: URL of a Markdown file to translate (alternative to `--input`). Use this option to provide a direct link to a Markdown file that you want to translate.  
  → `--url`, `-u`: 번역할 Markdown 파일의 URL ( `--input`의 대안). 이 옵션을 사용하여 번역할 Markdown 파일에 대한 직접 링크를 제공합니다.

- `--extension`, `-e`: Specify the file extension to translate (e.g., `md`). If not provided, all files will be processed. This option allows you to filter which files to translate based on their extension.  
  → `--extension`, `-e`: 번역할 파일 확장자를 지정합니다 (예: `md`). 지정하지 않으면 모든 파일이 처리됩니다. 이 옵션을 사용하면 확장자에 따라 번역할 파일을 필터링할 수 있습니다.

- `--rename`: Whether to modify the file name. If true, the output file will be named `<original-filename>-translated.<extension>`. This option allows you to specify if you want to append a suffix to the translated file name.  
  → `--rename`: 파일 이름을 수정할지 여부입니다. true인 경우, 출력 파일 이름은 `<original-filename>-translated.<extension>` 형식으로 지정됩니다. 이 옵션을 통해 번역된 파일 이름에 접미사를 추가할지 결정할 수 있습니다.

- `--output`, `-o`: Output Markdown file (if not provided, defaults to the input file name). This option allows you to specify the name of the output file where the translated content will be saved.  
  → `--output`, `-o`: 출력 Markdown 파일 (지정하지 않으면 입력 파일 이름이 기본값으로 사용됨). 이 옵션을 사용하여 번역된 내용이 저장될 출력 파일의 이름을 지정할 수 있습니다.

- `--language`, `-l`: Target language for translation (required). This option specifies the language into which you want the Markdown content to be translated.  
  → `--language`, `-l`: 번역할 대상 언어 (필수). 이 옵션은 Markdown 내용을 번역할 언어를 지정합니다.

- `--openai-url`: OpenAI API URL (default: uses `OPENAI_URL` environment variable). This option allows you to specify a custom URL for the OpenAI API if needed.  
  → `--openai-url`: OpenAI API URL (기본값: `OPENAI_URL` 환경 변수를 사용). 이 옵션을 사용하여 필요 시 OpenAI API의 사용자 지정 URL을 지정할 수 있습니다.

- `--api-key`: OpenAI API Key (default: uses `API_KEY` environment variable). This option is used to provide your OpenAI API key for authentication.  
  → `--api-key`: OpenAI API 키 (기본값: `API_KEY` 환경 변수를 사용). 이 옵션은 인증을 위해 OpenAI API 키를 제공하는 데 사용됩니다.

- `--model`: OpenAI Model to use (default: uses `MODEL` environment variable or `gpt-3.5-turbo`). This option allows you to specify which OpenAI model to use for translation.  
  → `--model`: 사용할 OpenAI 모델 (기본값: `MODEL` 환경 변수 또는 `gpt-3.5-turbo`를 사용). 이 옵션을 통해 번역에 사용할 OpenAI 모델을 지정할 수 있습니다.

- `--help`, `-h`: Show help. This option displays the help information for the command-line tool.  
  → `--help`, `-h`: 도움말 표시. 이 옵션은 커맨드라인 도구에 대한 도움말 정보를 표시합니다.

- `--show-version`, `-v`: Show version. This option displays the current version of the tool.  
  → `--show-version`, `-v`: 버전 표시. 이 옵션은 도구의 현재 버전을 표시합니다.

- `--log`: Enable logging (default: false). Enables detailed logging of the translation process, including success and failure information.  
  → `--log`: 로깅 활성화 (기본값: false). 성공 및 실패 정보를 포함한 번역 프로세스의 자세한 로그를 활성화합니다.

- `--log-file`: Specify the log file path (default: `<project_root>/log/translator-err.log`). The file where translation errors and failures will be logged.  
  → `--log-file`: 로그 파일 경로를 지정합니다 (기본값: `<project_root>/log/translator-err.log`). 이 파일에 번역 오류 및 실패 정보가 기록됩니다.

- `--log-dir`: Specify the log directory (default: `<project_root>/log`). The directory where all log files will be stored.  
  → `--log-dir`: 로그 디렉토리를 지정합니다 (기본값: `<project_root>/log`). 모든 로그 파일이 저장될 디렉토리를 지정합니다.

- `--retry-count`: Number of retry attempts for failed translations (default: 3). How many times the translator should attempt to retry failed translations.  
  → `--retry-count`: 번역 실패 시 재시도 횟수 (기본값: 3). 번역 실패한 항목에 대해 재시도할 횟수를 지정합니다.

- `--retry-delay`: Delay in seconds between retry attempts (default: 10). How long to wait between retry attempts.  
  → `--retry-delay`: 재시도 간의 대기 시간(초, 기본값: 10). 재시도 사이의 대기 시간을 지정합니다.

- `--path`, `-p`: Display directory structure (default: current script directory). Shows a tree view of the specified directory structure.  
  → `--path`, `-p`: 디렉토리 구조 표시 (기본값: 현재 스크립트 디렉토리). 지정된 디렉토리 구조의 트리 뷰를 표시합니다.

> Note: `--input` and `--url` are mutually exclusive; you must provide one or the other.  
→  
> 참고: `--input`과 `--url`은 상호 배타적입니다; 둘 중 하나를 반드시 제공해야 합니다.

## Environment Variables  
→  
## 환경 변수

You can set the following environment variables instead of passing them as command-line arguments:  
→  
다음 환경 변수를 커맨드라인 인수 대신 설정할 수 있습니다:

- `OPENAI_URL`: The URL for the OpenAI API.  
  → `OPENAI_URL`: OpenAI API의 URL.
- `API_KEY`: Your OpenAI API key.  
  → `API_KEY`: 본인의 OpenAI API 키.
- `MODEL`: The OpenAI model to use (e.g., `'gpt-3.5-turbo'`).  
  → `MODEL`: 사용할 OpenAI 모델 (예: `'gpt-3.5-turbo'`).

You can set these in a `.env` file in the project root or export them in your shell.  
→  
프로젝트 루트의 `.env` 파일에 이들을 설정하거나 셸에서 export 할 수 있습니다.

## Examples  
→  
## 예시

1. **Translate a Markdown file from English to Spanish:**  
   → **영어에서 스페인어로 Markdown 파일 번역:**

```bash
npx ai-markdown-translator -i english.md -o spanish.md -l "Spanish"
```

2. **Translate using a specific OpenAI model:**  
   → **특정 OpenAI 모델을 사용하여 번역:**

```bash
npx ai-markdown-translator -i input.md -o output.md -l "French" --model "gpt-4"
```

3. **Translate with custom OpenAI URL and API key:**  
   → **사용자 지정 OpenAI URL 및 API 키를 사용하여 번역:**

```bash
npx ai-markdown-translator -i input.md -o output.md -l "German" --openai-url "https://api.302.ai/v1/chat/completions" --api-key "sk-302-api-key"
```

4. **Translate the Markdown content of a URL:**  
   → **URL의 Markdown 내용을 번역:**

```bash
npx ai-markdown-translator -u https://gitee.com/h7ml/ai-markdown-translator/raw/main/README.md -o output.md -l "Italian"
```

5. **Translate all Markdown files in a directory and rename them:**  
   → **디렉토리의 모든 Markdown 파일을 번역하고 이름 변경:**

```bash
npx ai-markdown-translator -i ./markdown-files -l "Chinese" --rename
```

6. **Translate a Markdown file and specify the output file name:**  
   → **Markdown 파일을 번역하고 출력 파일 이름 지정:**

```bash
npx ai-markdown-translator -i example.md -o translated_example.md -l "Japanese"
```

7. **Translate with logging and retry options:**  
   → **로깅 및 재시도 옵션을 사용하여 번역:**

```bash
npx ai-markdown-translator -i ./docs -o ./translated -l "Chinese" --log --retry-count 5 --retry-delay 15
```

8. **Translate with custom log directory:**  
   → **사용자 지정 로그 디렉토리를 사용하여 번역:**

```bash
npx ai-markdown-translator -i input.md -o output.md -l "Japanese" --log --log-dir "./custom-logs"
```

9. **Translate with all logging and retry options:**  
   → **모든 로깅 및 재시도 옵션을 사용하여 번역:**

```bash
npx ai-markdown-translator -i ./markdown-files -l "French" \
  --log \
  --log-dir "./logs" \
  --log-file "./logs/translation.log" \
  --retry-count 3 \
  --retry-delay 5
```

10. **Display directory structure:**  
    → **디렉토리 구조 표시:**

```bash
npx ai-markdown-translator -p ./src
```

Output example:  
→  
출력 예시:

```
📂 Directory structure: /path/to/src
.
├── 📁 components
│   ├── 📄 Button.tsx
│   └── 📄 Input.tsx
├── 📁 utils
│   ├── 📄 logger.ts
│   └── 📄 translator.ts
└── 📄 index.ts
```

11. **Translate with automatic retry and logging:**  
    → **자동 재시도 및 로깅 기능을 사용하여 번역:**

```bash
npx ai-markdown-translator -i ./docs -o ./translated -l "Chinese" \
  --log \
  --retry-count 5 \
  --retry-delay 15 \
  --log-file "./logs/translation.log"
```

12. **Translate directory with failure tracking:**  
    → **실패 추적 기능과 함께 디렉토리를 번역:**

```bash
npx ai-markdown-translator -i ./markdown-files -o ./output -l "Japanese" \
  --log \
  --log-dir "./logs" \
  --retry-count 3 \
  --retry-delay 10
```

## License  
→  
## 라이선스

[MIT License](LICENSE)

## Git Information  
→  
## Git 정보

- **Repository**: [h7ml/ai-markdown-translator](https://github.com/h7ml/ai-markdown-translator)  
  → **리포지토리**: [h7ml/ai-markdown-translator](https://github.com/h7ml/ai-markdown-translator)
- **Issues**: [Report Issues](https://github.com/h7ml/ai-markdown-translator/issues)  
  → **이슈**: [이슈 보고](https://github.com/h7ml/ai-markdown-translator/issues)

## Version Information  
→  
## 버전 정보

- **Current Version**: 1.0.13  
  → **현재 버전**: 1.0.13
- **NPM Package**: [ai-markdown-translator](https://www.npmjs.com/package/ai-markdown-translator)  
  → **NPM 패키지**: [ai-markdown-translator](https://www.npmjs.com/package/ai-markdown-translator)

## CI Information  
→  
## CI 정보

This project uses GitHub Actions for continuous integration. The CI workflow includes:  
→  
이 프로젝트는 지속적 통합을 위해 GitHub Actions를 사용합니다. CI 워크플로우에는 다음이 포함됩니다:

- Linting the code with ESLint  
  → ESLint를 사용한 코드 린팅
- Running tests (if applicable)  
  → 테스트 실행 (해당되는 경우)
- Building the project  
  → 프로젝트 빌드
- Caching dependencies for faster builds  
  → 빌드 속도 향상을 위한 의존성 캐싱

## Contributing  
→  
## 기여

Contributions are welcome! Please feel free to submit a Pull Request.  
→  
기여는 언제나 환영합니다! Pull Request를 자유롭게 제출해 주세요.

## Support  
→  
## 지원

If you encounter any problems or have any questions, please open an issue in this repository.  
→  
문제가 발생하거나 질문이 있으시면, 이 리포지토리에 이슈를 등록해 주세요.