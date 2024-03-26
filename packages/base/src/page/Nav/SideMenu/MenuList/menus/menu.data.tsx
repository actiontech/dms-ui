import { SystemRole } from '@actiontech/shared/lib/enum';
import { t } from '../../../../../locale';
import { MenuStructTreeType } from './index.type';
import { genMenuItemsWithMenuStructTree } from './common';

export const sideMenuData = (projectID: string, role: SystemRole | '') => {
  const menuStruct: MenuStructTreeType = [
    'project-overview',
    'dashboard',
    { type: 'divider' },
    {
      type: 'group',
      label: t('dmsMenu.groupLabel.SQLDev'),
      group: ['cloud-beaver', 'data-export', 'sql-audit', 'plugin-audit']
    },
    {
      type: 'group',
      label: t('dmsMenu.groupLabel.SQLExecute'),
      group: ['sql-order']
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
    'sqle-log'
  ];

  return genMenuItemsWithMenuStructTree(projectID, menuStruct, role);
};
