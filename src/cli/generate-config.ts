import * as fs from 'fs';
import * as path from 'path';
import { OPTIONS } from './options';

/**
 * Converts option definitions to JSON configuration.
 * Creates a configuration file based on CLI option definitions, their default values and types.
 */
function optionsToConfig(customValues: Record<string, any> = {}): Record<string, any> {
  const config: Record<string, any> = {};

  // Process all items in the OPTIONS object
  Object.entries(OPTIONS).forEach(([key, option]) => {
    // Skip disabled options
    if (option.disabled) return;

    // Convert kebab-case to camelCase (e.g., 'log-file' -> 'logFile')
    const configKey = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

    // Use custom values if available, otherwise use default values
    if (configKey in customValues) {
      config[configKey] = customValues[configKey];
    } else if ('default' in option) {
      config[configKey] = option.default;
    } else {
      // Set default values based on type
      switch (option.type) {
        case 'string':
          config[configKey] = '';
          break;
        case 'boolean':
          config[configKey] = false;
          break;
        case 'number':
          config[configKey] = 0;
          break;
        default:
          config[configKey] = null;
      }
    }
  });

  return config;
}

/**
 * Returns use-case based configuration values.
 * Based on examples from README.md.
 */
function getUseCaseValues(): Record<string, any> {
  return {
    input: './docs',
    extension: 'md',
    rename: true,
    output: './translated',
    language: 'ko',
    openaiUrl: 'https://api.openai.com/v1/chat/completions',
    apiKey: '',
    model: 'gpt-3.5-turbo',
    retry: true,
    log: true,
    logFile: './logs/translation.log',
    logDir: './logs',
    retryCount: 3,
    retryDelay: 10,
    path: '.',
    showPath: true,
    showHidden: false,
    maxDepth: 5,
    fileFilter: '.md,.txt',
    locale: 'ko',
  };
}

/**
 * Creates a .amdtrc configuration file.
 * @param outputPath Configuration file path (default: .amdtrc in the project root)
 * @param useCustomValues Whether to use use-case based values
 */
function generateConfigFile(
  outputPath: string = path.join(process.cwd(), '.amdtrc'),
  useCustomValues: boolean = true,
): void {
  const customValues = useCustomValues ? getUseCaseValues() : {};
  const config = optionsToConfig(customValues);

  // Create nicely formatted JSON string
  const configStr = JSON.stringify(config, null, 2);

  // Save to file
  fs.writeFileSync(outputPath, configStr);

  console.log(`Configuration file created: ${outputPath}`);
  console.log(`Use-case based values used: ${useCustomValues ? 'Yes' : 'No'}`);
}

// Command line argument processing
// Example: node generate-config.js --default --output=./custom-config.json
if (require.main === module) {
  const args = process.argv.slice(2);
  const useDefault = args.includes('--default');
  const outputArg = args.find((arg) => arg.startsWith('--output='));
  const outputPath = outputArg ? outputArg.split('=')[1] : undefined;

  generateConfigFile(outputPath, !useDefault);
}

export { optionsToConfig, generateConfigFile, getUseCaseValues };
