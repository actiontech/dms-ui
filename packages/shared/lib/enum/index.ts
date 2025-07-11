export enum PackageNameEnum {
  SQLE = 'sqle'
}

export enum SupportLanguage {
  zhCN = 'zh-CN',
  enUS = 'en-US'
}

export enum ResponseCode {
  SUCCESS = 0,

  // sql analyze
  NotSupportDML = 8001,

  // version management
  BatchTaskNotFullyCompleted = 8005,

  // availability zone
  CurrentAvailabilityZoneError = 7007
}

export enum SupportTheme {
  DARK = 'dark',
  LIGHT = 'light'
}

export enum SystemRole {
  admin = 'admin',
  certainProjectManager = 'certainProjectManager',
  auditAdministrator = 'auditAdministrator',
  systemAdministrator = 'systemAdministrator',
  projectDirector = 'projectDirector'
}

export type UserRolesType = {
  [key in SystemRole]: boolean;
};

export enum SystemModuleSupported {
  sqlOptimization = 'sqlOptimization',
  knowledge = 'knowledge'
}

export type ModuleFeatureSupportStatus = {
  [key in SystemModuleSupported]: boolean;
};

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
  USER_UID = 'DMS_USER_UID',
  SHOW_COMPANY_NOTICE = 'SHOW_COMPANY_NOTICE',
  DMS_CB_CHANNEL = 'DMS_CB_CHANNEL',
  DMS_AVAILABILITY_ZONE = 'DMS_AVAILABILITY_ZONE'
}

/**
 * 后端暂时无法在swagger中暴露OpPermissionType的映射，但权限对应的uid一般不会变化，因此前端先保存一份。
 */
export enum OpPermissionTypeUid {
  'project_director' = '700001', // 项目总监；创建项目的用户自动拥有该项目管理权限 700001
  'project_admin' = '700002', // 项目管理；拥有该权限的用户可以管理项目下的所有资源 700002
  'create_workflow' = '700003', // 创建/编辑工单；拥有该权限的用户可以创建/编辑工单 700003
  'audit_workflow' = '700004', // 审核/驳回工单；拥有该权限的用户可以审核/驳回工单 700004
  'auth_db_service_data' = '700005', // 授权数据源数据权限；拥有该权限的用户可以授权数据源数据权限 700005
  'execute_workflow' = '700006', // 上线工单；拥有该权限的用户可以上线工单 700006
  'view_others_workflow' = '700007', // 查看其他工单权限 700007
  'view_other_audit_plan' = '700008', // 查看其他扫描任务权限 700008
  'save_audit_plan' = '700009', // 创建扫描任务权限；拥有该权限的用户可以创建/更新扫描任务 700009
  'sql_query' = '700010', //SQL查询；SQL查询权限 700010
  'audit_administrator' = '700016', // 审计管理员
  'system_administrator' = '700017' // 系统管理员
}

export enum CompanyNoticeDisplayStatusEnum {
  Displayed = '1',
  NotDisplayed = '0'
}

export enum MIMETypeEnum {
  'Application_Json' = 'application/json'
}

export type ResponseBlobJsonType = {
  code: number;
  message: string;
};
