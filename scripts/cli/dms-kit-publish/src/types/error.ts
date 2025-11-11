// 错误代码枚举
export enum ErrorCode {
  ENV_VAR_MISSING = 'ENV_VAR_MISSING',
  PKG_LOAD_FAILED = 'PKG_LOAD_FAILED',
  VERSION_INVALID = 'VERSION_INVALID',
  CHANGELOG_MISSING = 'CHANGELOG_MISSING',
  NPM_PUBLISH_FAILED = 'NPM_PUBLISH_FAILED',
  DOCS_BUILD_FAILED = 'DOCS_BUILD_FAILED',
  FTP_UPLOAD_FAILED = 'FTP_UPLOAD_FAILED',
  TAG_PUSH_FAILED = 'TAG_PUSH_FAILED',
  NOTIFICATION_FAILED = 'NOTIFICATION_FAILED'
}

// 部署错误类
export class DeployError extends Error {
  constructor(public code: ErrorCode, message: string, public details?: any) {
    super(message);
    this.name = 'DeployError';
  }
}
