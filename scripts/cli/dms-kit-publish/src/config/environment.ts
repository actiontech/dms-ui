import type { EnvironmentConfig } from '../types/index';
import { errorLog, infoLog } from '../utils/logger';
import 'dotenv/config';

// 获取当前环境
export const ENV = process.env.DEPLOY_ENV || 'production';

// 解析命令行参数
const args = process.argv.slice(2);
export const RETRY_DEPLOY_TRIGGER = args.includes('--retry-deploy-trigger');

// 环境配置定义
const environments: Record<string, EnvironmentConfig> = {
  development: {
    pnpm: {
      registry: process.env.NPM_REGISTRY || 'http://localhost:4873/',
      auth: process.env.NPM_AUTH || ''
    },
    ftpServer: {
      host: process.env.FTP_HOST || 'localhost',
      user: process.env.FTP_USER || '',
      password: process.env.FTP_PASSWORD || ''
    },
    ftpDir: process.env.FTP_DIR || '/home/ftpadmin/actiontech-dms-ui/docs',
    robotSDK: {
      baseUrl: process.env.ROBOT_SDK_BASE_URL || 'http://localhost:3535'
    },
    githubApi: {
      owner: process.env.GITHUB_OWNER || 'actiontech',
      repo: process.env.GITHUB_REPO || 'dms-ui',
      baseUrl: process.env.GITHUB_API_BASE_URL || 'https://api.github.com',
      projectId: parseInt(process.env.GITHUB_PROJECT_ID || '706476902'),
      token: process.env.GITHUB_TOKEN || ''
    },
    email: process.env.EMAIL_HOST
      ? {
          host: process.env.EMAIL_HOST,
          port: parseInt(process.env.EMAIL_PORT || '587'),
          secure: process.env.EMAIL_SECURE === 'true',
          auth: {
            user: process.env.EMAIL_USER || '',
            pass: process.env.EMAIL_PASS || ''
          },
          from: process.env.EMAIL_FROM || '',
          to: (process.env.EMAIL_TO || '').split(',').filter(Boolean)
        }
      : undefined
  },
  production: {
    pnpm: {
      registry: process.env.NPM_REGISTRY || 'http://10.186.18.19:4873/',
      auth: process.env.NPM_AUTH || ''
    },
    ftpServer: {
      host: process.env.FTP_HOST || '10.186.18.90',
      user: process.env.FTP_USER || '',
      password: process.env.FTP_PASSWORD || ''
    },
    ftpDir: process.env.FTP_DIR || '/actiontech-dms-ui/docs',
    robotSDK: {
      baseUrl: process.env.ROBOT_SDK_BASE_URL || 'http://10.186.18.19:8000'
    },
    githubApi: {
      owner: process.env.GITHUB_OWNER || 'actiontech',
      repo: process.env.GITHUB_REPO || 'dms-ui',
      baseUrl: process.env.GITHUB_API_BASE_URL || 'https://api.github.com',
      projectId: parseInt(process.env.GITHUB_PROJECT_ID || '706476902'),
      token: process.env.GITHUB_TOKEN || ''
    },
    email: process.env.EMAIL_HOST
      ? {
          host: process.env.EMAIL_HOST,
          port: parseInt(process.env.EMAIL_PORT || '587'),
          secure: process.env.EMAIL_SECURE === 'true',
          auth: {
            user: process.env.EMAIL_USER || '',
            pass: process.env.EMAIL_PASS || ''
          },
          from: process.env.EMAIL_FROM || '',
          to: (process.env.EMAIL_TO || '').split(',').filter(Boolean)
        }
      : undefined
  }
};

// 验证环境并获取配置
if (!environments[ENV]) {
  errorLog(`不支持的环境: ${ENV}`);
  errorLog(`支持的环境: ${Object.keys(environments).join(', ')}`);
  process.exit(1);
}

// 导出当前环境配置
export const config = environments[ENV];

// 输出当前环境信息
infoLog(`\n当前部署环境: ${ENV}\n`);
