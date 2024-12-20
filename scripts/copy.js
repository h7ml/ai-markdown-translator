import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 将 import.meta.url 转换为文件路径
const __filename = fileURLToPath(import.meta.url); // 当前脚本的文件路径
const __dirname = path.dirname(__filename); // 当前文件所在目录

const srcDir = path.join(__dirname, '../src'); // 源文件目录
const distDir = path.join(__dirname, '../dist'); // 目标文件目录

// 检查目标目录是否存在，如果不存在则创建
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true }); // 递归创建目标目录
}

// 遍历 src 目录下的所有 Markdown 文件
const files = fs.readdirSync(srcDir);
files.forEach((file) => {
  const filePath = path.join(srcDir, file);

  // 检查是否是 .md 文件
  if (path.extname(file) === '.md') {
    const destPath = path.join(distDir, file); // 目标文件路径

    // 复制文件
    fs.copyFileSync(filePath, destPath);
    console.log(`已复制文件 ${file} 到 ${distDir}`);
  }
});
