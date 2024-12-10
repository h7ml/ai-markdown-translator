import * as fs from 'fs';
import axios from 'axios';
import { config } from 'dotenv';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

config();

function readMarkdownFile(filePath: string): string {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Input file ${filePath} does not exist.`);
  }
  return fs.readFileSync(filePath, 'utf-8');
}

function writeMarkdownFile(filePath: string, content: string): void {
  fs.writeFileSync(filePath, content, 'utf-8');
}

async function translateText(
  text: string,
  targetLanguage: string,
  openaiUrl: string,
  apiKey: string,
  model: string,
): Promise<string | null> {
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };

  const prompt = `Translate the following text to ${targetLanguage}. Markdown syntax should be preserved:\n\n${text}`;

  const data = {
    model: model,
    messages: [{ role: 'user', content: prompt }],
  };

  try {
    const response = await axios.post(openaiUrl, data, { headers });
    if (response.status === 200) {
      return response.data.choices[0].message.content;
    } else {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      return null;
    }
  } catch (error) {
    console.error(`Request failed: ${error}`);
    return null;
  }
}

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option('input', {
      alias: 'i',
      description: 'Input Markdown file',
      type: 'string',
      demandOption: true,
    })
    .option('output', {
      alias: 'o',
      description: 'Output Markdown file',
      type: 'string',
      demandOption: true,
    })
    .option('language', {
      alias: 'l',
      description: 'Target language',
      type: 'string',
      demandOption: true,
    })
    .option('openai-url', {
      description: 'OpenAI API URL',
      type: 'string',
      default: process.env.OPENAI_URL,
    })
    .option('api-key', {
      description: 'OpenAI API Key',
      type: 'string',
      default: process.env.API_KEY,
    })
    .option('model', {
      description: 'OpenAI Model to use',
      type: 'string',
      default: process.env.MODEL || 'gpt-3.5-turbo',
    })
    .help()
    .alias('help', 'h').argv;

  try {
    if (!argv['openai-url']) {
      throw new Error(
        'OpenAI URL is required. Provide it via --openai-url or OPENAI_URL environment variable.',
      );
    }
    if (!argv['api-key']) {
      throw new Error(
        'API Key is required. Provide it via --api-key or API_KEY environment variable.',
      );
    }

    let markdownContent = readMarkdownFile(argv.input);

    if (markdownContent.startsWith('```')) {
      markdownContent = markdownContent.slice(3).trim();
    }
    if (markdownContent.endsWith('```')) {
      markdownContent = markdownContent.slice(0, -3).trim();
    }

    const translatedContent = await translateText(
      markdownContent,
      argv.language,
      argv['openai-url'] as string,
      argv['api-key'] as string,
      argv.model as string,
    );

    if (translatedContent) {
      writeMarkdownFile(argv.output, translatedContent);
      console.log(`Translation completed. Output saved to ${argv.output}.`);
    } else {
      console.log('Translation failed.');
    }
  } catch (error: Error | unknown) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

main()
  .catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
