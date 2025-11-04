// 包信息接口
export interface PackageInfo {
  name: string;
  version: string;
  dir: string;
  distDir: string;
  changelogPath: string;
}

// 压缩文件信息接口
export interface ZipFileInfo {
  pkg: PackageInfo;
  zipPath: string;
}

// 包配置接口
export interface PackageConfig {
  dir: string;
  distDir: string;
  changelogPath: string;
}
