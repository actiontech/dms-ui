import { SystemModuleSupported, SystemRole } from '../../enum';
import { PERMISSIONS, PermissionsConstantType } from './permissions';

type PermissionDetail = {
  id: PermissionsConstantType;
  name?: string;
  description?: string;
  type: 'page' | 'action';
  role?: readonly SystemRole[];
  featureSupport?: readonly SystemModuleSupported[];
};

export const PERMISSION_MANIFEST: Record<
  PermissionsConstantType,
  PermissionDetail
> = {
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
    featureSupport: [SystemModuleSupported.sqlOptimization]
  }
} as const;
