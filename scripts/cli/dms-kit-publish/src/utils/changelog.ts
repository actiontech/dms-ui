import * as fs from 'fs';

/**
 * 从 CHANGELOG.md 中提取指定版本的更新内容
 * @param changelogPath CHANGELOG.md 文件路径
 * @param version 版本号
 * @returns 版本的更新内容
 */
export function getChangelogForVersion(
  changelogPath: string,
  version: string
): string {
  try {
    const changelogContent = fs.readFileSync(changelogPath, 'utf-8');

    // 构建版本标题的正则表达式
    // 匹配 ## version 后面的内容，直到下一个 ## 或文件结尾
    const versionPattern = new RegExp(
      `## ${version}(?:\\s+[^\\n]*)?\\s*\\n([\\s\\S]*?)(?=\\n## |$)`,
      'i'
    );
    const match = changelogContent.match(versionPattern);

    if (match && match[1]) {
      // 清理内容，移除多余的空行和缩进
      const content = match[1]
        .trim()
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .join('\n');

      return content;
    }

    console.log(`未找到版本 ${version} 的 changelog`);
    return `未找到版本 ${version} 的 changelog`;
  } catch (error) {
    console.error('读取 changelog.md 文件失败:', error);
    return `读取 changelog.md 文件失败: ${error}`;
  }
}
