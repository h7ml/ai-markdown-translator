interface LocalizedMessages {
  [key: string]: string;
}

interface LocaleMessages {
  [locale: string]: LocalizedMessages;
}

export type SupportedLocale = 'en' | 'zh' | 'ko';

export const messages: LocaleMessages = {
  en: {
    // API related messages
    'api.key.error': 'Failed to get default API Key:',
    'api.prompt.error': 'Cannot read prompt contents',
    'api.translation.complete': 'Translation completed',
    'api.translation.retry.success': 'Retry successful (%d/%d)',
    'api.translation.failed': 'Translation failed',
    'api.request.failed': 'Request failed: %s - %s',
    'api.retry.preparing': '%s, preparing to retry (%d/%d)',
    'api.retry.max': '%s, maximum retry count reached',
    'api.error.retry': '%s, will retry in %d seconds (%d/%d)',
    'api.error.max': '%s, maximum retry count reached',

    // CLI related messages
    'cli.input.file.required': 'Either --input or --url parameter is required',
    'cli.input.mutually.exclusive': '--input and --url parameters cannot be used together',
    'cli.url.invalid': 'Provided URL format is incorrect',
    'cli.openai.url.required':
      'OpenAI URL is required. Please provide it via --openai-url parameter or OPENAI_URL environment variable.',
    'cli.api.key.required':
      'API Key is required. Please provide it via --api-key parameter or API_KEY environment variable.',
    'cli.output.invalid': 'Invalid output filename.',
    'cli.translation.complete': 'Translation of %s completed. Output saved to %s',

    // File related messages
    'file.not.exists': 'Input file %s does not exist.',
    'file.is.directory': 'Error: %s is a directory.',
    'file.content.type.unsupported': 'Unsupported content type: %s',
    'file.content.invalid': 'Content is not a valid Markdown format',
    'file.direct.fetch.failed': 'Direct fetch failed, trying download method:',
    'file.url.fetch.failed': 'Could not fetch content from URL: %s',
    'file.check.api.key': 'Checking API key:',
    'file.target.files': 'Target files:',
    'file.start.processing': 'Starting to process file: %s',
    'file.translation.complete': 'Translation completed: %s -> %s',
    'file.write.failed': 'Failed to write file: %s',
    'file.translation.failed': 'Translation failed: %s',
    'file.log.cleared': 'Cleared records for %d successfully translated files',
    'file.stats.title': 'Statistics:',
    'file.stats.dirs': 'Number of directories: %d',
    'file.stats.files': 'Number of files: %d',
    'file.stats.total': 'Total: %d items',
  },

  zh: {
    // API related messages
    'api.key.error': '获取默认API Key失败:',
    'api.prompt.error': 'cannot read prompt contents',
    'api.translation.complete': '翻译完成',
    'api.translation.retry.success': '重试成功 (%d/%d)',
    'api.translation.failed': '翻译失败',
    'api.request.failed': '请求失败: %s - %s',
    'api.retry.preparing': '%s, 准备重试 (%d/%d)',
    'api.retry.max': '%s, 已达到最大重试次数',
    'api.error.retry': '%s, 将在 %d 秒后重试 (%d/%d)',
    'api.error.max': '%s, 已达到最大重试次数',

    // CLI related messages
    'cli.input.file.required': '必须提供 --input 或 --url 参数之一',
    'cli.input.mutually.exclusive': '--input 和 --url 参数不能同时使用',
    'cli.url.invalid': '提供的URL格式不正确',
    'cli.openai.url.required':
      '需要提供OpenAI URL。请通过--openai-url参数或OPENAI_URL环境变量提供。',
    'cli.api.key.required': '需要提供API Key。请通过--api-key参数或API_KEY环境变量提供。',
    'cli.output.invalid': '输出文件名无效。',
    'cli.translation.complete': '翻译 %s 完成。输出已保存到 %s',

    // File related messages
    'file.not.exists': '输入文件 %s 不存在。',
    'file.is.directory': '错误: %s 是一个目录。',
    'file.content.type.unsupported': '不支持的内容类型: %s',
    'file.content.invalid': '内容不是有效的 Markdown 格式',
    'file.direct.fetch.failed': '直接获取失败,尝试下载方式:',
    'file.url.fetch.failed': '无法从 URL 获取内容: %s',
    'file.check.api.key': '检查 API 密钥:',
    'file.target.files': '目标文件:',
    'file.start.processing': '开始处理文件: %s',
    'file.translation.complete': '翻译完成: %s -> %s',
    'file.write.failed': '写入文件失败: %s',
    'file.translation.failed': '翻译失败: %s',
    'file.log.cleared': '已清理 %d 个成功翻译文件的记录',
    'file.stats.title': '统计信息:',
    'file.stats.dirs': '目录数量: %d',
    'file.stats.files': '文件数量: %d',
    'file.stats.total': '总计: %d 个项目',
  },

  ko: {
    // API related messages
    'api.key.error': '기본 API 키 가져오기 실패:',
    'api.prompt.error': '프롬프트 내용을 읽을 수 없습니다',
    'api.translation.complete': '번역 완료',
    'api.translation.retry.success': '재시도 성공 (%d/%d)',
    'api.translation.failed': '번역 실패',
    'api.request.failed': '요청 실패: %s - %s',
    'api.retry.preparing': '%s, 재시도 준비 중 (%d/%d)',
    'api.retry.max': '%s, 최대 재시도 횟수에 도달했습니다',
    'api.error.retry': '%s, %d초 후에 재시도합니다 (%d/%d)',
    'api.error.max': '%s, 최대 재시도 횟수에 도달했습니다',

    // CLI related messages
    'cli.input.file.required': '--input 또는 --url 매개변수가 필요합니다',
    'cli.input.mutually.exclusive': '--input과 --url 매개변수는 함께 사용할 수 없습니다',
    'cli.url.invalid': '제공된 URL 형식이 올바르지 않습니다',
    'cli.openai.url.required':
      'OpenAI URL이 필요합니다. --openai-url 매개변수나 OPENAI_URL 환경 변수를 통해 제공해주세요.',
    'cli.api.key.required':
      'API 키가 필요합니다. --api-key 매개변수나 API_KEY 환경 변수를 통해 제공해주세요.',
    'cli.output.invalid': '잘못된 출력 파일 이름입니다.',
    'cli.translation.complete': '%s 번역 완료. 출력이 %s에 저장되었습니다',

    // File related messages
    'file.not.exists': '입력 파일 %s이(가) 존재하지 않습니다.',
    'file.is.directory': '오류: %s은(는) 디렉토리입니다.',
    'file.content.type.unsupported': '지원되지 않는 콘텐츠 유형: %s',
    'file.content.invalid': '올바른 마크다운 형식이 아닙니다',
    'file.direct.fetch.failed': '직접 가져오기 실패, 다운로드 방식 시도 중:',
    'file.url.fetch.failed': 'URL에서 콘텐츠를 가져올 수 없습니다: %s',
    'file.check.api.key': 'API 키 확인:',
    'file.target.files': '대상 파일:',
    'file.start.processing': '파일 처리 시작: %s',
    'file.translation.complete': '번역 완료: %s -> %s',
    'file.write.failed': '파일 쓰기 실패: %s',
    'file.translation.failed': '번역 실패: %s',
    'file.log.cleared': '성공적으로 번역된 %d개 파일의 기록이 제거되었습니다',
    'file.stats.title': '통계 정보:',
    'file.stats.dirs': '디렉토리 수: %d',
    'file.stats.files': '파일 수: %d',
    'file.stats.total': '총: %d개 항목',
  },
};
