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
    sqlOptimizationMenuItem
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
