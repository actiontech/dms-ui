import { SystemRole } from '@actiontech/shared/lib/enum';
import { t } from '../../../../../../locale';
import {
  dbServiceManagementMenuItem,
  memberManagementMenItem,
  cloudBeaverMenuItem,
  dataExportMenuItem
} from '../base';
import { genMenuItemsWithMenuStructTree } from '../common';
import { MenuStructTreeType } from '../index.type';
import {
  projectOverviewMenuItem,
  dashboardMenuItem,
  sqlAuditMenuItem,
  pluginAuditMenuItem,
  sqlOptimizationMenuItem,
  sqlExecWorkflowMenuItem,
  sqlManagementMenuItem,
  auditPlanMenuItem,
  projectRuleTemplateMenuItem,
  whiteListMenuItem,
  workflowTemplateMenuItem,
  sqleOperationRecordMenuItem
} from '../sqle';

const menuStruct: MenuStructTreeType = [
  'project-overview',
  'dashboard',
  { type: 'divider' },
  {
    type: 'group',
    label: t('dmsMenu.groupLabel.SQLDev'),
    group: [
      'cloud-beaver',
      'data-export',
      'sql-audit',
      'plugin-audit',
      'sql-optimization'
    ]
  },
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

describe('test genMenuItemsWithMenuStructTree', () => {
  it('should match snapshot', () => {
    expect(
      genMenuItemsWithMenuStructTree('600300', [], [], '')
    ).toMatchSnapshot();
    expect(
      genMenuItemsWithMenuStructTree(
        '600300',
        [
          dbServiceManagementMenuItem,
          memberManagementMenItem,
          cloudBeaverMenuItem,
          dataExportMenuItem
        ],
        [],
        ''
      )
    ).toMatchSnapshot();

    expect(
      genMenuItemsWithMenuStructTree(
        '600300',
        [
          dbServiceManagementMenuItem,
          memberManagementMenItem,
          cloudBeaverMenuItem,
          dataExportMenuItem
        ],
        [],
        ''
      )
    ).toMatchSnapshot();

    expect(
      genMenuItemsWithMenuStructTree(
        '600300',
        [
          dbServiceManagementMenuItem,
          memberManagementMenItem,
          cloudBeaverMenuItem,
          dataExportMenuItem
        ],
        menuStruct,
        ''
      )
    ).toMatchSnapshot();

    expect(
      genMenuItemsWithMenuStructTree(
        '600300',
        [
          dbServiceManagementMenuItem,
          memberManagementMenItem,
          cloudBeaverMenuItem,
          dataExportMenuItem
        ],
        menuStruct,
        SystemRole.admin
      )
    ).toMatchSnapshot();

    expect(
      genMenuItemsWithMenuStructTree(
        '600300',
        [
          dbServiceManagementMenuItem,
          memberManagementMenItem,
          cloudBeaverMenuItem,
          dataExportMenuItem,
          projectOverviewMenuItem,
          dashboardMenuItem,
          sqlAuditMenuItem,
          pluginAuditMenuItem,
          sqlOptimizationMenuItem,
          sqlExecWorkflowMenuItem,
          sqlManagementMenuItem,
          auditPlanMenuItem,
          projectRuleTemplateMenuItem,
          whiteListMenuItem,
          workflowTemplateMenuItem,
          sqleOperationRecordMenuItem
        ],
        menuStruct,
        ''
      )
    ).toMatchSnapshot();

    expect(
      genMenuItemsWithMenuStructTree(
        '600300',
        [
          dbServiceManagementMenuItem,
          memberManagementMenItem,
          cloudBeaverMenuItem,
          dataExportMenuItem,
          projectOverviewMenuItem,
          dashboardMenuItem,
          sqlAuditMenuItem,
          pluginAuditMenuItem,
          sqlOptimizationMenuItem,
          sqlExecWorkflowMenuItem,
          sqlManagementMenuItem,
          auditPlanMenuItem,
          projectRuleTemplateMenuItem,
          whiteListMenuItem,
          workflowTemplateMenuItem,
          sqleOperationRecordMenuItem
        ],
        menuStruct,
        SystemRole.admin
      )
    ).toMatchSnapshot();
  });
});
