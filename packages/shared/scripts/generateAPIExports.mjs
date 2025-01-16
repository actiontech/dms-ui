import { resolve, dirname, join } from 'path';
import { writeFileSync, readdirSync, statSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

function generateServiceExports(servicesPath, moduleName, exportedNames) {
  const serviceDirectories = getSubDirectories(servicesPath);

  const exports = serviceDirectories.map((dirName) => {
    const formattedName = formatToPascalCase(dirName);

    if (!validateServiceName(formattedName)) {
      console.warn(
        `Warning: Service name "${dirName}" was formatted to "${formattedName}" which may not be ideal`
      );
    }

    // 添加模块名前缀以确保唯一性
    const uniqueName = exportedNames.includes(formattedName)
      ? `${formattedName}${moduleName.toUpperCase()}`
      : formattedName;
    exportedNames.push(uniqueName);
    return {
      original: dirName,
      formatted: uniqueName
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

async function generateApiExports(
  options = {
    excludeDirs: ['common'],
    servicesDirName: 'service'
  }
) {
  const apiRootPath = resolve(__dirname, '..', 'lib', 'api');
  const exportedNames = [];

  try {
    const apiModules = readdirSync(apiRootPath).filter(
      (name) => !options.excludeDirs.includes(name)
    );

    for (const moduleName of apiModules) {
      const modulePath = join(apiRootPath, moduleName);

      if (!isDirectory(modulePath)) {
        continue;
      }

      const servicesPath = join(modulePath, options.servicesDirName);
      if (!isDirectory(servicesPath)) {
        continue;
      }

      const exportContent = generateServiceExports(
        servicesPath,
        moduleName,
        exportedNames
      );
      if (exportContent) {
        const outputPath = join(modulePath, 'index.ts');
        writeFileSync(outputPath, exportContent + '\n');

        console.log(`Generated exports for module: ${moduleName}`);
      }
    }
  } catch (error) {
    console.error('Error generating API exports:', error);
    throw error;
  }
}

generateApiExports().catch(console.error);
