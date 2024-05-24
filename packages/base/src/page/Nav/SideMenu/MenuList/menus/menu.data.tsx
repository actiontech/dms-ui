import { SystemRole } from '@actiontech/shared/lib/enum';
import { t } from '../../../../../locale';
import { MenuStructTreeType, MenuStructTreeKey } from './index.type';
import { genMenuItemsWithMenuStructTree } from './common';
import baseMenusCollection from './base';
import sqleMenusCollection from './sqle';

export const sideMenuData = (
  projectID: string,
  role: SystemRole | '',
  sqlOptimizationIsSupport: boolean
) => {
  const sqlDevGroup: MenuStructTreeKey[] = [
    'cloud-beaver',
    'data-export',
    'sql-audit',
    'plugin-audit'
  ];

  // 现状: SQL优化页面在CE中会展示预览引导页面 但是在EE中需要根据 sqlOptimizationIsSupport（接口查询返回）权限来决定是否展示 没有任何提示信息 会导致用户无法感知此功能的存在 不太合理
  // todo: 下一期需求周期把此问题给产品抛出 希望解决此问题
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
      group: ['sql-management', 'audit-plane']
    },
    { type: 'divider' },
    {
      type: 'group',
      label: t('dmsMenu.groupLabel.projectConfigure'),
      group: [
        'instance-management',
        'rule-template',
        'whitelist',
        'workflow-template',
        'member'
      ]
    },
    { type: 'divider' },
    {
      type: 'group',
      label: t('dmsMenu.groupLabel.operateAndAudit'),
      group: ['sqle-log']
    }
  ];

  return genMenuItemsWithMenuStructTree(
    projectID,
    [...sqleMenusCollection, ...baseMenusCollection],
    menuStruct,
    role
  );
};
