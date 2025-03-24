export function isValidUrl(urlString: string): boolean {
  try {
    // 支持标准协议 / Supports standard protocols / 표준 프로토콜 지원
    if (urlString.match(/^(http|https|ftp|ssh|file):\/\//)) {
      new URL(urlString);
      return true;
    }
    // 支持 scp 格式的 SSH URL / Supports SCP format SSH URLs / SCP 형식의 SSH URL 지원
    if (urlString.match(/^git@[^:]+:/)) {
      return true;
    }
    // 支持本地文件路径 / Supports local file paths / 로컬 파일 경로 지원
    if (
      urlString.startsWith('file://') ||
      urlString.startsWith('/') ||
      /^[a-zA-Z]:\\/.test(urlString)
    ) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function validateContent(content: string): boolean {
  // 基本的 Markdown 格式验证 / Basic Markdown format validation / 기본 마크다운 형식 검증
  const hasMarkdownSyntax = /[#*_[\]()-`]/.test(content);
  const hasText = /[a-zA-Z\u4e00-\u9fa5]/.test(content);
  return hasMarkdownSyntax && hasText;
}
