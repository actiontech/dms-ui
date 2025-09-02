import baseMenusCollection from './base';
import sqleMenusCollection from './sqle';
import provisionMenusCollection from './provision';
import { dataMaskRuleMenuItem } from './dms';

import { GenerateMenuItemI18nConfig, MenuTreeI18n } from './index.type';

export const DMS_MENU_STRUCT: MenuTreeI18n[] = [
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
    groupLabelKey: 'dmsMenu.groupLabel.dataSecurity',
    groups: [
      'database-role',
      'account-management',
      'password-management',
      'data-mask-rule'
    ]
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
    groupLabelKey: 'dmsMenu.groupLabel.operateAndAudit',
    groups: ['sqle-log']
  }
];

export const DMS_ALL_MENUS: GenerateMenuItemI18nConfig[] = [
  ...baseMenusCollection,
  // #if [sqle]
  ...sqleMenusCollection,
  // #endif

  // #if [provision]
  ...provisionMenusCollection,
  // #endif

  // #if [dms]
  dataMaskRuleMenuItem
  // #endif
];
