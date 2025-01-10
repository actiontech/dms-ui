// @warn/cli/create-dms-page
import { GenerateMenuItemI18nConfig, MenuTreeI18n } from './index.type';
import { PERMISSIONS } from '@actiontech/shared/lib/global';
import sqleMenusCollection from './sqle';
import baseMenusCollection from './base';

export const SQLE_MENU_STRUCT: MenuTreeI18n[] = [
  'project-overview',
  { type: 'divider' },
  {
    type: 'group',
    groupLabelKey: 'dmsMenu.groupLabel.SQLDev',
    groups: [
      'cloud-beaver',
      'data-export',
      'sql-audit',
      'plugin-audit',
      'sql-optimization',
      'data-source-comparison'
    ]
  },
  {
    type: 'group',
    groupLabelKey: 'dmsMenu.groupLabel.SQLExecute',
    groups: ['exec-workflow', 'version-management']
  },
  {
    type: 'group',
    groupLabelKey: 'dmsMenu.groupLabel.CICDIntegration',
    groups: ['pipeline-configuration']
  },
  {
    type: 'group',
    groupLabelKey: 'dmsMenu.groupLabel.SQLManagement',
    groups: ['sql-management', 'sql-management-conf']
  },
  { type: 'divider' },
  {
    type: 'group',
    groupLabelKey: 'dmsMenu.groupLabel.projectConfigure',
    groups: [
      'instance',
      'rule-template',
      'workflow-template',
      'member',
      'push-rule-configuration',
      'whitelist',
      'sql-management-exception'
    ]
  },
  { type: 'divider' },
  {
    type: 'group',
    permission: PERMISSIONS.PAGES.SQLE.OPERATION_RECORD,
    groupLabelKey: 'dmsMenu.groupLabel.operateAndAudit',
    groups: ['sqle-log']
  }
];

export const SQLE_ALL_MENUS: GenerateMenuItemI18nConfig[] = [
  ...sqleMenusCollection,
  ...baseMenusCollection
];
