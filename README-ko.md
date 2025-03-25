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

[English](README.md) | [中文](README-zh.md) | [한국어](README-ko.md)

`ai-markdown-translator`는 OpenAI의 언어 모델을 사용하여 마크다운 파일을 한 언어에서 다른 언어로 번역하는 명령줄 도구입니다. 콘텐츠를 번역하는 동안 마크다운 구문을 유지합니다.

## 기능

- OpenAI의 모델이 지원하는 모든 언어로 마크다운 파일 번역
- 번역 중 마크다운 구문 유지
- 재귀 디렉토리 번역 지원
- 실패한 번역에 대한 자동 재시도 메커니즘
- 포괄적인 로깅 시스템
- 디렉토리 구조 시각화
- 파일 실패 추적 및 복구

## 사전 요구 사항

- Node.js (v14 이상)
- npm (보통 Node.js와 함께 제공됨)
- OpenAI API 키

## 설치

1. 이 리포지토리를 클론하거나 소스 코드를 다운로드합니다.
2. 터미널에서 프로젝트 디렉토리로 이동합니다.
3. 종속성을 설치합니다:

```bash
npm install
```

4. 프로젝트를 빌드합니다:

```bash
npm run build
```

## 스크립트

- `build`: TypeScript 파일을 JavaScript로 컴파일합니다.
- `start`: Node.js를 사용하여 컴파일된 JavaScript를 실행합니다.
- `lint`: TypeScript 파일에서 코드 품질 문제를 확인하기 위해 ESLint를 실행합니다.
- `lint:fix`: TypeScript 파일에서 린트 문제를 자동으로 수정합니다.
- `format`: `src` 디렉토리의 다양한 파일 유형에 대해 Prettier를 사용하여 코드를 포맷합니다.
- `format:check`: `src` 디렉토리의 다양한 파일 유형에 대한 코드 포맷을 변경하지 않고 확인합니다.
- `postbuild`: 컴파일된 `index.js` 파일을 실행 가능하게 만듭니다.
- `changelog`: 관행적인 커밋 기반의 변경 로그를 생성합니다.
- `version`: 버전을 업데이트하고 커밋을 위해 스테이징합니다.
- `test`: 프로젝트를 빌드하고 테스트를 실행합니다.

## 사용법

Node.js, `npx`를 사용하거나 패키징된 경우 독립 실행형 실행 파일로 CLI 도구를 실행할 수 있습니다.

### Node.js 사용

```bash
node dist/index.js --input <input-file> --output <output-file> --language <target-language> [options]
```

### npx 사용

```bash
npx ai-markdown-translator -i <input-file> -o <output-file> -l <target-language> [options]
```

예를 들어:

```bash
npx ai-markdown-translator -u https://gitee.com/h7ml/ai-markdown-translator/raw/main/README.md -o output.md -l "Italian"
```

### 독립 실행형 실행 파일 사용

```bash
./ai-markdown-translator --input <input-file> --output <output-file> --language <target-language> [options]
```

## 옵션

- `--input`, `-i`: 입력 마크다운 파일 또는 디렉토리 (`--url`의 대안). 번역할 마크다운 파일 또는 디렉토리의 경로를 지정할 수 있는 옵션입니다.
- `--url`, `-u`: 번역할 마크다운 파일의 URL (`--input`의 대안). 번역할 마크다운 파일에 대한 직접 링크를 제공하는 옵션입니다.
- `--extension`, `-e`: 번역할 파일 확장자를 지정합니다 (예: `md`). 제공하지 않으면 모든 파일이 처리됩니다. 이 옵션은 확장자에 따라 번역할 파일을 필터링할 수 있습니다.
- `--rename`: 파일 이름을 수정할지를 결정합니다. true일 경우 출력 파일 이름은 `<original-filename>-translated.<extension>`이 됩니다. 이 옵션은 번역된 파일 이름에 접미사를 추가할지 여부를 지정할 수 있습니다.
- `--output`, `-o`: 출력 마크다운 파일 (제공되지 않으면 입력 파일 이름 기본값). 번역된 내용이 저장될 출력 파일 이름을 지정할 수 있는 옵션입니다.
- `--language`, `-l`: 번역할 대상 언어 (필수). 마크다운 내용을 번역할 언어를 지정하는 옵션입니다.
- `--openai-url`: OpenAI API URL (기본값: `OPENAI_URL` 환경 변수 사용). 필요에 따라 OpenAI API의 사용자 정의 URL을 지정할 수 있는 옵션입니다.
- `--api-key`: OpenAI API 키 (기본값: `API_KEY` 환경 변수 사용). 인증을 위해 OpenAI API 키를 제공하는 옵션입니다.
- `--model`: 사용할 OpenAI 모델 (기본값: `MODEL` 환경 변수 또는 `gpt-3.5-turbo` 사용). 번역에 사용할 OpenAI 모델을 지정할 수 있는 옵션입니다.
- `--help`, `-h`: 도움말 보기. 명령줄 도구에 대한 도움말 정보를 표시하는 옵션입니다.
- `--show-version`, `-v`: 버전 보기. 도구의 현재 버전을 표시하는 옵션입니다.
- `--log`: 로깅 활성화 (기본값: false). 성공 및 실패 정보를 포함하여 번역 프로세스의 자세한 로깅을 활성화합니다.
- `--log-file`: 로그 파일 경로 지정 (기본값: `<project_root>/log/translator-err.log`). 번역 오류 및 실패가 기록될 파일입니다.
- `--log-dir`: 로그 디렉토리 지정 (기본값: `<project_root>/log`). 모든 로그 파일이 저장될 디렉토리입니다.
- `--locale`: 로그 메시지 언어 설정 (기본값: 'zh'). 로그 메시지의 언어를 지정할 수 있는 옵션입니다 (선택: 'en', 'zh', 'ko').
- `--retry-count`: 실패한 번역을 위한 재시도 시도 횟수 (기본값: 3). 번역자가 실패한 번역을 몇 번 다시 시도해야 하는지를 결정합니다.
- `--retry-delay`: 재시도 시도 간의 지연 시간 (기본값: 10). 재시도 시도 간 대기해야 할 시간을 설정합니다.
- `--path`, `-p`: 디렉토리 구조 표시 (기본값: 현재 스크립트 디렉토리). 지정된 디렉토리 구조의 트리 뷰를 표시합니다.

> 참고: `--input`과 `--url`은 상호 배타적입니다; 둘 중 하나를 제공해야 합니다.

## 환경 변수

명령줄 인수 대신 다음 환경 변수를 설정할 수 있습니다:

- `OPENAI_URL`: OpenAI API의 URL.
- `API_KEY`: OpenAI API 키.
- `MODEL`: 사용할 OpenAI 모델 (예: `'gpt-3.5-turbo'`).

이들은 프로젝트 루트의 `.env` 파일에 설정하거나 셸에서 내보낼 수 있습니다.

## 예제

1. **영어에서 스페인어로 마크다운 파일 번역하기:**

```bash
npx ai-markdown-translator -i english.md -o spanish.md -l "Spanish"
```

2. **특정 OpenAI 모델을 사용하여 번역하기:**

```bash
npx ai-markdown-translator -i input.md -o output.md -l "French" --model "gpt-4"
```

3. **사용자 정의 OpenAI URL 및 API 키로 번역하기:**

```bash
npx ai-markdown-translator -i input.md -o output.md -l "German" --openai-url "https://api.302.ai/v1/chat/completions" --api-key "sk-302-api-key"
```

4. **URL의 마크다운 내용을 번역하기:**

```bash
npx ai-markdown-translator -u https://gitee.com/h7ml/ai-markdown-translator/raw/main/README.md -o output.md -l "Italian"
```

5. **디렉토리의 모든 마크다운 파일을 번역하고 이름을 변경하기:**

```bash
npx ai-markdown-translator -i ./markdown-files -l "Chinese" --rename
```

6. **마크다운 파일을 번역하고 출력 파일 이름 지정하기:**

```bash
npx ai-markdown-translator -i example.md -o translated_example.md -l "Japanese"
```

7. **로깅 및 재시도 옵션으로 번역하기:**

```bash
npx ai-markdown-translator -i ./docs -o ./translated -l "Chinese" --log --retry-count 5 --retry-delay 15
```

8. **사용자 정의 로그 디렉토리로 번역하기:**

```bash
npx ai-markdown-translator -i input.md -o output.md -l "Japanese" --log --log-dir "./custom-logs"
```

9. **모든 로깅 및 재시도 옵션으로 번역하기:**

```bash
npx ai-markdown-translator -i ./markdown-files -l "French" \
  --log \
  --log-dir "./logs" \
  --log-file "./logs/translation.log" \
  --retry-count 3 \
  --retry-delay 5
```

10. **디렉토리 구조 표시하기:**

```bash
npx ai-markdown-translator -p ./src
```

출력 예시:

```
📂 디렉토리 구조: /path/to/src
.
├── 📁 components
│   ├── 📄 Button.tsx
│   └── 📄 Input.tsx
├── 📁 utils
│   ├── 📄 logger.ts
│   └── 📄 translator.ts
└── 📄 index.ts
```

11. **자동 재시도 및 로깅으로 번역하기:**

```bash
npx ai-markdown-translator -i ./docs -o ./translated -l "Chinese" \
  --log \
  --retry-count 5 \
  --retry-delay 15 \
  --log-file "./logs/translation.log"
```

12. **실패 추적으로 디렉토리 번역하기:**

```bash
npx ai-markdown-translator -i ./markdown-files -o ./output -l "Japanese" \
  --log \
  --log-dir "./logs" \
  --retry-count 3 \
  --retry-delay 10
```

## 라이센스

[MIT License](LICENSE)

## Git 정보

- **리포지토리**: [h7ml/ai-markdown-translator](https://github.com/h7ml/ai-markdown-translator)
- **이슈**: [문제 보고하기](https://github.com/h7ml/ai-markdown-translator/issues)

## 버전 정보

- **현재 버전**: 1.0.13
- **NPM 패키지**: [ai-markdown-translator](https://www.npmjs.com/package/ai-markdown-translator)

## CI 정보

이 프로젝트는 지속적 통합을 위해 GitHub Actions를 사용합니다. CI 워크플로에는 다음이 포함됩니다:

- ESLint로 코드 린팅
- 테스트 실행 (해당하는 경우)
- 프로젝트 빌드
- 더 빠른 빌드를 위한 종속성 캐싱

## 기여

기여를 환영합니다! Pull Request를 제출해 주세요.

## 지원

문제가 발생하거나 질문이 있는 경우 이 리포지토리에 이슈를 열어 주세요.