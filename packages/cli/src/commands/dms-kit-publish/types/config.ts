// 环境配置接口
export interface EnvironmentConfig {
  pnpm: {
    registry: string;
    auth: string;
  };
  ftpServer: {
    host: string;
    user: string;
    password: string;
  };
  ftpDir: string;
  robotSDK: {
    baseUrl: string;
  };
  githubApi: {
    owner: string;
    repo: string;
    baseUrl: string;
    projectId: number;
    token: string;
  };
  email?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
    from: string;
    to: string[];
  };
}
