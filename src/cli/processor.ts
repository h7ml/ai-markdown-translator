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
import { RuntimeOptions } from '../types';

/**
 * Process URL content.
 * 处理URL内容。
 * URL 콘텐츠를 처리합니다.
 */
export async function processUrlContent(options: RuntimeOptions): Promise<void> {
  if (!options.url) return;

  const markdownContent = await getContentFromUrl(options.url);
  await processContent(markdownContent, options);
}

/**
 * Process input file or directory.
 * 处理输入文件或目录。
 * 입력 파일 또는 디렉토리를 처리합니다.
 */
export async function processInputPath(options: RuntimeOptions): Promise<void> {
  if (!options.input) return;

  const resolvedInputPath = path.resolve(options.input);
  const stats = fs.statSync(resolvedInputPath);

  if (stats.isDirectory()) {
    const outputDir = options.output ? path.resolve(options.output) : resolvedInputPath;
    await translateDirectory(resolvedInputPath, outputDir, options);
  } else {
    const markdownContent = readMarkdownFile(resolvedInputPath);
    // 如果没有输出路径，则使用输入路径 / If no output path, use input path / 출력 경로가 없으면 입력 경로를 사용
    const finalOutputPath = options.output || options.input;

    await processContent(markdownContent, {
      ...options,
      output: finalOutputPath,
    });
  }
}

/**
 * Process markdown content.
 * 处理Markdown内容。
 * 마크다운 콘텐츠를 처리합니다.
 */
export async function processContent(
  markdownContent: string,
  options: RuntimeOptions,
): Promise<void> {
  // 处理Markdown代码块 / Process markdown code blocks / 마크다운 코드 블록 처리
  let cleanedContent = markdownContent;
  if (cleanedContent.startsWith('```')) {
    cleanedContent = cleanedContent.slice(3).trim();
  }
  if (cleanedContent.endsWith('```')) {
    cleanedContent = cleanedContent.slice(0, -3).trim();
  }

  if (!options.output) {
    throw new Error(t('cli.output.invalid'));
  }

  const resolvedOutputPath = path.resolve(options.output);
  const translatedContent = await translateText(cleanedContent, options);

  if (translatedContent) {
    let modifiedContent = translatedContent;
    // 从翻译内容中删除Markdown代码块 / Remove markdown code blocks from translated content / 번역된 콘텐츠에서 마크다운 코드 블록 제거
    if (modifiedContent.startsWith('```')) {
      const endOfFirstLine = modifiedContent.indexOf('\n');
      modifiedContent = modifiedContent.slice(endOfFirstLine + 1).trim();
    }

    if (modifiedContent.endsWith('```')) {
      const startOfLastLine = modifiedContent.lastIndexOf('\n');
      modifiedContent = modifiedContent.slice(0, startOfLastLine).trim();
    }

    writeMarkdownFile(resolvedOutputPath, modifiedContent);
    console.log(t('cli.translation.complete', options.output, resolvedOutputPath));
  } else {
    console.log(t('api.translation.failed'));
  }
}
