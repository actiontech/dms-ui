import { SystemRole } from '@actiontech/shared/lib/enum';
import { t } from '../../../../../locale';
import {
  GenerateMenuItemType,
  MenuStructTreeType,
  MenuStructTreeKey
} from './index.type';
import { genMenuItemsWithMenuStructTree } from './common';
import {
  dbServiceManagementMenuItem,
  memberManagementMenItem,
  cloudBeaverMenuItem,
  dataExportMenuItem
} from './base';
import {
  projectOverviewMenuItem,
  dashboardMenuItem,
  sqlAuditMenuItem,
  pluginAuditMenuItem,
  sqlOptimizationMenuItem,
  sqlOrderMenuItem,
  sqlManagementMenuItem,
  auditPlanMenuItem,
  projectRuleTemplateMenuItem,
  whiteListMenuItem,
  workflowTemplateMenuItem,
  sqleOperationRecordMenuItem
} from './sqle';

export const sideMenuData = (
  projectID: string,
  role: SystemRole | '',
  sqlOptimizationIsSupport: boolean
) => {
  const allMenuItems: GenerateMenuItemType[] = [
    dbServiceManagementMenuItem,
    memberManagementMenItem,
    cloudBeaverMenuItem,
    dataExportMenuItem,

    // #if [sqle]
    projectOverviewMenuItem,
    dashboardMenuItem,
    sqlAuditMenuItem,
    pluginAuditMenuItem,
    sqlOrderMenuItem,
    sqlManagementMenuItem,
    auditPlanMenuItem,
    projectRuleTemplateMenuItem,
    whiteListMenuItem,
    workflowTemplateMenuItem,
    sqleOperationRecordMenuItem,
    // #endif
    sqlOptimizationMenuItem
  ];

  const getSQLDevGroup = (): MenuStructTreeKey[] => {
    const sqlDevGroup: MenuStructTreeKey[] = [
      'cloud-beaver',
      'data-export',
      'sql-audit',
      'plugin-audit'
    ];
    // #if [ce]
    return [...sqlDevGroup, 'sql-optimization'];
    // #endif
    // #if [ee]
    return sqlOptimizationIsSupport
      ? [...sqlDevGroup, 'sql-optimization']
      : sqlDevGroup;
    // #endif
  };

  const menuStruct: MenuStructTreeType = [
    'project-overview',
    'dashboard',
    { type: 'divider' },
    {
      type: 'group',
      label: t('dmsMenu.groupLabel.SQLDev'),
      group: getSQLDevGroup()
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
    {
      type: 'group',
      label: t('dmsMenu.groupLabel.operateAndAudit'),
      group: ['sqle-log']
    }
  ];

  return genMenuItemsWithMenuStructTree(
    projectID,
    allMenuItems,
    menuStruct,
    role
  );
};
