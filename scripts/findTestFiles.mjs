#!/usr/bin/env node

/**
 * 查找指定路径下的所有单元测试文件
 *
 * 使用方法:
 * node findTestFiles.mjs <path> [options]
 *
 * 选项:
 *   --pattern, -p     自定义测试文件匹配模式，默认为 .test.{ts,tsx,js,jsx}
 *   --exclude, -e     额外要排除的目录，用逗号分隔
 *   --summary, -s     只显示统计信息，不列出所有文件
 *   --output, -o      将结果输出到指定的文件
 *   --check-render, -c 检查文件是否使用了自定义render方法
 *   --verbose, -v     显示详细信息
 *   --json, -j        以JSON格式输出结果
 *   --transform, -t   将customRender替换为superRender
 *   --dry-run, -d     与transform一起使用，只显示会修改的内容但不实际修改文件
 *
 * 例如:
 *   node findTestFiles.mjs packages/shared
 *   node findTestFiles.mjs packages/base/src/hooks -s
 *   node findTestFiles.mjs packages/sqle -p ".spec."
 *   node findTestFiles.mjs packages -e ".git,node_modules,lib" -o test-files.txt
 *   node findTestFiles.mjs packages/shared -c -v
 *   node findTestFiles.mjs packages -c --json -o render-stats.json
 *   node findTestFiles.mjs packages/base -c -t -d  # 检查并显示会修改的内容，但不实际修改
 *   node findTestFiles.mjs packages/base -c -t     # 检查并修改文件
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 默认设置
const DEFAULT_IGNORE_DIRS = [
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.git'
];
const DEFAULT_TEST_FILE_PATTERN = /\.test\.(tsx?|jsx?)$/;

// 定义每个包的自定义render导入模式
const CUSTOM_RENDER_PATTERNS = {
  base: [
    // 直接导入整个模块
    /import.*from\s+['"]@actiontech\/base\/src\/testUtils\/customRender['"]/,
    /import.*from\s+['"](\.\.+\/)+testUtils\/customRender['"]/,

    // 解构导入特定函数 - superRender
    /import.*\{\s*.*superRender.*\s*\}.*from\s+['"](\.\.+\/)+testUtils\/customRender['"]/,
    /import.*\{\s*.*superRender.*\s*\}.*from\s+['"]@actiontech\/base\/src\/testUtils\/customRender['"]/,

    // 解构导入特定函数 - 包含render关键字的函数
    /import.*\{\s*.*render.*\s*\}.*from\s+['"](\.\.+\/)+testUtils\/customRender['"]/,
    /import.*\{\s*.*render.*\s*\}.*from\s+['"]@actiontech\/base\/src\/testUtils\/customRender['"]/,

    // 解构导入特定钩子render函数
    /import.*\{\s*.*renderHooks.*\s*\}.*from\s+['"](\.\.+\/)+testUtils\/customRender['"]/,
    /import.*\{\s*.*renderHooks.*\s*\}.*from\s+['"]@actiontech\/base\/src\/testUtils\/customRender['"]/
  ],
  shared: [
    // 直接导入整个模块
    /import.*from\s+['"]@actiontech\/shared\/lib\/testUtil\/customRender['"]/,
    /import.*from\s+['"](\.\.+\/)+testUtil\/customRender['"]/,

    // 解构导入特定函数 - superRender
    /import.*\{\s*.*superRender.*\s*\}.*from\s+['"](\.\.+\/)+testUtil\/customRender['"]/,
    /import.*\{\s*.*superRender.*\s*\}.*from\s+['"]@actiontech\/shared\/lib\/testUtil\/customRender['"]/,

    // 解构导入特定函数 - 包含render关键字的函数
    /import.*\{\s*.*render.*\s*\}.*from\s+['"](\.\.+\/)+testUtil\/customRender['"]/,
    /import.*\{\s*.*render.*\s*\}.*from\s+['"]@actiontech\/shared\/lib\/testUtil\/customRender['"]/,

    // 解构导入特定钩子render函数
    /import.*\{\s*.*renderHooks.*\s*\}.*from\s+['"](\.\.+\/)+testUtil\/customRender['"]/,
    /import.*\{\s*.*renderHooks.*\s*\}.*from\s+['"]@actiontech\/shared\/lib\/testUtil\/customRender['"]/
  ],
  sqle: [
    // 直接导入整个模块
    /import.*from\s+['"]@actiontech\/sqle\/src\/testUtils\/customRender['"]/,
    /import.*from\s+['"](\.\.+\/)+testUtils\/customRender['"]/,

    // 解构导入特定函数 - superRender
    /import.*\{\s*.*superRender.*\s*\}.*from\s+['"](\.\.+\/)+testUtils\/customRender['"]/,
    /import.*\{\s*.*superRender.*\s*\}.*from\s+['"]@actiontech\/sqle\/src\/testUtils\/customRender['"]/,

    // 解构导入特定函数 - 包含render关键字的函数
    /import.*\{\s*.*render.*\s*\}.*from\s+['"](\.\.+\/)+testUtils\/customRender['"]/,
    /import.*\{\s*.*render.*\s*\}.*from\s+['"]@actiontech\/sqle\/src\/testUtils\/customRender['"]/,

    // 解构导入特定钩子render函数
    /import.*\{\s*.*renderHooks.*\s*\}.*from\s+['"](\.\.+\/)+testUtils\/customRender['"]/,
    /import.*\{\s*.*renderHooks.*\s*\}.*from\s+['"]@actiontech\/sqle\/src\/testUtils\/customRender['"]/,

    // 添加sqle包的多行导入模式
    /import\s+\{[\s\S]*?render.*[\s\S]*?\}\s+from\s+['"](\.\.+\/)+testUtils\/customRender['"]/
  ]
};

// 定义每个包中常用的render方法
const RENDER_METHODS = [
  // 组件渲染相关
  'superRender',
  'renderWithRedux',
  'renderWithRouter',
  'renderWithTheme',
  'renderWithReduxAndTheme',
  'renderWithRouterAndRedux',
  'renderWithThemeAndRedux',
  'renderWithThemeAndRouter',
  'renderWithThemeAndServerRouter',
  'renderWithServerRouter',
  'renderWithMemoryRouter',
  // 钩子渲染相关
  'renderHooksWithRedux',
  'renderHooksWithTheme',
  'renderHooksWithReduxAndRouter',
  'renderHook',
  'superRenderHook',
  'renderHookByReact',
  // 其它特殊渲染
  'mountWithTheme',
  'shallowWithRouter'
];

// 定义每个包的superRender导入路径和方法映射
const SUPER_RENDER_MAPPINGS = {
  base: {
    // 导入路径映射
    importPath: '@actiontech/base/src/testUtils/superRender',
    relativeImportPath: '../testUtils/superRender',
    // 方法名映射
    methodMappings: {
      // 组件渲染方法
      superRender: 'baseSuperRender',
      renderWithRedux: 'baseSuperRender',
      renderWithRouter: 'baseSuperRender',
      renderWithTheme: 'baseSuperRender',
      renderWithReduxAndTheme: 'baseSuperRender',
      renderWithRouterAndRedux: 'baseSuperRender',
      renderWithThemeAndRedux: 'baseSuperRender',
      renderWithThemeAndRouter: 'baseSuperRender',
      renderWithServerRouter: 'baseSuperRender',
      renderWithMemoryRouter: 'baseSuperRender',
      // 钩子渲染方法
      renderHooksWithRedux: 'baseSuperRenderHook',
      renderHooksWithTheme: 'baseSuperRenderHook',
      renderHooksWithReduxAndRouter: 'baseSuperRenderHook',
      renderHook: 'baseSuperRenderHook',
      superRenderHook: 'baseSuperRenderHook',
      // 其他
      mountWithTheme: 'baseSuperRender'
    }
  },
  shared: {
    // 导入路径映射
    importPath: '@actiontech/shared/lib/testUtil/superRender',
    relativeImportPath: '../testUtil/superRender',
    // 方法名映射
    methodMappings: {
      // 组件渲染方法
      superRender: 'superRender',
      renderWithRedux: 'superRender',
      renderWithRouter: 'superRender',
      renderWithTheme: 'superRender',
      renderWithReduxAndTheme: 'superRender',
      renderWithRouterAndRedux: 'superRender',
      renderWithThemeAndRedux: 'superRender',
      renderWithThemeAndRouter: 'superRender',
      renderWithServerRouter: 'superRender',
      renderWithMemoryRouter: 'superRender',
      // 钩子渲染方法
      renderHooksWithRedux: 'superRenderHook',
      renderHooksWithTheme: 'superRenderHook',
      renderHooksWithReduxAndRouter: 'superRenderHook',
      renderHook: 'superRenderHook',
      superRenderHook: 'superRenderHook',
      // 其他
      mountWithTheme: 'superRender'
    }
  },
  sqle: {
    // 导入路径映射
    importPath: '@actiontech/sqle/src/testUtils/superRender',
    relativeImportPath: '../testUtils/superRender',
    // 方法名映射
    methodMappings: {
      // 组件渲染方法
      superRender: 'sqleSuperRender',
      renderWithRedux: 'sqleSuperRender',
      renderWithRouter: 'sqleSuperRender',
      renderWithTheme: 'sqleSuperRender',
      renderWithReduxAndTheme: 'sqleSuperRender',
      renderWithRouterAndRedux: 'sqleSuperRender',
      renderWithThemeAndRedux: 'sqleSuperRender',
      renderWithThemeAndRouter: 'sqleSuperRender',
      renderWithServerRouter: 'sqleSuperRender',
      renderWithMemoryRouter: 'sqleSuperRender',
      // 钩子渲染方法
      renderHooksWithRedux: 'sqleSuperRenderHook',
      renderHooksWithTheme: 'sqleSuperRenderHook',
      renderHooksWithReduxAndRouter: 'sqleSuperRenderHook',
      renderHook: 'sqleSuperRenderHook',
      superRenderHook: 'sqleSuperRenderHook',
      // 其他
      mountWithTheme: 'sqleSuperRender'
    }
  }
};

/**
 * 解析命令行参数
 * @returns {Object} - 解析后的参数对象
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    path: null,
    pattern: DEFAULT_TEST_FILE_PATTERN,
    excludeDirs: [...DEFAULT_IGNORE_DIRS],
    summaryOnly: false,
    outputFile: null,
    checkRender: false,
    verbose: false,
    json: false,
    transform: false,
    dryRun: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith('--') || arg.startsWith('-')) {
      switch (arg) {
        case '--pattern':
        case '-p':
          if (i + 1 < args.length) {
            const patternStr = args[++i];
            options.pattern = new RegExp(patternStr);
          }
          break;
        case '--exclude':
        case '-e':
          if (i + 1 < args.length) {
            const excludes = args[++i].split(',');
            options.excludeDirs = [...DEFAULT_IGNORE_DIRS, ...excludes];
          }
          break;
        case '--summary':
        case '-s':
          options.summaryOnly = true;
          break;
        case '--output':
        case '-o':
          if (i + 1 < args.length) {
            options.outputFile = args[++i];
          }
          break;
        case '--check-render':
        case '-c':
          options.checkRender = true;
          break;
        case '--verbose':
        case '-v':
          options.verbose = true;
          break;
        case '--json':
        case '-j':
          options.json = true;
          break;
        case '--transform':
        case '-t':
          options.transform = true;
          break;
        case '--dry-run':
        case '-d':
          options.dryRun = true;
          break;
        default:
          console.warn(`未知选项: ${arg}`);
      }
    } else if (!options.path) {
      options.path = arg;
    }
  }

  return options;
}

/**
 * 检查文件是否使用了自定义render方法
 * @param {string} filePath - 文件路径
 * @returns {Promise<{hasCustomRender: boolean, packageName: string, methods: string[]}>} - 检查结果
 */
async function checkFileForCustomRender(filePath) {
  const result = {
    hasCustomRender: false,
    packageName: null,
    methods: []
  };

  try {
    // 从路径获取包名
    const packageMatch = filePath.match(/^packages\/([^\/]+)/);
    if (!packageMatch || !packageMatch[1]) {
      return result;
    }

    result.packageName = packageMatch[1];

    // 读取文件内容
    const content = await fs.readFile(filePath, 'utf-8');

    // 定义所有模式的集合，先查所有包的模式
    const allPatterns = [];

    // 先检查当前包的模式
    const packagePatterns = CUSTOM_RENDER_PATTERNS[result.packageName] || [];
    allPatterns.push(...packagePatterns);

    // 添加跨包导入的常见模式
    if (result.packageName !== 'shared') {
      // 非shared包也可能导入shared包的render方法
      allPatterns.push(
        /import.*from\s+['"]@actiontech\/shared\/lib\/testUtil\/customRender['"]/,
        /import.*\{\s*.*render.*\s*\}.*from\s+['"]@actiontech\/shared\/lib\/testUtil\/customRender['"]/,
        /import.*\{\s*.*renderHooks.*\s*\}.*from\s+['"]@actiontech\/shared\/lib\/testUtil\/customRender['"]/
      );

      // 处理多行导入，例如:
      // import {
      //   renderWithReduxAndTheme,
      //   renderHooksWithTheme
      // } from '@actiontech/shared/lib/testUtil/customRender';
      const multiLineImportPattern =
        /import\s+\{[\s\S]*?\}\s+from\s+['"]@actiontech\/shared\/lib\/testUtil\/customRender['"]/;
      allPatterns.push(multiLineImportPattern);
    }

    // 检查所有导入模式
    for (const pattern of allPatterns) {
      if (pattern.test(content)) {
        result.hasCustomRender = true;
        break;
      }
    }

    // 如果导入了自定义render，检查使用了哪些方法
    if (result.hasCustomRender) {
      for (const method of RENDER_METHODS) {
        // 改进方法调用检测，匹配不同调用模式
        const methodPatterns = [
          new RegExp(`\\b${method}\\s*\\(`), // 普通调用: renderMethod(
          new RegExp(`\\s+${method}\\s*=`), // 赋值: const { renderMethod } =
          new RegExp(`\\{\\s*${method}\\s*\\}`), // 解构: { renderMethod }
          new RegExp(`\\bconst\\s+${method}\\s*=`), // 常量声明: const renderMethod =
          new RegExp(`\\blet\\s+${method}\\s*=`), // 变量声明: let renderMethod =
          new RegExp(`\\bvar\\s+${method}\\s*=`) // 变量声明(var): var renderMethod =
        ];

        for (const pattern of methodPatterns) {
          if (pattern.test(content)) {
            result.methods.push(method);
            break; // 找到一个匹配就跳出当前方法的模式检查
          }
        }
      }
    }

    return result;
  } catch (error) {
    console.error(`读取文件 ${filePath} 失败:`, error.message);
    return result;
  }
}

/**
 * 递归查找指定目录下的所有测试文件
 * @param {string} dir - 要搜索的目录路径
 * @param {RegExp} pattern - 测试文件匹配模式
 * @param {string[]} excludeDirs - 要排除的目录
 * @param {boolean} checkRender - 是否检查自定义render使用情况
 * @param {boolean} transform - 是否转换customRender为superRender
 * @param {boolean} dryRun - 是否只显示转换而不实际修改
 * @returns {Promise<{files: string[], stats: Object}>} - 找到的测试文件和统计信息
 */
async function findTestFiles(
  dir,
  pattern,
  excludeDirs,
  checkRender,
  transform = false,
  dryRun = false
) {
  const result = {
    files: [],
    stats: {
      totalFiles: 0,
      byExtension: {},
      byPackage: {},
      renderStats: {
        totalChecked: 0,
        withCustomRender: 0,
        withoutCustomRender: 0,
        byPackage: {},
        byMethod: {}
      },
      transformStats: {
        totalTransformed: 0,
        successCount: 0,
        failCount: 0,
        byPackage: {}
      }
    },
    renderResults: [],
    transformResults: []
  };

  // 检查目录是否存在
  try {
    await fs.stat(dir);
  } catch (err) {
    console.error(`错误: 路径 "${dir}" 不存在或无法访问`);
    return result;
  }

  async function scan(directory) {
    const files = await fs.readdir(directory, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(directory, file.name);
      const relativePath = path.relative(process.cwd(), fullPath);

      // 如果是目录且不在排除列表中，则递归扫描
      if (file.isDirectory()) {
        if (!excludeDirs.includes(file.name)) {
          await scan(fullPath);
        }
        continue;
      }

      // 检查文件是否是测试文件
      if (pattern.test(file.name)) {
        result.files.push(relativePath);
        result.stats.totalFiles++;

        // 按扩展名统计
        const ext = path.extname(file.name);
        result.stats.byExtension[ext] =
          (result.stats.byExtension[ext] || 0) + 1;

        // 按包统计
        const packageMatch = relativePath.match(/^packages\/([^\/]+)/);
        if (packageMatch && packageMatch[1]) {
          const packageName = packageMatch[1];
          result.stats.byPackage[packageName] =
            (result.stats.byPackage[packageName] || 0) + 1;
        }

        // 检查文件是否使用了自定义render方法
        if (checkRender && packageMatch) {
          result.stats.renderStats.totalChecked++;
          const renderResult = await checkFileForCustomRender(relativePath);

          // 统计使用自定义render的文件数量
          if (renderResult.hasCustomRender) {
            result.stats.renderStats.withCustomRender++;

            // 按包统计
            result.stats.renderStats.byPackage[renderResult.packageName] =
              (result.stats.renderStats.byPackage[renderResult.packageName] ||
                0) + 1;

            // 按方法统计
            for (const method of renderResult.methods) {
              result.stats.renderStats.byMethod[method] =
                (result.stats.renderStats.byMethod[method] || 0) + 1;
            }

            // 如果需要转换，则执行转换
            if (transform && renderResult.hasCustomRender) {
              result.stats.transformStats.totalTransformed++;

              // 执行转换
              const transformResult = await transformCustomRenderToSuperRender(
                relativePath,
                renderResult,
                dryRun
              );

              // 统计转换结果
              if (transformResult.success) {
                result.stats.transformStats.successCount++;

                // 按包统计成功转换数量
                result.stats.transformStats.byPackage[
                  renderResult.packageName
                ] =
                  (result.stats.transformStats.byPackage[
                    renderResult.packageName
                  ] || 0) + 1;
              } else {
                result.stats.transformStats.failCount++;
              }

              // 保存转换结果
              result.transformResults.push({
                file: relativePath,
                ...transformResult
              });
            }
          } else {
            result.stats.renderStats.withoutCustomRender++;
          }

          // 保存文件检查结果
          result.renderResults.push({
            file: relativePath,
            ...renderResult
          });
        }
      }
    }
  }

  await scan(dir);
  return result;
}

/**
 * 输出结果到控制台或文件
 * @param {Object} result - 查找结果
 * @param {Object} options - 命令行选项
 */
async function outputResults(result, options) {
  const { files, stats, renderResults, transformResults } = result;

  // 如果是JSON格式输出
  if (options.json) {
    const jsonOutput = JSON.stringify(
      {
        stats,
        files: options.summaryOnly ? [] : files,
        renderResults: options.checkRender ? renderResults : [],
        transformResults:
          options.checkRender && options.transform ? transformResults : []
      },
      null,
      2
    );

    // 输出到控制台
    if (!options.outputFile) {
      console.log(jsonOutput);
    }

    // 写入到文件
    if (options.outputFile) {
      try {
        await fs.writeFile(options.outputFile, jsonOutput);
        console.log(`结果已保存到: ${options.outputFile}`);
      } catch (error) {
        console.error(`保存到文件时出错: ${error.message}`);
      }
    }
    return;
  }

  let output = [];

  if (files.length === 0) {
    output.push('未找到测试文件');
  } else {
    output.push(`找到 ${stats.totalFiles} 个测试文件`);

    // 输出统计信息
    output.push('\n统计信息:');
    output.push('按文件扩展名:');
    Object.entries(stats.byExtension).forEach(([ext, count]) => {
      output.push(`  ${ext}: ${count} 个文件`);
    });

    output.push('\n按包:');
    Object.entries(stats.byPackage).forEach(([pkg, count]) => {
      output.push(`  ${pkg}: ${count} 个文件`);
    });

    // 输出自定义render使用情况统计
    if (options.checkRender) {
      const renderStats = stats.renderStats;

      output.push('\n自定义render使用情况:');
      output.push(`  检查的文件总数: ${renderStats.totalChecked}`);
      output.push(
        `  使用自定义render的文件数: ${renderStats.withCustomRender} (${(
          (renderStats.withCustomRender / renderStats.totalChecked) *
          100
        ).toFixed(2)}%)`
      );
      output.push(
        `  未使用自定义render的文件数: ${renderStats.withoutCustomRender} (${(
          (renderStats.withoutCustomRender / renderStats.totalChecked) *
          100
        ).toFixed(2)}%)`
      );

      if (Object.keys(renderStats.byPackage).length > 0) {
        output.push('\n  按包统计使用自定义render的文件数:');
        Object.entries(renderStats.byPackage).forEach(([pkg, count]) => {
          const totalInPackage = stats.byPackage[pkg] || 0;
          const percentage = totalInPackage
            ? ((count / totalInPackage) * 100).toFixed(2)
            : '0.00';
          output.push(
            `    ${pkg}: ${count}/${totalInPackage} (${percentage}%)`
          );
        });
      }

      if (Object.keys(renderStats.byMethod).length > 0) {
        output.push('\n  按方法统计使用次数:');
        Object.entries(renderStats.byMethod)
          .sort((a, b) => b[1] - a[1]) // 按使用次数降序排列
          .forEach(([method, count]) => {
            output.push(`    ${method}: ${count}`);
          });
      }

      // 输出转换统计信息
      if (options.transform) {
        const transformStats = stats.transformStats;

        output.push('\n自定义render转换情况:');
        output.push(`  需要转换的文件总数: ${transformStats.totalTransformed}`);
        output.push(`  成功转换文件数: ${transformStats.successCount}`);
        output.push(`  失败转换文件数: ${transformStats.failCount}`);

        if (Object.keys(transformStats.byPackage).length > 0) {
          output.push('\n  按包统计成功转换文件数:');
          Object.entries(transformStats.byPackage).forEach(([pkg, count]) => {
            const totalWithCustomRender = renderStats.byPackage[pkg] || 0;
            const percentage = totalWithCustomRender
              ? ((count / totalWithCustomRender) * 100).toFixed(2)
              : '0.00';
            output.push(
              `    ${pkg}: ${count}/${totalWithCustomRender} (${percentage}%)`
            );
          });
        }

        // 显示转换详情
        if (options.verbose) {
          output.push('\n转换详情:');

          // 成功的转换
          const successResults = transformResults.filter((r) => r.success);
          if (successResults.length > 0) {
            output.push('\n成功转换的文件:');
            successResults.forEach((result) => {
              output.push(`  ${result.file} - ${result.message}`);

              // 在dry run模式下显示差异
              if (options.dryRun && result.diff.before !== result.diff.after) {
                const diffPreview = generateSimpleDiff(
                  result.diff.before,
                  result.diff.after
                );
                output.push('\n  差异预览:');
                output.push(
                  diffPreview
                    .split('\n')
                    .map((line) => `    ${line}`)
                    .join('\n')
                );
                output.push('');
              }
            });
          }

          // 失败的转换
          const failResults = transformResults.filter((r) => !r.success);
          if (failResults.length > 0) {
            output.push('\n转换失败的文件:');
            failResults.forEach((result) => {
              output.push(`  ${result.file} - ${result.message}`);
            });
          }
        }
      }

      // 如果设置了详细模式并且不需要显示转换详情，列出使用自定义render的文件
      if (options.verbose && !options.transform) {
        output.push('\n使用自定义render的文件列表:');
        renderResults
          .filter((item) => item.hasCustomRender)
          .forEach((item) => {
            output.push(`  ${item.file}`);
            if (item.methods.length > 0) {
              output.push(`    使用方法: ${item.methods.join(', ')}`);
            }
          });

        output.push('\n未使用自定义render的文件列表:');
        renderResults
          .filter((item) => !item.hasCustomRender)
          .forEach((item) => {
            output.push(`  ${item.file}`);
          });
      }
    }

    // 如果不是只显示摘要且不是详细模式下的render检查，则列出所有文件
    if (!options.summaryOnly && !(options.checkRender && options.verbose)) {
      output.push('\n文件列表:');
      files.forEach((file) => {
        output.push(`  ${file}`);
      });
    }
  }

  const outputText = output.join('\n');

  // 输出到控制台
  console.log(outputText);

  // 如果指定了输出文件，也写入到文件
  if (options.outputFile) {
    try {
      await fs.writeFile(options.outputFile, outputText);
      console.log(`\n结果已保存到: ${options.outputFile}`);
    } catch (error) {
      console.error(`保存到文件时出错: ${error.message}`);
    }
  }
}

/**
 * 生成简单的文本差异表示
 * @param {string} oldText - 原始文本
 * @param {string} newText - 新文本
 * @returns {string} - 差异表示
 */
function generateSimpleDiff(oldText, newText) {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');

  // 只查找导入语句的差异和方法调用的差异
  const diffLines = [];

  // 查找导入语句差异
  const oldImports = oldLines.filter(
    (line) => line.includes('import') && line.includes('customRender')
  );
  const newImports = newLines.filter(
    (line) => line.includes('import') && line.includes('superRender')
  );

  if (oldImports.length > 0 || newImports.length > 0) {
    diffLines.push('导入语句变化:');

    // 旧导入
    if (oldImports.length > 0) {
      diffLines.push('  原导入:');
      oldImports.forEach((line) => {
        diffLines.push(`  - ${line.trim()}`);
      });
    }

    // 新导入
    if (newImports.length > 0) {
      diffLines.push('  新导入:');
      newImports.forEach((line) => {
        diffLines.push(`  + ${line.trim()}`);
      });
    }
  }

  // 查找方法调用变化
  const methodDiffs = [];
  const renderMethodNames = RENDER_METHODS.map((method) => `${method}(`);
  const newMethodNames = Object.values(
    SUPER_RENDER_MAPPINGS.base.methodMappings
  )
    .concat(Object.values(SUPER_RENDER_MAPPINGS.shared.methodMappings))
    .concat(Object.values(SUPER_RENDER_MAPPINGS.sqle.methodMappings))
    .map((method) => `${method}(`);

  // 查找所有包含旧方法名的行
  oldLines.forEach((line, i) => {
    const trimmedLine = line.trim();

    for (const methodName of renderMethodNames) {
      if (trimmedLine.includes(methodName)) {
        // 找到对应的新行
        let found = false;
        for (
          let j = Math.max(0, i - 2);
          j < Math.min(newLines.length, i + 3);
          j++
        ) {
          const newLine = newLines[j].trim();
          if (newMethodNames.some((newMethod) => newLine.includes(newMethod))) {
            methodDiffs.push({
              oldLine: trimmedLine,
              newLine: newLine
            });
            found = true;
            break;
          }
        }

        if (!found) {
          methodDiffs.push({
            oldLine: trimmedLine,
            newLine: null
          });
        }

        break;
      }
    }
  });

  if (methodDiffs.length > 0) {
    diffLines.push('\n方法调用变化:');
    methodDiffs.forEach((diff) => {
      diffLines.push(`  - ${diff.oldLine}`);
      if (diff.newLine) {
        diffLines.push(`  + ${diff.newLine}`);
      }
    });
  }

  return diffLines.join('\n');
}

/**
 * 计算从给定文件到目标目录的相对路径
 * @param {string} filePath - 文件路径
 * @param {string} packageName - 包名
 * @returns {string} - 计算出的相对路径
 */
function calculateRelativePath(filePath, packageName) {
  // 确定测试文件所在的目录
  const fileDir = path.dirname(filePath);

  // 确定testUtils目录路径
  let testUtilsDir;
  if (packageName === 'shared') {
    testUtilsDir = path.join('packages', 'shared', 'lib', 'testUtil');
  } else {
    testUtilsDir = path.join('packages', packageName, 'src', 'testUtils');
  }

  // 计算从文件所在目录到testUtils目录的相对路径
  const relativePath = path.relative(fileDir, testUtilsDir);

  // 确保路径以 ./ 或 ../ 开头
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}

/**
 * 转换测试文件中的自定义render为superRender
 * @param {string} filePath - 文件路径
 * @param {Object} renderResult - 检查结果
 * @param {boolean} dryRun - 是否只是演示而不实际修改
 * @returns {Promise<{success: boolean, message: string, diff: Object}>} - 转换结果
 */
async function transformCustomRenderToSuperRender(
  filePath,
  renderResult,
  dryRun = false
) {
  const result = {
    success: false,
    message: '',
    diff: {
      before: '',
      after: ''
    }
  };

  if (!renderResult.hasCustomRender || renderResult.methods.length === 0) {
    result.message = '文件没有使用自定义render方法或无法检测到具体的方法';
    return result;
  }

  try {
    // 读取文件内容
    const content = await fs.readFile(filePath, 'utf-8');
    result.diff.before = content;

    // 获取包对应的superRender映射
    const packageMapping = SUPER_RENDER_MAPPINGS[renderResult.packageName];
    if (!packageMapping) {
      result.message = `未找到包 ${renderResult.packageName} 的superRender映射`;
      return result;
    }

    // 查找所有可能的customRender导入
    // 1. 单行导入 (import X from '...customRender')
    // 2. 单行解构导入 (import { X, Y } from '...customRender')
    // 3. 多行解构导入 (import { X, \n Y } from '...customRender')
    let importMatches = [];

    // 单行完整导入
    const singleLineImportRegex =
      /import\s+(\w+)\s+from\s+['"](.+customRender)['"]/g;
    let match;
    while ((match = singleLineImportRegex.exec(content)) !== null) {
      importMatches.push({
        type: 'default',
        fullMatch: match[0],
        importName: match[1],
        importPath: match[2]
      });
    }

    // 单行解构导入
    const singleLineDestructuredRegex =
      /import\s+\{\s*(.*?)\s*\}\s+from\s+['"](.+customRender)['"]/g;
    while ((match = singleLineDestructuredRegex.exec(content)) !== null) {
      importMatches.push({
        type: 'destructured',
        fullMatch: match[0],
        importItems: match[1].split(',').map((item) => item.trim()),
        importPath: match[2]
      });
    }

    // 多行解构导入 - 需要更复杂的处理
    const content_lines = content.split('\n');
    for (let i = 0; i < content_lines.length; i++) {
      const line = content_lines[i];

      // 检测多行导入的开始
      if (line.match(/import\s+\{/)) {
        let importBlock = line;
        let j = i + 1;
        let closingBraceFound = line.includes('}');

        // 如果没有在同一行找到闭合的大括号，继续读取后续行直到找到
        while (!closingBraceFound && j < content_lines.length) {
          importBlock += '\n' + content_lines[j];
          if (content_lines[j].includes('}')) {
            closingBraceFound = true;
          }
          j++;
        }

        // 如果这是一个完整的导入语句并且包含customRender
        if (closingBraceFound && importBlock.includes('customRender')) {
          const multiLineMatch = importBlock.match(
            /import\s+\{([\s\S]*?)\}\s+from\s+['"](.+customRender)['"]/
          );
          if (multiLineMatch) {
            const importItems = multiLineMatch[1]
              .replace(/\n/g, ' ')
              .split(',')
              .map((item) => item.trim())
              .filter((item) => item.length > 0);

            importMatches.push({
              type: 'multiline',
              fullMatch: importBlock,
              importItems: importItems,
              importPath: multiLineMatch[2],
              startLine: i,
              endLine: j - 1
            });
          }
        }
      }
    }

    if (importMatches.length === 0) {
      result.message = '未找到可识别的customRender导入语句';
      return result;
    }

    let newContent = content;

    // 处理每一个导入语句
    for (const importMatch of importMatches) {
      // 获取导入来源的包名
      let sourcePackage = '';
      if (importMatch.importPath.includes('@actiontech/base')) {
        sourcePackage = 'base';
      } else if (importMatch.importPath.includes('@actiontech/shared')) {
        sourcePackage = 'shared';
      } else if (importMatch.importPath.includes('@actiontech/sqle')) {
        sourcePackage = 'sqle';
      } else {
        // 使用相对路径导入，假定是当前包
        sourcePackage = renderResult.packageName;
      }

      // 获取导入源的映射
      const sourceMappings = SUPER_RENDER_MAPPINGS[sourcePackage];
      if (!sourceMappings) {
        continue;
      }

      // 确定导入路径
      const isAbsolutePath = importMatch.importPath.includes('@actiontech/');
      let newImportPath = '';

      if (isAbsolutePath) {
        // 维持原始包的绝对导入路径
        if (importMatch.importPath.includes('@actiontech/base')) {
          newImportPath = SUPER_RENDER_MAPPINGS.base.importPath;
        } else if (importMatch.importPath.includes('@actiontech/shared')) {
          newImportPath = SUPER_RENDER_MAPPINGS.shared.importPath;
        } else if (importMatch.importPath.includes('@actiontech/sqle')) {
          newImportPath = SUPER_RENDER_MAPPINGS.sqle.importPath;
        }
      } else {
        // 根据文件位置动态计算相对路径
        const relativePath = calculateRelativePath(filePath, sourcePackage);
        newImportPath = `${relativePath}/superRender`;
      }

      // 处理不同类型的导入
      if (importMatch.type === 'default') {
        // 处理默认导入: import X from 'customRender'
        const importVarName = importMatch.importName;

        // 使用的方法
        const usedMethods = renderResult.methods.filter(
          (method) =>
            // 找出使用了该导入变量的方法调用
            new RegExp(`\\b${importVarName}\\.\\w+\\s*\\(`).test(content) ||
            // 或者直接使用的方法
            new RegExp(`\\b${method}\\s*\\(`).test(content)
        );

        // 需要导入的新方法
        const newMethods = [
          ...new Set(
            usedMethods
              .map((m) => sourceMappings.methodMappings[m])
              .filter(Boolean)
          )
        ];

        if (newMethods.length === 0) {
          continue; // 没有需要替换的方法
        }

        // 替换整体导入为解构导入
        newContent = newContent.replace(
          importMatch.fullMatch,
          `import { ${newMethods.join(', ')} } from '${newImportPath}'`
        );

        // 替换方法调用: importVar.method() -> newMethod()
        for (const method of usedMethods) {
          const newMethod = sourceMappings.methodMappings[method];
          if (newMethod) {
            // 替换 importVar.method() 模式
            const varMethodRegex = new RegExp(
              `\\b${importVarName}\\.${method}\\s*\\(`,
              'g'
            );
            newContent = newContent.replace(varMethodRegex, `${newMethod}(`);

            // 替换直接使用的方法调用
            const directMethodRegex = new RegExp(`\\b${method}\\s*\\(`, 'g');
            newContent = newContent.replace(directMethodRegex, `${newMethod}(`);
          }
        }
      } else if (
        importMatch.type === 'destructured' ||
        importMatch.type === 'multiline'
      ) {
        // 处理解构导入: import { X, Y } from 'customRender'
        // 或多行导入: import { X, Y, Z } from 'customRender'
        const importedItems = importMatch.importItems;

        // 解析导入的方法列表
        const importedMethods = importedItems
          .map((part) => {
            // 处理可能的别名导入 (如 { original as alias })
            const match = part.match(/(\w+)(?:\s+as\s+(\w+))?/);
            if (match) {
              return {
                original: match[1],
                alias: match[2] || match[1]
              };
            }
            return null;
          })
          .filter(Boolean);

        // 映射到新的方法
        const newMethodsMap = {};
        const newMethodsList = [];

        for (const { original, alias } of importedMethods) {
          const newMethod = sourceMappings.methodMappings[original];
          if (newMethod) {
            if (original === alias) {
              // 没有使用别名的情况
              newMethodsMap[original] = newMethod;
              newMethodsList.push(newMethod);
            } else {
              // 使用了别名的情况
              newMethodsMap[alias] = newMethod;
              newMethodsList.push(`${newMethod} as ${alias}`);
            }
          }
        }

        if (Object.keys(newMethodsMap).length === 0) {
          continue; // 没有需要替换的方法
        }

        // 替换导入语句 - 需要注意多行导入的情况
        const escapedFullMatch = importMatch.fullMatch.replace(
          /[.*+?^${}()|[\]\\]/g,
          '\\$&'
        );
        const importRegex = new RegExp(
          escapedFullMatch.replace(/\n/g, '\\n'),
          'g'
        );

        newContent = newContent.replace(
          importRegex,
          `import { ${newMethodsList.join(', ')} } from '${newImportPath}'`
        );

        // 替换方法调用
        for (const [oldMethod, newMethod] of Object.entries(newMethodsMap)) {
          const methodRegex = new RegExp(`\\b${oldMethod}\\s*\\(`, 'g');
          newContent = newContent.replace(methodRegex, `${newMethod}(`);
        }
      }
    }

    result.diff.after = newContent;

    // 如果内容没有变化
    if (content === newContent) {
      result.message = '文件无需修改';
      return result;
    }

    // 实际写入文件
    if (!dryRun) {
      await fs.writeFile(filePath, newContent);
      result.success = true;
      result.message = '文件已成功修改';
    } else {
      result.success = true;
      result.message = '文件可以修改 (dry run模式)';
    }

    return result;
  } catch (error) {
    result.message = `转换文件时出错: ${error.message}`;
    return result;
  }
}

/**
 * 主函数
 */
async function main() {
  // 解析命令行参数
  const options = parseArgs();

  if (!options.path) {
    console.error('请提供要搜索的路径');
    console.log('使用方法: node findTestFiles.mjs <path> [options]');
    console.log('尝试 node findTestFiles.mjs --help 获取更多帮助');
    process.exit(1);
  }

  // 输出当前设置
  console.log('配置:');
  console.log(`  路径: ${options.path}`);
  console.log(`  匹配模式: ${options.pattern}`);
  console.log(`  排除目录: ${options.excludeDirs.join(', ')}`);
  if (options.checkRender) {
    console.log('  检查自定义render使用情况: 是');
  }
  if (options.verbose) {
    console.log('  详细模式: 是');
  }
  if (options.json) {
    console.log('  输出格式: JSON');
  }

  const absolutePath = path.resolve(process.cwd(), options.path);
  console.log(`\n正在搜索路径: ${absolutePath}\n`);

  try {
    const result = await findTestFiles(
      absolutePath,
      options.pattern,
      options.excludeDirs,
      options.checkRender,
      options.transform,
      options.dryRun
    );
    await outputResults(result, options);
  } catch (error) {
    console.error('搜索测试文件时出错:', error);
    process.exit(1);
  }
}

// 如果参数是 --help，显示帮助信息
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
查找指定路径下的所有单元测试文件

使用方法:
  node findTestFiles.mjs <path> [options]

选项:
  --pattern, -p     自定义测试文件匹配模式，默认为 .test.{ts,tsx,js,jsx}
  --exclude, -e     额外要排除的目录，用逗号分隔
  --summary, -s     只显示统计信息，不列出所有文件
  --output, -o      将结果输出到指定的文件
  --check-render, -c 检查文件是否使用了自定义render方法
  --verbose, -v     显示详细信息
  --json, -j        以JSON格式输出结果
  --transform, -t   将customRender替换为superRender
  --dry-run, -d     与transform一起使用，只显示会修改的内容但不实际修改文件
  --help, -h        显示帮助信息

例如:
  node findTestFiles.mjs packages/shared
  node findTestFiles.mjs packages/base/src/hooks -s
  node findTestFiles.mjs packages/sqle -p ".spec."
  node findTestFiles.mjs packages -e ".git,node_modules,lib" -o test-files.txt
  node findTestFiles.mjs packages/shared -c -v
  node findTestFiles.mjs packages -c --json -o render-stats.json
  node findTestFiles.mjs packages/base -c -t -d  # 检查并显示会修改的内容，但不实际修改
  node findTestFiles.mjs packages/base -c -t     # 检查并修改文件
  `);
  process.exit(0);
}

main().catch(console.error);
