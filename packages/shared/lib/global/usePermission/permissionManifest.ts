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
    fieldName: string;
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
  }
} as const;
