import * as fs from 'fs';
import * as path from 'path';
import archiver from 'archiver';

/**
 * 压缩文件夹为 zip 文件
 * @param sourceDir 源文件夹路径
 * @param outputZipPath 输出 zip 文件路径
 */
export function compressFolder(
  sourceDir: string,
  outputZipPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const outputStream = fs.createWriteStream(outputZipPath);

    outputStream.on('close', resolve);
    outputStream.on('error', reject);

    archive.pipe(outputStream);
    archive.directory(sourceDir, path.basename(sourceDir));
    archive.finalize();
  });
}
