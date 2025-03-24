import { SupportedLocale, messages } from '../config/i18n';

// 현재 로케일 설정 (기본값은 'zh')
let currentLocale: SupportedLocale = 'zh';

/**
 * 현재 로케일 설정
 * @param locale 새 로케일
 */
export function setLocale(locale: SupportedLocale): void {
  if (messages[locale]) {
    currentLocale = locale;
  } else {
    console.warn(`지원되지 않는 로케일: ${locale}, 기본값 'zh'로 설정합니다.`);
  }
}

/**
 * 현재 로케일 반환
 * @returns 현재 로케일
 */
export function getLocale(): SupportedLocale {
  return currentLocale;
}

/**
 * 메시지 키에 해당하는 현재 로케일의 메시지 반환
 * @param key 메시지 키
 * @param args 메시지 포맷팅을 위한 인자들
 * @returns 현지화된 메시지
 */
export function t(key: string, ...args: unknown[]): string {
  const locale = currentLocale;

  // 현재 로케일에 해당 키가 없으면 영어로 폴백
  if (!messages[locale] || !messages[locale][key]) {
    if (messages['en'] && messages['en'][key]) {
      return formatMessage(messages['en'][key], ...args);
    }
    return key; // 영어에도 없으면 키 자체를 반환
  }

  return formatMessage(messages[locale][key], ...args);
}

/**
 * 메시지 포맷팅
 * @param message 원본 메시지
 * @param args 포맷팅 인자들
 * @returns 포맷팅된 메시지
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
