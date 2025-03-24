import { messages, SupportedLocale } from '../config/i18n';

// Set current locale (default is 'zh')
// 设置当前语言环境（默认是 'zh'）
// 현재 로케일 설정 (기본값은 'zh')
let currentLocale: SupportedLocale = 'zh';

/**
 * Set current locale / 设置当前语言环境 / 현재 로케일 설정
 * @param locale New locale/ 新的语言环境 / 새 로케일
 */
export function setLocale(locale: SupportedLocale): void {
  if (messages[locale]) {
    currentLocale = locale;
  } else {
    console.warn(`지원되지 않는 로케일: ${locale}, 기본값 'zh'로 설정합니다.`);
  }
}

/**
 * @returns Current locale / 当前语言环境 / 현재 로케일
 */
export function getLocale(): SupportedLocale {
  return currentLocale;
}

/**
 * Return message for the current locale by key
 *
 * 返回当前语言环境的消息通过键
 *
 * 메시지 키에 해당하는 현재 로케일의 메시지 반환
 */
export function t(key: string, ...args: unknown[]): string {
  const locale = currentLocale;

  // Fallback to English if key is not found in current locale
  // 如果当前语言环境中找不到键，则回退到英语
  // 현재 로케일에 해당 키가 없으면 영어로 폴백
  if (!messages[locale] || !messages[locale][key]) {
    if (messages['en'] && messages['en'][key]) {
      return formatMessage(messages['en'][key], ...args);
    }
    // Return the key itself if not found in English
    // 如果在英语中也找不到，则返回键本身
    // 영어에도 없으면 키 자체를 반환
    return key;
  }

  return formatMessage(messages[locale][key], ...args);
}

/**
 * Message formatting / 消息格式化 / 메시지 포맷팅
 * @param message Original message / 原始消息 / 원본 메시지
 * @param args Formatting arguments / 格式化参数 / 포맷팅 인자들
 * @returns Formatted message / 格式化的消息 / 포맷팅된 메시지
 */
function formatMessage(message: string, ...args: unknown[]): string {
  if (!args || args.length === 0) return message;

  return message.replace(/%([sdifoO])/g, (match, type) => {
    if (args.length === 0) return match;
    const arg = args.shift();

    // 타입에 따라 포맷팅
    switch (type) {
      case 's':
        return String(arg);
      case 'd':
        return Number(arg).toString();
      case 'i':
        return parseInt(String(arg)).toString();
      case 'f':
        return parseFloat(String(arg)).toString();
      case 'o':
        return JSON.stringify(arg);
      case 'O':
        return JSON.stringify(arg, null, 2);
      default:
        return String(arg);
    }
  });
}
