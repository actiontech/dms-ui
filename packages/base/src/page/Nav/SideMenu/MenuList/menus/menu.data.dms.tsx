import { SystemRole } from '@actiontech/shared/lib/enum';
import { t } from '../../../../../locale';
import { GenerateMenuItemType, MenuStructTreeType } from './index.type';
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
  sqlOrderMenuItem,
  sqlManagementMenuItem,
  auditPlanMenuItem,
  projectRuleTemplateMenuItem,
  whiteListMenuItem,
  workflowTemplateMenuItem,
  sqleOperationRecordMenuItem
} from './sqle';
import {
  authAuditMenuItem,
  authListMenuItem,
  permissionGroupMenuItem,
  permissionTemplateMenuItem,
  templateAuditMenuItem
} from './provision';
import { dataMaskRuleMenuItem } from './dms';

export const dmsSideMenuData = (projectID: string, role: SystemRole | '') => {
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

    // #if [provision]
    permissionGroupMenuItem,
    permissionTemplateMenuItem,
    authListMenuItem,
    authAuditMenuItem,
    templateAuditMenuItem,
    // #endif

    // #if [dms]
    dataMaskRuleMenuItem
    // #endif
  ];
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
      label: t('dmsMenu.groupLabel.dataSecurity'),
      group: [
        'permission-group',
        'permission-template',
        'auth-list',
        'data-mask-rule'
      ]
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
