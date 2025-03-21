import * as fs from 'fs';
import * as path from 'path';
import { t } from '../utils/i18n';
import {
  readMarkdownFile,
  writeMarkdownFile,
  getContentFromUrl,
  translateDirectory,
} from '../services/file';
import { translateText } from '../services/api';
import { DirectoryOptions } from '../types';

/**
 * Process URL content.
 * 处理URL内容。
 * URL 콘텐츠를 처리합니다.
 */
export async function processUrlContent(
  url: string,
  outputPath: string | undefined,
  language: string,
  openaiUrl: string,
  apiKey: string,
  model: string,
  options: DirectoryOptions,
): Promise<void> {
  const markdownContent = await getContentFromUrl(url);
  await processContent(markdownContent, outputPath, language, openaiUrl, apiKey, model, options);
}

/**
 * Process input file or directory.
 * 处理输入文件或目录。
 * 입력 파일 또는 디렉토리를 처리합니다.
 */
export async function processInputPath(
  inputPath: string,
  outputPath: string | undefined,
  language: string,
  openaiUrl: string,
  apiKey: string,
  model: string,
  extension: string | null,
  rename: string | null,
  options: DirectoryOptions,
): Promise<void> {
  console.log('input path:', inputPath);
  const resolvedInputPath = path.resolve(inputPath);
  const stats = fs.statSync(resolvedInputPath);

  if (stats.isDirectory()) {
    const outputDir = outputPath ? path.resolve(outputPath) : resolvedInputPath;
    await translateDirectory(
      resolvedInputPath,
      outputDir,
      language,
      openaiUrl,
      apiKey,
      model,
      extension,
      rename,
      options,
    );
  } else {
    const markdownContent = readMarkdownFile(resolvedInputPath);
    // 출력 경로가 없으면 입력 경로를 사용 / If no output path, use input path / 如果没有输出路径，则使用输入路径
    const finalOutputPath = outputPath || inputPath;
    await processContent(
      markdownContent,
      finalOutputPath,
      language,
      openaiUrl,
      apiKey,
      model,
      options,
    );
  }
}

/**
 * Process markdown content.
 * 处理Markdown内容。
 * 마크다운 콘텐츠를 처리합니다.
 */
export async function processContent(
  markdownContent: string,
  outputPath: string | undefined,
  language: string,
  openaiUrl: string,
  apiKey: string,
  model: string,
  options: DirectoryOptions,
): Promise<void> {
  // 마크다운 코드 블록 처리 / Process markdown code blocks / 处理Markdown代码块
  let cleanedContent = markdownContent;
  if (cleanedContent.startsWith('```')) {
    cleanedContent = cleanedContent.slice(3).trim();
  }
  if (cleanedContent.endsWith('```')) {
    cleanedContent = cleanedContent.slice(0, -3).trim();
  }

  if (!outputPath) {
    throw new Error(t('cli.output.invalid'));
  }

  const resolvedOutputPath = path.resolve(outputPath);
  const translatedContent = await translateText(
    cleanedContent,
    language,
    openaiUrl,
    apiKey,
    model,
    {
      count: options.retryCount,
      delay: options.retryDelay,
      log: options.log,
      logFile: options.logFile,
      locale: options.locale,
    },
  );

  if (translatedContent) {
    let modifiedContent = translatedContent;
    // 번역된 콘텐츠에서 마크다운 코드 블록 제거 / Remove markdown code blocks from translated content / 从翻译内容中删除Markdown代码块
    if (modifiedContent.startsWith('```')) {
      const endOfFirstLine = modifiedContent.indexOf('\n');
      modifiedContent = modifiedContent.slice(endOfFirstLine + 1).trim();
    }

    if (modifiedContent.endsWith('```')) {
      const startOfLastLine = modifiedContent.lastIndexOf('\n');
      modifiedContent = modifiedContent.slice(0, startOfLastLine).trim();
    }

    writeMarkdownFile(resolvedOutputPath, modifiedContent);
    console.log(t('cli.translation.complete', outputPath, resolvedOutputPath));
  } else {
    console.log(t('api.translation.failed'));
  }
}
