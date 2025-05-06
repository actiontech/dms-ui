const { writeFileSync, readdirSync, statSync } = require('fs');
const { join } = require('path');

function isDirectory(path) {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

function getSubDirectories(dirPath) {
  try {
    return readdirSync(dirPath).filter((name) =>
      isDirectory(join(dirPath, name))
    );
  } catch {
    return [];
  }
}

function formatToPascalCase(str) {
  // 处理不同的命名格式
  return (
    str
      // 处理下划线和中划线格式
      .split(/[-_]/)
      // 处理可能存在的其他分隔符（空格等）
      .flatMap((part) => part.split(/(?=[A-Z])/))
      .map((word) =>
        word
          // 转换为小写并移除非字母数字字符
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '')
          // 首字母大写
          .replace(/^[a-z]/, (char) => char.toUpperCase())
      )
      .join('')
  );
}

function validateServiceName(name) {
  // 验证服务名称是否符合 PascalCase 规范
  return /^[A-Z][a-zA-Z0-9]*$/.test(name);
}

function generateServiceExports(servicesPath) {
  const serviceDirectories = getSubDirectories(servicesPath);

  const exports = serviceDirectories.map((dirName) => {
    const formattedName = formatToPascalCase(dirName);

    if (!validateServiceName(formattedName)) {
      console.warn(
        `Warning: Service name "${dirName}" was formatted to "${formattedName}" which may not be ideal`
      );
    }

    return {
      original: dirName,
      formatted: formattedName
    };
  });

  // 检查是否有重复的格式化名称
  const duplicates = exports.reduce((acc, current) => {
    acc[current.formatted] = (acc[current.formatted] || 0) + 1;
    return acc;
  }, {});

  Object.entries(duplicates).forEach(([name, count]) => {
    if (count > 1) {
      throw new Error(`Duplicate service name after formatting: ${name}`);
    }
  });

  // return exports
  //   .map(
  //     ({ original, formatted }) =>
  //       `export { default as ${formatted}Service } from './service/${original}';\nexport type * from './service/${original}/index.d';\n`
  //   )
  //   .join('\n');
  // TODO 后端现在存在相同名称但内容不同的结构体，导致前端存在重复类型定义，等后端修复后再添加类型导出
  return exports
    .map(
      ({ original, formatted }) =>
        `export { default as ${formatted}Service } from './service/${original}';`
    )
    .join('\n');
}

function generateApiExports(servicesPath) {
  try {
    if (!isDirectory(servicesPath)) {
      throw new Error(`Invalid services path: ${servicesPath}`);
    }

    const exportContent = generateServiceExports(servicesPath);
    if (exportContent) {
      const outputPath = join(servicesPath, '..', 'index.ts');
      writeFileSync(outputPath, exportContent + '\n');
    }
  } catch (error) {
    console.error('Error generating API exports:', error);
    throw error;
  }
}

module.exports = generateApiExports;
