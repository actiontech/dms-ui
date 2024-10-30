import { OpPermissionItemOpPermissionTypeEnum } from '../../api/base/service/common.enum';
import { SystemModuleSupported, SystemRole } from '../../enum';
import { PERMISSIONS, PermissionsConstantType } from './permissions';

export type PermissionDetail = {
  id: PermissionsConstantType;
  type: 'page' | 'action';
  role?: readonly SystemRole[];
  moduleSupport?: readonly SystemModuleSupported[];
  projectManager?: boolean;
  projectArchived?: boolean;
  dbServicePermission?: {
    fieldName?: string;
    opType: OpPermissionItemOpPermissionTypeEnum;
  };
};

export const PERMISSION_MANIFEST: Record<
  PermissionsConstantType,
  PermissionDetail
> = {
  //page
  [PERMISSIONS.PAGES.BASE.USER_CENTER]: {
    id: PERMISSIONS.PAGES.BASE.USER_CENTER,
    type: 'page',
    role: [SystemRole.admin, SystemRole.globalManager, SystemRole.globalViewing]
  },
  [PERMISSIONS.PAGES.BASE.DATA_SOURCE_MANAGEMENT]: {
    id: PERMISSIONS.PAGES.BASE.DATA_SOURCE_MANAGEMENT,
    type: 'page',
    role: [
      SystemRole.admin,
      SystemRole.globalManager,
      SystemRole.globalViewing,
      SystemRole.certainProjectManager
    ]
  },
  [PERMISSIONS.PAGES.BASE.GLOBAL_DATA_SOURCE]: {
    id: PERMISSIONS.PAGES.BASE.GLOBAL_DATA_SOURCE,
    type: 'page',
    role: [
      SystemRole.admin,
      SystemRole.globalManager,
      SystemRole.globalViewing,
      SystemRole.certainProjectManager
    ]
  },
  [PERMISSIONS.PAGES.BASE.SYNC_DATA_SOURCE]: {
    id: PERMISSIONS.PAGES.BASE.SYNC_DATA_SOURCE,
    type: 'page',
    role: [SystemRole.admin, SystemRole.globalManager, SystemRole.globalViewing]
  },
  [PERMISSIONS.PAGES.SQLE.REPORT_STATISTICS]: {
    id: PERMISSIONS.PAGES.SQLE.REPORT_STATISTICS,
    type: 'page',
    role: [SystemRole.admin, SystemRole.globalManager, SystemRole.globalViewing]
  },
  [PERMISSIONS.PAGES.SQLE.RULE_MANAGEMENT]: {
    id: PERMISSIONS.PAGES.SQLE.RULE_MANAGEMENT,
    type: 'page',
    role: [SystemRole.admin, SystemRole.globalManager, SystemRole.globalViewing]
  },
  [PERMISSIONS.PAGES.BASE.SYSTEM_SETTING]: {
    id: PERMISSIONS.PAGES.BASE.SYSTEM_SETTING,
    type: 'page',
    role: [SystemRole.admin, SystemRole.globalManager, SystemRole.globalViewing]
  },
  [PERMISSIONS.PAGES.SQLE.OPERATION_RECORD]: {
    id: PERMISSIONS.PAGES.SQLE.OPERATION_RECORD,
    type: 'page',
    role: [SystemRole.admin, SystemRole.globalManager, SystemRole.globalViewing]
  },
  [PERMISSIONS.PAGES.SQLE.SQL_OPTIMIZATION]: {
    id: PERMISSIONS.PAGES.SQLE.SQL_OPTIMIZATION,
    type: 'page',
    moduleSupport: [SystemModuleSupported.sqlOptimization]
  },
  // action

  //cloud beaver
  [PERMISSIONS.ACTIONS.BASE.CLOUD_BEAVER.EXPORT]: {
    id: PERMISSIONS.ACTIONS.BASE.CLOUD_BEAVER.EXPORT,
    type: 'action'
  },
  [PERMISSIONS.ACTIONS.BASE.CLOUD_BEAVER.CREATE_WHITE_LIST]: {
    id: PERMISSIONS.ACTIONS.BASE.CLOUD_BEAVER.CREATE_WHITE_LIST,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true,
    projectArchived: false
  },

  //数据源
  [PERMISSIONS.ACTIONS.BASE.DB_SERVICE.ADD]: {
    id: PERMISSIONS.ACTIONS.BASE.DB_SERVICE.ADD,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true,
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.BASE.DB_SERVICE.BATCH_IMPORT]: {
    id: PERMISSIONS.ACTIONS.BASE.DB_SERVICE.BATCH_IMPORT,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true,
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.BASE.DB_SERVICE.CREATE_AUDIT_PLAN]: {
    id: PERMISSIONS.ACTIONS.BASE.DB_SERVICE.CREATE_AUDIT_PLAN,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true,
    projectArchived: false,
    dbServicePermission: {
      fieldName: 'uid',
      opType: OpPermissionItemOpPermissionTypeEnum.save_audit_plan
    }
  },
  [PERMISSIONS.ACTIONS.BASE.DB_SERVICE.EDIT]: {
    id: PERMISSIONS.ACTIONS.BASE.DB_SERVICE.EDIT,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true,
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.BASE.DB_SERVICE.DELETE]: {
    id: PERMISSIONS.ACTIONS.BASE.DB_SERVICE.DELETE,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true,
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.BASE.DB_SERVICE.TEST]: {
    id: PERMISSIONS.ACTIONS.BASE.DB_SERVICE.TEST,
    type: 'action',
    projectArchived: true
  },
  [PERMISSIONS.ACTIONS.BASE.DB_SERVICE.TEST_IN_MORE_BUTTON]: {
    id: PERMISSIONS.ACTIONS.BASE.DB_SERVICE.TEST_IN_MORE_BUTTON,
    type: 'action',
    projectArchived: false
  },

  //用户中心
  [PERMISSIONS.ACTIONS.BASE.USER_CENTER.USER.ADD]: {
    id: PERMISSIONS.ACTIONS.BASE.USER_CENTER.USER.ADD,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },
  [PERMISSIONS.ACTIONS.BASE.USER_CENTER.USER.EDIT]: {
    id: PERMISSIONS.ACTIONS.BASE.USER_CENTER.USER.EDIT,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },
  [PERMISSIONS.ACTIONS.BASE.USER_CENTER.USER.DELETE]: {
    id: PERMISSIONS.ACTIONS.BASE.USER_CENTER.USER.DELETE,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },
  [PERMISSIONS.ACTIONS.BASE.USER_CENTER.ROLE.ADD]: {
    id: PERMISSIONS.ACTIONS.BASE.USER_CENTER.ROLE.ADD,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },
  [PERMISSIONS.ACTIONS.BASE.USER_CENTER.ROLE.EDIT]: {
    id: PERMISSIONS.ACTIONS.BASE.USER_CENTER.ROLE.EDIT,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },
  [PERMISSIONS.ACTIONS.BASE.USER_CENTER.ROLE.DELETE]: {
    id: PERMISSIONS.ACTIONS.BASE.USER_CENTER.ROLE.DELETE,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },

  //全局数据源
  [PERMISSIONS.ACTIONS.BASE.GLOBAL_DATA_SOURCE.ADD]: {
    id: PERMISSIONS.ACTIONS.BASE.GLOBAL_DATA_SOURCE.ADD,
    type: 'action',
    role: [
      SystemRole.admin,
      SystemRole.globalManager,
      SystemRole.certainProjectManager
    ]
  },
  [PERMISSIONS.ACTIONS.BASE.GLOBAL_DATA_SOURCE.BATCH_IMPORT]: {
    id: PERMISSIONS.ACTIONS.BASE.GLOBAL_DATA_SOURCE.BATCH_IMPORT,
    type: 'action',
    role: [
      SystemRole.admin,
      SystemRole.globalManager,
      SystemRole.certainProjectManager
    ]
  },
  [PERMISSIONS.ACTIONS.BASE.GLOBAL_DATA_SOURCE.DELETE]: {
    id: PERMISSIONS.ACTIONS.BASE.GLOBAL_DATA_SOURCE.DELETE,
    type: 'action',
    role: [
      SystemRole.admin,
      SystemRole.globalManager,
      SystemRole.certainProjectManager
    ]
  },
  [PERMISSIONS.ACTIONS.BASE.GLOBAL_DATA_SOURCE.EDIT]: {
    id: PERMISSIONS.ACTIONS.BASE.GLOBAL_DATA_SOURCE.EDIT,
    type: 'action',
    role: [
      SystemRole.admin,
      SystemRole.globalManager,
      SystemRole.certainProjectManager
    ]
  },
  [PERMISSIONS.ACTIONS.BASE.GLOBAL_DATA_SOURCE.TEST_IN_MORE_BUTTON]: {
    id: PERMISSIONS.ACTIONS.BASE.GLOBAL_DATA_SOURCE.TEST_IN_MORE_BUTTON,
    type: 'action'
  },

  // 同步外部数据源
  [PERMISSIONS.ACTIONS.BASE.SYNC_DATA_SOURCE.ADD]: {
    id: PERMISSIONS.ACTIONS.BASE.GLOBAL_DATA_SOURCE.ADD,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },
  [PERMISSIONS.ACTIONS.BASE.SYNC_DATA_SOURCE.DELETE]: {
    id: PERMISSIONS.ACTIONS.BASE.SYNC_DATA_SOURCE.DELETE,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },
  [PERMISSIONS.ACTIONS.BASE.SYNC_DATA_SOURCE.SYNC]: {
    id: PERMISSIONS.ACTIONS.BASE.SYNC_DATA_SOURCE.SYNC,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },
  [PERMISSIONS.ACTIONS.BASE.SYNC_DATA_SOURCE.EDIT]: {
    id: PERMISSIONS.ACTIONS.BASE.SYNC_DATA_SOURCE.EDIT,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },

  //全局规则模板
  [PERMISSIONS.ACTIONS.SQLE.GLOBAL_RULE_TEMPLATE.IMPORT]: {
    id: PERMISSIONS.ACTIONS.SQLE.GLOBAL_RULE_TEMPLATE.IMPORT,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },
  [PERMISSIONS.ACTIONS.SQLE.GLOBAL_RULE_TEMPLATE.CREATE]: {
    id: PERMISSIONS.ACTIONS.SQLE.GLOBAL_RULE_TEMPLATE.CREATE,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },
  [PERMISSIONS.ACTIONS.SQLE.GLOBAL_RULE_TEMPLATE.EDIT]: {
    id: PERMISSIONS.ACTIONS.SQLE.GLOBAL_RULE_TEMPLATE.EDIT,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },
  [PERMISSIONS.ACTIONS.SQLE.GLOBAL_RULE_TEMPLATE.DELETE]: {
    id: PERMISSIONS.ACTIONS.SQLE.GLOBAL_RULE_TEMPLATE.DELETE,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },
  [PERMISSIONS.ACTIONS.SQLE.GLOBAL_RULE_TEMPLATE.CLONE]: {
    id: PERMISSIONS.ACTIONS.SQLE.GLOBAL_RULE_TEMPLATE.CLONE,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },
  [PERMISSIONS.ACTIONS.SQLE.GLOBAL_RULE_TEMPLATE.EXPORT]: {
    id: PERMISSIONS.ACTIONS.SQLE.GLOBAL_RULE_TEMPLATE.EXPORT,
    type: 'action'
  },

  //自定义规则
  [PERMISSIONS.ACTIONS.SQLE.CUSTOM_RULE.EDIT]: {
    id: PERMISSIONS.ACTIONS.SQLE.CUSTOM_RULE.EDIT,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },
  [PERMISSIONS.ACTIONS.SQLE.CUSTOM_RULE.CREATE]: {
    id: PERMISSIONS.ACTIONS.SQLE.CUSTOM_RULE.CREATE,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },
  [PERMISSIONS.ACTIONS.SQLE.CUSTOM_RULE.DELETE]: {
    id: PERMISSIONS.ACTIONS.SQLE.CUSTOM_RULE.DELETE,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },

  //系统设置
  [PERMISSIONS.ACTIONS.BASE.SYSTEM.PUSH_NOTIFICATION.ENABLE_SMTP]: {
    id: PERMISSIONS.ACTIONS.BASE.SYSTEM.PUSH_NOTIFICATION.ENABLE_SMTP,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },
  [PERMISSIONS.ACTIONS.BASE.SYSTEM.PUSH_NOTIFICATION.ENABLE_WECHAT]: {
    id: PERMISSIONS.ACTIONS.BASE.SYSTEM.PUSH_NOTIFICATION.ENABLE_WECHAT,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },
  [PERMISSIONS.ACTIONS.BASE.SYSTEM.PUSH_NOTIFICATION.ENABLE_LARK]: {
    id: PERMISSIONS.ACTIONS.BASE.SYSTEM.PUSH_NOTIFICATION.ENABLE_LARK,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },
  [PERMISSIONS.ACTIONS.BASE.SYSTEM.PUSH_NOTIFICATION.ENABLE_WEBHOOKS]: {
    id: PERMISSIONS.ACTIONS.BASE.SYSTEM.PUSH_NOTIFICATION.ENABLE_WEBHOOKS,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },
  [PERMISSIONS.ACTIONS.BASE.SYSTEM.PROCESS_CONNECTION.ENABLE_DING_TALK]: {
    id: PERMISSIONS.ACTIONS.BASE.SYSTEM.PROCESS_CONNECTION.ENABLE_DING_TALK,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },
  [PERMISSIONS.ACTIONS.BASE.SYSTEM.PROCESS_CONNECTION.ENABLE_LARK_AUDIT]: {
    id: PERMISSIONS.ACTIONS.BASE.SYSTEM.PROCESS_CONNECTION.ENABLE_LARK_AUDIT,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },
  [PERMISSIONS.ACTIONS.BASE.SYSTEM.PROCESS_CONNECTION.ENABLE_WECHAT_AUDIT]: {
    id: PERMISSIONS.ACTIONS.BASE.SYSTEM.PROCESS_CONNECTION.ENABLE_WECHAT_AUDIT,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },
  [PERMISSIONS.ACTIONS.BASE.SYSTEM.LOGIN_CONNECTION.ENABLE_LDAP]: {
    id: PERMISSIONS.ACTIONS.BASE.SYSTEM.LOGIN_CONNECTION.ENABLE_LDAP,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },
  [PERMISSIONS.ACTIONS.BASE.SYSTEM.LOGIN_CONNECTION.ENABLE_OAUTH2]: {
    id: PERMISSIONS.ACTIONS.BASE.SYSTEM.LOGIN_CONNECTION.ENABLE_OAUTH2,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },
  [PERMISSIONS.ACTIONS.BASE.SYSTEM.GLOBAL_SETTING.OPERATION_LOG_EXPIRED_HOURS]:
    {
      id: PERMISSIONS.ACTIONS.BASE.SYSTEM.GLOBAL_SETTING
        .OPERATION_LOG_EXPIRED_HOURS,
      type: 'action',
      role: [SystemRole.admin, SystemRole.globalManager]
    },
  [PERMISSIONS.ACTIONS.BASE.SYSTEM.GLOBAL_SETTING
    .CB_OPERATION_LOG_EXPIRED_HOURS]: {
    id: PERMISSIONS.ACTIONS.BASE.SYSTEM.GLOBAL_SETTING
      .CB_OPERATION_LOG_EXPIRED_HOURS,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },
  [PERMISSIONS.ACTIONS.BASE.SYSTEM.GLOBAL_SETTING.URL_ADDRESS_PREFIX]: {
    id: PERMISSIONS.ACTIONS.BASE.SYSTEM.GLOBAL_SETTING.URL_ADDRESS_PREFIX,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },
  [PERMISSIONS.ACTIONS.BASE.SYSTEM.LICENSE.COLLECT_LICENSE]: {
    id: PERMISSIONS.ACTIONS.BASE.SYSTEM.LICENSE.COLLECT_LICENSE,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },
  [PERMISSIONS.ACTIONS.BASE.SYSTEM.LICENSE.IMPORT_LICENSE]: {
    id: PERMISSIONS.ACTIONS.BASE.SYSTEM.LICENSE.IMPORT_LICENSE,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },
  [PERMISSIONS.ACTIONS.BASE.SYSTEM.PERSONALIZE_SETTING.PERSONALIZE_TITLE]: {
    id: PERMISSIONS.ACTIONS.BASE.SYSTEM.PERSONALIZE_SETTING.PERSONALIZE_TITLE,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },
  [PERMISSIONS.ACTIONS.BASE.SYSTEM.PERSONALIZE_SETTING.PERSONALIZE_LOGO]: {
    id: PERMISSIONS.ACTIONS.BASE.SYSTEM.PERSONALIZE_SETTING.PERSONALIZE_LOGO,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },

  // SQL 工单
  [PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.CREATE]: {
    id: PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.CREATE,
    type: 'action',
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.EXPORT]: {
    id: PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.EXPORT,
    type: 'action'
  },
  [PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.CLOSE]: {
    id: PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.CLOSE,
    type: 'action',
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.CLONE]: {
    id: PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.CLONE,
    type: 'action',
    projectArchived: false,
    role: [SystemRole.admin, SystemRole.globalManager],
    dbServicePermission: {
      opType: OpPermissionItemOpPermissionTypeEnum.create_workflow
    }
  },
  [PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.BATCH_REJECT]: {
    id: PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.BATCH_REJECT,
    type: 'action',
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.APPROVE]: {
    id: PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.APPROVE,
    type: 'action',
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.BATCH_EXEC]: {
    id: PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.BATCH_EXEC,
    type: 'action',
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.MANUALLY_EXEC]: {
    id: PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.MANUALLY_EXEC,
    type: 'action',
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.TERMINATE_EXEC]: {
    id: PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.TERMINATE_EXEC,
    type: 'action',
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.TERMINATE_EXEC_TASK]: {
    id: PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.TERMINATE_EXEC_TASK,
    type: 'action',
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.EXEC_TASK]: {
    id: PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.EXEC_TASK,
    type: 'action',
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.SCHEDULE_TIME_EXEC_TASK]: {
    id: PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.SCHEDULE_TIME_EXEC_TASK,
    type: 'action',
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.CANCEL_SCHEDULE_TIME_EXEC_TASK]: {
    id: PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW
      .CANCEL_SCHEDULE_TIME_EXEC_TASK,
    type: 'action',
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.CREATE_WHITE_LIST]: {
    id: PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.CREATE_WHITE_LIST,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true,
    projectArchived: false
  },

  // SQL 管控
  [PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.ASSIGNMENT]: {
    id: PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.ASSIGNMENT,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true,
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.UPDATE_STATUS]: {
    id: PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.UPDATE_STATUS,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true,
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.UPDATE_PRIORITY]: {
    id: PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.UPDATE_PRIORITY,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true,
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.CREATE_SQL_EXCEPTION]: {
    id: PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.CREATE_SQL_EXCEPTION,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true,
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.CREATE_WHITE_LIST]: {
    id: PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.CREATE_WHITE_LIST,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true,
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.BATCH_ASSIGNMENT]: {
    id: PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.BATCH_ASSIGNMENT,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true,
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.BATCH_RESOLVE]: {
    id: PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.BATCH_RESOLVE,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true,
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.BATCH_IGNORE]: {
    id: PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.BATCH_IGNORE,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true,
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.ACTION_LAYOUT]: {
    id: PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.ACTION_LAYOUT,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true,
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.EDIT_REMARK]: {
    id: PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.ACTION_LAYOUT,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true,
    projectArchived: false
  },

  // SQL 管控例外
  [PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT_EXCEPTION.CREATE]: {
    id: PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT_EXCEPTION.CREATE,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true,
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT_EXCEPTION.EDIT]: {
    id: PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT_EXCEPTION.EDIT,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true,
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT_EXCEPTION.DELETE]: {
    id: PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT_EXCEPTION.DELETE,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true,
    projectArchived: false
  },

  //审核SQL例外
  [PERMISSIONS.ACTIONS.SQLE.WHITE_LIST.CREATE]: {
    id: PERMISSIONS.ACTIONS.SQLE.WHITE_LIST.CREATE,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true,
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.SQLE.WHITE_LIST.EDIT]: {
    id: PERMISSIONS.ACTIONS.SQLE.WHITE_LIST.EDIT,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true,
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.SQLE.WHITE_LIST.DELETE]: {
    id: PERMISSIONS.ACTIONS.SQLE.WHITE_LIST.DELETE,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true,
    projectArchived: false
  },

  // 审批流程模板
  [PERMISSIONS.ACTIONS.SQLE.WORKFLOW_TEMPLATE.UPDATE]: {
    id: PERMISSIONS.ACTIONS.SQLE.WORKFLOW_TEMPLATE.UPDATE,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true,
    projectArchived: false
  },

  // 审核规则模板
  [PERMISSIONS.ACTIONS.SQLE.PROJECT_RULE_TEMPLATE.CREATE]: {
    id: PERMISSIONS.ACTIONS.SQLE.PROJECT_RULE_TEMPLATE.CREATE,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true,
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.SQLE.PROJECT_RULE_TEMPLATE.IMPORT]: {
    id: PERMISSIONS.ACTIONS.SQLE.PROJECT_RULE_TEMPLATE.IMPORT,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true,
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.SQLE.PROJECT_RULE_TEMPLATE.EDIT]: {
    id: PERMISSIONS.ACTIONS.SQLE.PROJECT_RULE_TEMPLATE.EDIT,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true,
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.SQLE.PROJECT_RULE_TEMPLATE.DELETE]: {
    id: PERMISSIONS.ACTIONS.SQLE.PROJECT_RULE_TEMPLATE.DELETE,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true,
    projectArchived: false
  },
  [PERMISSIONS.ACTIONS.SQLE.PROJECT_RULE_TEMPLATE.CLONE]: {
    id: PERMISSIONS.ACTIONS.SQLE.PROJECT_RULE_TEMPLATE.CLONE,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true
  },
  [PERMISSIONS.ACTIONS.SQLE.PROJECT_RULE_TEMPLATE.EXPORT]: {
    id: PERMISSIONS.ACTIONS.SQLE.PROJECT_RULE_TEMPLATE.EXPORT,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true
  },

  // 知识库
  [PERMISSIONS.ACTIONS.SQLE.RULE_KNOWLEDGE.EDIT]: {
    id: PERMISSIONS.ACTIONS.SQLE.RULE_KNOWLEDGE.EDIT,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager]
  },

  // 推送规则配置
  [PERMISSIONS.ACTIONS.SQLE.PUSH_RULE_CONFIGURATION
    .WORKFLOW_MODIFICATION_NOTIFIER_SWITCHER_SWITCH]: {
    id: PERMISSIONS.ACTIONS.SQLE.PUSH_RULE_CONFIGURATION
      .WORKFLOW_MODIFICATION_NOTIFIER_SWITCHER_SWITCH,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true
  },
  [PERMISSIONS.ACTIONS.SQLE.PUSH_RULE_CONFIGURATION
    .SQL_MANAGEMENT_ISSUE_PUSH_SWITCH]: {
    id: PERMISSIONS.ACTIONS.SQLE.PUSH_RULE_CONFIGURATION
      .SQL_MANAGEMENT_ISSUE_PUSH_SWITCH,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true
  },

  // 查看规则
  [PERMISSIONS.ACTIONS.SQLE.RULE.CREATE_RULE_TEMPLATE]: {
    id: PERMISSIONS.ACTIONS.SQLE.RULE.CREATE_RULE_TEMPLATE,
    type: 'action',
    role: [SystemRole.admin, SystemRole.globalManager],
    projectManager: true,
    projectArchived: false
  }
} as const;
