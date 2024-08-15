import { SystemRole } from '@actiontech/shared/lib/enum';
import { t } from '../../../../../locale';
import {
  GenerateMenuItemType,
  MenuStructTreeKey,
  MenuStructTreeType
} from './index.type';
import { genMenuItemsWithMenuStructTree } from './common';
import baseMenusCollection from './base';
import sqleMenusCollection from './sqle';
import provisionMenusCollection from './provision';
import { dataMaskRuleMenuItem } from './dms';

export const dmsSideMenuData = (
  projectID: string,
  role: SystemRole | '',
  sqlOptimizationIsSupport: boolean
) => {
  const allMenuItems: GenerateMenuItemType[] = [
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

  const sqlDevGroup: MenuStructTreeKey[] = [
    'cloud-beaver',
    'data-export',
    'sql-audit',
    'plugin-audit'
  ];

  const menuStruct: MenuStructTreeType = [
    'project-overview',
    'dashboard',
    { type: 'divider' },
    // #if [ce]
    {
      type: 'group',
      label: t('dmsMenu.groupLabel.SQLDev'),
      group: [...sqlDevGroup, 'sql-optimization']
    },
    // #endif
    // #if [ee]
    {
      type: 'group',
      label: t('dmsMenu.groupLabel.SQLDev'),
      group: sqlOptimizationIsSupport
        ? [...sqlDevGroup, 'sql-optimization']
        : sqlDevGroup
    },
    // #endif
    {
      type: 'group',
      label: t('dmsMenu.groupLabel.SQLExecute'),
      group: ['exec-workflow']
    },
    {
      type: 'group',
      label: t('dmsMenu.groupLabel.SQLManagement'),
      group: ['sql-management', 'sql-management-conf']
    },
    { type: 'divider' },
    {
      type: 'group',
      label: t('dmsMenu.groupLabel.dataSecurity'),
      group: [
        'permission-group',
        'account-management',
        'password-management',
        'data-mask-rule'
      ]
    },
    { type: 'divider' },
    {
      type: 'group',
      label: t('dmsMenu.groupLabel.projectConfigure'),
      group: [
        'instance',
        'rule-template',
        'whitelist',
        'workflow-template',
        'member',
        'push-rule-configuration'
      ]
    },
    { type: 'divider' },
    {
      type: 'group',
      label: t('dmsMenu.groupLabel.operateAndAudit'),
      group: ['sqle-log', 'auth-audit', 'template-audit']
    }
  ];

  return genMenuItemsWithMenuStructTree(
    projectID,
    allMenuItems,
    menuStruct,
    role
  );
};
