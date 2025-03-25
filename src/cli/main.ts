import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { SupportedLocale } from '../config/i18n';
import { CliOptions } from '../types/option';
import { setLocale } from '../utils/i18n';
import { checkArgument, setDefault } from './helper';
import { OPTIONS } from './options';

/**
 * Define and parse CLI options.
 * 定义并解析命令行选项。
 * CLI 옵션을 정의하고 파싱합니다.
 */
export async function parseCliOptions() {
  // Parse locale parameter first and apply locale options
  // 首先解析语言环境参数并应用语言选项
  // locale 파라미터를 먼저 파싱하고 언어 옵션 적용
  const preArgv = await yargs(hideBin(process.argv))
    .option('locale', {
      description: '언어 설정 / Language setting / 语言设置 (en, zh, ko)',
      type: 'string',
      choices: ['en', 'zh', 'ko'],
      default: 'zh',
    })
    .help(false)
    .parse();

  setLocale(preArgv.locale as SupportedLocale);

  const yargsInstance = yargs(hideBin(process.argv));

  applyOptions(yargsInstance, preArgv.locale as SupportedLocale);

  // Set default values based on environment variables and add validation
  // 根据环境变量设置默认值并添加验证
  // API 키 기본값 설정 및 검증 추가
  yargsInstance.middleware(setDefault).check(checkArgument).help().alias('help', 'h');

  const argv = await yargsInstance.argv;

  return argv as unknown as CliOptions;
}

// Helper function for applying options
// 应用选项的辅助函数
// 옵션 적용을 위한 헬퍼 함수
export function applyOptions(yargs: yargs.Argv, locale: SupportedLocale) {
  Object.entries(OPTIONS).forEach(([key, option]) => {
    if (option.disabled) return;
    const description = option.description[locale];
    yargs.option(key, {
      alias: option.alias,
      description,
      type: option.type as any,
      default: option.default,
      demandOption: option.demandOption,
      choices: option.choices,
    });
  });
  return yargs;
}
