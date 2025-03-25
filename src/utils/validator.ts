export function isValidUrl(urlString: string): boolean {
  try {
    // 支持标准协议 / Supports standard protocols
    if (urlString.match(/^(http|https|ftp|ssh|file):\/\//)) {
      new URL(urlString);
      return true;
    }
    // 支持 scp 格式的 SSH URL / Supports SCP format SSH URLs
    if (urlString.match(/^git@[^:]+:/)) {
      return true;
    }
    // 支持本地文件路径 / Supports local file paths
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

/**
 * 验证内容是否为有效的Markdown格式
 *
 * Validate if the content is in valid Markdown format
 *
 * @param content 要验证的内容 / Content to validate
 * @returns 是否同时包含Markdown语法和可读文本 / Whether it contains both Markdown syntax and readable text
 */
export function validateContent(content: string): boolean {
  if (!content?.trim()) return false;

  // 组合式检测：同时包含Markdown语法字符和任何语言的字母
  // Combined detection: checks for both Markdown syntax characters and letters from any language
  const MARKDOWN_SYNTAX_PATTERN = /[#*_[\]()`\-~>|+{}]/; // Markdown常用语法字符 / Common Markdown syntax characters
  const ANY_LETTER_PATTERN = /\p{L}/u; // 任何语言的字母 / Letters from any language

  return MARKDOWN_SYNTAX_PATTERN.test(content) && ANY_LETTER_PATTERN.test(content);
}
