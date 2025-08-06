const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('开始生成 API 和 Theme 文件...');

// 创建必要的目录
const apiDir = path.join(__dirname, '../src/api');
const themeDir = path.join(__dirname, '../src/theme');

if (!fs.existsSync(path.join(__dirname, '../src'))) {
  fs.mkdirSync(path.join(__dirname, '../src'), { recursive: true });
}

if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
}

if (!fs.existsSync(themeDir)) {
  fs.mkdirSync(themeDir, { recursive: true });
}

// 1. 生成 API 客户端
console.log('生成 API 客户端...');
try {
  const sqleApiOutput = path.resolve(apiDir, 'sqle', 'service');
  const dmsApiOutput = path.resolve(apiDir, 'dms', 'service');
  execSync(
    `pnpm api_client:g -p sqle-ui --output ${sqleApiOutput} && pnpm api_client:g -p dms-ui --output ${dmsApiOutput}`,
    {
      stdio: 'inherit',
      cwd: path.join(__dirname, '../../..')
    }
  );
  console.log('API 客户端生成完成');
} catch (error) {
  console.warn('API 客户端生成失败，但继续进行下一步:', error.message);
}

// 2. 复制 Theme 文件
console.log('复制 Theme 文件...');
try {
  const sharedThemePath = path.join(__dirname, '../../shared/lib/theme');

  // 复制并修复 dark/basic.ts
  const darkBasicSrc = path.join(sharedThemePath, 'dark/basic.ts');
  const darkBasicDest = path.join(themeDir, 'dark-basic.ts');
  if (fs.existsSync(darkBasicSrc)) {
    let darkBasicContent = fs.readFileSync(darkBasicSrc, 'utf8');
    // 修复导入路径
    darkBasicContent = darkBasicContent.replace(
      "import { BasicTheme, UITokenTheme } from '../theme.type';",
      "import { BasicTheme, UITokenTheme } from './theme.type';"
    );
    fs.writeFileSync(darkBasicDest, darkBasicContent);
    console.log('已复制并修复 dark/basic.ts');
  } else {
    console.warn('未找到 dark/basic.ts 文件');
  }

  // 复制并修复 light/basic.ts
  const lightBasicSrc = path.join(sharedThemePath, 'light/basic.ts');
  const lightBasicDest = path.join(themeDir, 'light-basic.ts');
  if (fs.existsSync(lightBasicSrc)) {
    let lightBasicContent = fs.readFileSync(lightBasicSrc, 'utf8');
    // 修复导入路径
    lightBasicContent = lightBasicContent.replace(
      "import { BasicTheme, UITokenTheme } from '../theme.type';",
      "import { BasicTheme, UITokenTheme } from './theme.type';"
    );
    fs.writeFileSync(lightBasicDest, lightBasicContent);
    console.log('已复制并修复 light/basic.ts');
  } else {
    console.warn('未找到 light/basic.ts 文件');
  }

  // 复制 theme.type.ts
  const themeTypeSrc = path.join(sharedThemePath, 'theme.type.ts');
  const themeTypeDest = path.join(themeDir, 'theme.type.ts');
  if (fs.existsSync(themeTypeSrc)) {
    fs.copyFileSync(themeTypeSrc, themeTypeDest);
    console.log('已复制 theme.type.ts');
  } else {
    console.warn('未找到 theme.type.ts 文件');
  }

  console.log('Theme 文件复制完成');
} catch (error) {
  console.error('复制 Theme 文件失败:', error.message);
}

// 3. 复制 Data 和 Enum 文件
console.log('复制 Data 和 Enum 文件...');
try {
  // 创建 data 和 enum 目录
  const dataDir = path.join(__dirname, '../src/data');
  const enumDir = path.join(__dirname, '../src/enum');

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(enumDir)) {
    fs.mkdirSync(enumDir, { recursive: true });
  }

  // 复制 data 目录下的文件
  const sharedDataPath = path.join(__dirname, '../../shared/lib/data');

  // 复制 common.ts
  const commonSrc = path.join(sharedDataPath, 'common.ts');
  const commonDest = path.join(dataDir, 'common.ts');
  if (fs.existsSync(commonSrc)) {
    fs.copyFileSync(commonSrc, commonDest);
    console.log('已复制 data/common.ts');
  } else {
    console.warn('未找到 data/common.ts 文件');
  }

  // 复制 EmitterKey.ts
  const emitterKeySrc = path.join(sharedDataPath, 'EmitterKey.ts');
  const emitterKeyDest = path.join(dataDir, 'EmitterKey.ts');
  if (fs.existsSync(emitterKeySrc)) {
    fs.copyFileSync(emitterKeySrc, emitterKeyDest);
    console.log('已复制 data/EmitterKey.ts');
  } else {
    console.warn('未找到 data/EmitterKey.ts 文件');
  }

  // 复制 enum 目录下的文件
  const sharedEnumPath = path.join(__dirname, '../../shared/lib/enum');

  // 复制 index.ts
  const enumIndexSrc = path.join(sharedEnumPath, 'index.ts');
  const enumIndexDest = path.join(enumDir, 'index.ts');
  if (fs.existsSync(enumIndexSrc)) {
    fs.copyFileSync(enumIndexSrc, enumIndexDest);
    console.log('已复制 enum/index.ts');
  } else {
    console.warn('未找到 enum/index.ts 文件');
  }

  // 创建 data 目录的 index.ts 文件
  const dataIndexContent = `// Data exports
export * from './common';
export { default as EmitterKey } from './EmitterKey';
`;
  fs.writeFileSync(path.join(dataDir, 'index.ts'), dataIndexContent);
  console.log('已创建 data/index.ts');

  console.log('Data 和 Enum 文件复制完成');
} catch (error) {
  console.error('复制 Data 和 Enum 文件失败:', error.message);
}

// 4. 创建通用 API 客户端文件
console.log('创建通用 API 客户端...');
try {
  // 创建公共 utils 目录
  const commonUtilsDir = path.join(apiDir, 'utils');
  if (!fs.existsSync(commonUtilsDir)) {
    fs.mkdirSync(commonUtilsDir, { recursive: true });
  }

  // 为 sqle 创建 utils 目录（用于引用）
  const sqleUtilsDir = path.join(apiDir, 'sqle', 'utils');
  if (!fs.existsSync(sqleUtilsDir)) {
    fs.mkdirSync(sqleUtilsDir, { recursive: true });
  }

  // 为 dms 创建 utils 目录（用于引用）
  const dmsUtilsDir = path.join(apiDir, 'dms', 'utils');
  if (!fs.existsSync(dmsUtilsDir)) {
    fs.mkdirSync(dmsUtilsDir, { recursive: true });
  }

  // 通用 API Client 内容
  const apiClientContent = `import { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';

export type ApiClientConfigOptions = {
  /** 自定义错误处理函数 */
  onError?: (error: any) => void;
  /** 是否在控制台输出调试信息 */
  debug?: boolean;
  /** 自定义请求拦截器 */
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  /** 自定义响应拦截器 */
  responseInterceptor?: (response: AxiosResponse) => AxiosResponse;
};

class SDKApiClient {
  private client: AxiosInstance | null = null;
  private options: ApiClientConfigOptions = {};

  /**
   * 配置 API 客户端实例
   * @param apiClient - axios 实例或兼容的 HTTP 客户端
   * @param options - 配置选项  
   */
  configure(apiClient: AxiosInstance, options: ApiClientConfigOptions = {}): void {
    this.client = apiClient;
    this.options = { ...this.options, ...options };
    
    if (this.options.debug) {
      console.log('[SDK API Client] Configured successfully');
    }
  }

  /**
   * 更新配置选项
   * @param options - 新的配置选项
   */
  updateOptions(options: Partial<ApiClientConfigOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * 获取当前配置的 API 客户端
   */
  getInstance(): AxiosInstance {
    if (!this.client) {
      const error = new Error(
        'API client not configured. Please call configure() with your axios instance first.\\n' +
        'Example: ApiClient.configure(axios.create({ baseURL: "your-api-url" }))'
      );
      
      if (this.options.onError) {
        this.options.onError(error);
      }
      
      throw error;
    }
    return this.client;
  }

  /**
   * 重置 API 客户端配置
   */
  reset(): void {
    this.client = null;
    this.options = {};
    
    if (this.options.debug) {
      console.log('[SDK API Client] Reset successfully');
    }
  }

  /**
   * 检查是否已配置
   */
  isConfigured(): boolean {
    return this.client !== null;
  }

  /**
   * 直接设置 API 客户端实例（高级用法）
   * @param client - API 客户端实例
   */
  setClient(client: AxiosInstance): void {
    this.client = client;
  }

  // 代理方法，直接调用配置的客户端
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const finalConfig = this.options.requestInterceptor 
        ? this.options.requestInterceptor(config || {})
        : config;
        
      if (this.options.debug) {
        console.log('[SDK API Client] GET:', url, finalConfig);
      }
      
      const response = await this.getInstance().get<T>(url, finalConfig);
      
      return this.options.responseInterceptor 
        ? this.options.responseInterceptor(response)
        : response;
    } catch (error) {
      if (this.options.onError) {
        this.options.onError(error);
      }
      throw error;
    }
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const finalConfig = this.options.requestInterceptor 
        ? this.options.requestInterceptor(config || {})
        : config;
        
      if (this.options.debug) {
        console.log('[SDK API Client] POST:', url, data, finalConfig);
      }
      
      const response = await this.getInstance().post<T>(url, data, finalConfig);
      
      return this.options.responseInterceptor 
        ? this.options.responseInterceptor(response)
        : response;
    } catch (error) {
      if (this.options.onError) {
        this.options.onError(error);
      }
      throw error;
    }
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const finalConfig = this.options.requestInterceptor 
        ? this.options.requestInterceptor(config || {})
        : config;
        
      if (this.options.debug) {
        console.log('[SDK API Client] PUT:', url, data, finalConfig);
      }
      
      const response = await this.getInstance().put<T>(url, data, finalConfig);
      
      return this.options.responseInterceptor 
        ? this.options.responseInterceptor(response)
        : response;
    } catch (error) {
      if (this.options.onError) {
        this.options.onError(error);
      }
      throw error;
    }
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const finalConfig = this.options.requestInterceptor 
        ? this.options.requestInterceptor(config || {})
        : config;
        
      if (this.options.debug) {
        console.log('[SDK API Client] PATCH:', url, data, finalConfig);
      }
      
      const response = await this.getInstance().patch<T>(url, data, finalConfig);
      
      return this.options.responseInterceptor 
        ? this.options.responseInterceptor(response)
        : response;
    } catch (error) {
      if (this.options.onError) {
        this.options.onError(error);
      }
      throw error;
    }
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const finalConfig = this.options.requestInterceptor 
        ? this.options.requestInterceptor(config || {})
        : config;
        
      if (this.options.debug) {
        console.log('[SDK API Client] DELETE:', url, finalConfig);
      }
      
      const response = await this.getInstance().delete<T>(url, finalConfig);
      
      return this.options.responseInterceptor 
        ? this.options.responseInterceptor(response)
        : response;
    } catch (error) {
      if (this.options.onError) {
        this.options.onError(error);
      }
      throw error;
    }
  }
}

// 导出单例实例
const apiClient = new SDKApiClient();
export default apiClient;

// 导出类型和类，允许用户创建自己的实例
export { SDKApiClient };
`;

  // 写入公共的 Api.ts 文件
  fs.writeFileSync(path.join(commonUtilsDir, 'ApiClient.ts'), apiClientContent);

  // 在 sqle/utils 下创建引用文件
  const sqleApiReference = `// Re-export from common utils
export * from '../../utils/ApiClient';
export { default } from '../../utils/ApiClient';
`;
  fs.writeFileSync(path.join(sqleUtilsDir, 'Api.ts'), sqleApiReference);

  // 在 dms/utils 下创建引用文件
  const dmsApiReference = `// Re-export from common utils
export * from '../../utils/ApiClient';
export { default } from '../../utils/ApiClient';
`;
  fs.writeFileSync(path.join(dmsUtilsDir, 'Api.ts'), dmsApiReference);

  console.log('通用 API 客户端创建完成');
} catch (error) {
  console.error('创建通用 API 客户端失败:', error.message);
}

// 5. 修复 .d.ts 文件问题
console.log('修复 .d.ts 文件...');
try {
  // 递归查找所有 .d.ts 文件的函数
  function findDtsFiles(dir, files = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        findDtsFiles(fullPath, files);
      } else if (entry.isFile() && entry.name.endsWith('.d.ts')) {
        files.push(path.relative(apiDir, fullPath));
      }
    }

    return files;
  }

  // 递归查找所有 .ts 文件的函数
  function findTsFiles(dir, files = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        findTsFiles(fullPath, files);
      } else if (entry.isFile() && entry.name.endsWith('.ts')) {
        files.push(path.relative(apiDir, fullPath));
      }
    }

    return files;
  }

  // 查找所有的 .d.ts 文件
  const dtsFiles = findDtsFiles(apiDir);

  console.log(`找到 ${dtsFiles.length} 个 .d.ts 文件`);

  dtsFiles.forEach((file) => {
    const fullPath = path.join(apiDir, file);
    const newPath = fullPath.replace(/\.d\.ts$/, '.type.ts');

    console.log(`重命名: ${file} -> ${file.replace(/\.d\.ts$/, '.type.ts')}`);
    fs.renameSync(fullPath, newPath);
  });

  // 查找所有的 .ts 文件并修复导入语句
  const tsFiles = findTsFiles(apiDir);

  tsFiles.forEach((file) => {
    const fullPath = path.join(apiDir, file);
    let content = fs.readFileSync(fullPath, 'utf8');

    // 替换导入语句中的 .d 引用
    const originalContent = content;
    content = content.replace(
      /from\s+['"`]([^'"`]*?)\.d['"`]/g,
      "from '$1.type'"
    );

    if (content !== originalContent) {
      console.log(`修复导入语句: ${file}`);
      fs.writeFileSync(fullPath, content);
    }
  });

  console.log('.d.ts 文件修复完成');
} catch (error) {
  console.error('修复 .d.ts 文件失败:', error.message);
}

// 6. 为生成的 API 类型文件添加 @ts-nocheck 忽略类型检查
console.log('为 API 类型文件添加 @ts-nocheck...');
try {
  // 查找所有的 .type.ts 文件
  function findTypeFiles(dir, files = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        findTypeFiles(fullPath, files);
      } else if (entry.isFile() && entry.name.endsWith('.type.ts')) {
        files.push(path.relative(apiDir, fullPath));
      }
    }

    return files;
  }

  const typeFiles = findTypeFiles(apiDir);

  console.log(`找到 ${typeFiles.length} 个 .type.ts 文件`);

  typeFiles.forEach((file) => {
    const fullPath = path.join(apiDir, file);
    let content = fs.readFileSync(fullPath, 'utf8');

    // 检查是否已经有 @ts-nocheck 注释
    if (!content.includes('// @ts-nocheck')) {
      // 在文件顶部添加 @ts-nocheck 注释
      content = '/* eslint-disable */\n // @ts-nocheck\n' + content;
      fs.writeFileSync(fullPath, content);
      console.log(`添加 @ts-nocheck: ${file}`);
    }
  });

  console.log('API 类型文件 @ts-nocheck 添加完成');
} catch (error) {
  console.error('添加 @ts-nocheck 失败:', error.message);
}

// 7. 生成 API 入口文件
console.log('生成 API 入口文件...');
try {
  const apiIndexContent = `// SQLE API exports
export * as SQLEService from './sqle';

// DMS API exports  
export * as DMSService from './dms';

// API Client exports (common)
export { default as ApiClient } from './utils/ApiClient';
export { SDKApiClient } from './utils/ApiClient';

// Types
export type { 
  ApiClientConfigOptions 
} from './utils/ApiClient';
`;

  fs.writeFileSync(path.join(apiDir, 'index.ts'), apiIndexContent);
  console.log('API 入口文件生成完成');
} catch (error) {
  console.error('生成 API 入口文件失败:', error.message);
}

// 8. 生成主入口文件
console.log('生成主入口文件...');
try {
  const indexContent = `// API exports
export * from './api';

// Theme exports
export * from './theme/dark-basic';
export * from './theme/light-basic';
export * from './theme/theme.type';

// Data exports
export * from './data';

// Enum exports
export * from './enum';
`;

  fs.writeFileSync(path.join(__dirname, '../src/index.ts'), indexContent);
  console.log('主入口文件生成完成');
} catch (error) {
  console.error('生成主入口文件失败:', error.message);
}

console.log('所有文件生成完成！');
