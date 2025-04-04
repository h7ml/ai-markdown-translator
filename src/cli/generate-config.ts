import * as fs from 'fs';
import * as path from 'path';
import { OPTIONS } from './options';
import { CliOptions } from '../types/option';
import { ApiType } from '../types/common';
import { SupportedLocale } from '../config/i18n';

type RequiredConfig = Required<
  Omit<CliOptions, 'input' | 'url' | 'output' | 'extension' | 'file-filter'>
>;

type Config = RequiredConfig & {
  input?: string;
  url?: string;
  output?: string;
  extension?: string;
  'file-filter'?: string;
};

type ConfigValue = string | number | boolean | null;

/**
 * Converts option definitions to JSON configuration.
 * Creates a configuration file based on CLI option definitions, their default values and types.
 */
function optionsToConfig(customValues: Partial<Config> = {}): Config {
  const tempConfig: Partial<Record<keyof Config, ConfigValue>> = {};

  // Process all items in the OPTIONS object
  Object.entries(OPTIONS).forEach(([key, option]) => {
    // Skip disabled options
    if (option.disabled) return;

    const configKey = key as keyof Config;

    // Use custom values if available, otherwise use default values
    if (configKey in customValues && customValues[configKey] !== undefined) {
      tempConfig[configKey] = customValues[configKey] as ConfigValue;
    } else if ('default' in option && option.default !== undefined) {
      tempConfig[configKey] = option.default as ConfigValue;
    } else {
      // Set default values based on type
      switch (option.type) {
        case 'string':
          tempConfig[configKey] = '';
          break;
        case 'boolean':
          tempConfig[configKey] = false;
          break;
        case 'number':
          tempConfig[configKey] = 0;
          break;
        default:
          tempConfig[configKey] = null;
      }
    }
  });

  // Ensure all required fields are present with their default values
  const config: Config = {
    language: String(tempConfig.language || ''),
    'openai-url': String(tempConfig['openai-url'] || ''),
    'api-key': String(tempConfig['api-key'] || ''),
    'show-version': String(tempConfig['show-version'] || ''),
    retry: Boolean(tempConfig.retry ?? false),
    model: String(tempConfig.model || ''),
    rename: tempConfig.rename === null ? null : String(tempConfig.rename || ''),
    log: Boolean(tempConfig.log ?? false),
    'log-file': String(tempConfig['log-file'] || ''),
    'log-dir': String(tempConfig['log-dir'] || ''),
    'retry-count': Number(tempConfig['retry-count'] ?? 0),
    'retry-delay': Number(tempConfig['retry-delay'] ?? 0),
    path: String(tempConfig.path || ''),
    'show-path': Boolean(tempConfig['show-path'] ?? false),
    locale: String(tempConfig.locale || 'en') as SupportedLocale,
    'show-hidden': Boolean(tempConfig['show-hidden'] ?? false),
    'max-depth': Number(tempConfig['max-depth'] ?? 0),
    'api-type': String(tempConfig['api-type'] || 'completions') as ApiType,
    // Optional fields
    ...(tempConfig.input !== undefined && { input: String(tempConfig.input) }),
    ...(tempConfig.url !== undefined && { url: String(tempConfig.url) }),
    ...(tempConfig.output !== undefined && { output: String(tempConfig.output) }),
    ...(tempConfig.extension !== undefined && { extension: String(tempConfig.extension) }),
    ...(tempConfig['file-filter'] !== undefined && {
      'file-filter': String(tempConfig['file-filter']),
    }),
  };

  return config;
}

/**
 * Creates a .amdtrc configuration file.
 * @param outputPath Configuration file path (default: .amdtrc in the project root)
 * @param customValues Optional custom values to override defaults
 */
function generateConfigFile(): void {
  const outputPath: string = path.join(process.cwd(), '.amdtrc');
  const customValues: Partial<Config> = {};

  const config = optionsToConfig(customValues);

  // Create nicely formatted JSON string
  const configStr = JSON.stringify(config, null, 2);

  // Save to file
  fs.writeFileSync(outputPath, configStr);

  console.log(`Configuration file created: ${outputPath}`);
}

generateConfigFile();
