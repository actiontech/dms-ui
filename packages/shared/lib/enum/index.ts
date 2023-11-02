export enum PackageNameEnum {
  SQLE = 'sqle',
  PROVISION = 'provision',
  DIAGNOSIS = 'diagnosis'
}

export enum SupportLanguage {
  zhCN = 'zh-CN',
  enUS = 'en-US'
}

export enum ResponseCode {
  SUCCESS = 0,

  // sql analyze
  NotSupportDML = 8001
}

export enum SupportTheme {
  DARK = 'dark',
  LIGHT = 'light'
}

export enum SystemRole {
  admin = 'admin'
}

export enum ModalSize {
  big = 1000,
  mid = 800
}

export enum CharCode {
  a = 97,
  z = 122,
  A = 65,
  Z = 90
}

export enum StorageKey {
  Language = 'LANGUAGE',
  Theme = 'THEME',
  Token = 'TOKEN',
  DMS_Project_Catch = 'DMS_Project_Catch',
  USER_UID = 'DMS_USER_UID'
}
