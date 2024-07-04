import { Link } from 'react-router-dom';
import { SIDE_MENU_DATA_PLACEHOLDER_KEY } from './common';
import { t } from '../../../../../locale';
import { SystemRole } from '@actiontech/shared/lib/enum';
import { GenerateMenuItemType } from './index.type';
import {
  ManagementFilled,
  RingOutlined,
  WorkflowFilled,
  MenuFilled,
  PlanFilled,
  OverviewOutlined,
  RiseSquareOutlined,
  ResolveFileFilled,
  MagnifierFilled,
  ProfileSquareFilled,
  CodeOutlined,
  OperateAuditFilled,
  BriefcaseFilled
} from '@actiontech/icons';

export const projectOverviewMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/overview`}>
      {t('dmsMenu.projectOverview')}
    </Link>
  ),
  icon: <OverviewOutlined width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/overview`,
  structKey: 'project-overview'
});

export const dashboardMenuItem: GenerateMenuItemType = (projectID) => ({
  className: 'menu-todo-list-item',
  label: (
    <>
      <Link to={`/sqle/project/${projectID}/dashboard`}>
        {t('dmsMenu.todoList')}
      </Link>
      <RingOutlined width={14} height={14} />
    </>
  ),
  icon: <MenuFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/dashboard`,
  structKey: 'dashboard'
});

export const sqlAuditMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/sql-audit`}>
      {t('dmsMenu.sqlAudit')}
    </Link>
  ),
  icon: <MagnifierFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/sql-audit`,
  structKey: 'sql-audit'
});

export const pluginAuditMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/plugin-audit`}>
      {t('dmsMenu.pluginAudit')}
    </Link>
  ),
  icon: <CodeOutlined width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/plugin-audit`,
  structKey: 'plugin-audit'
});

export const sqlOptimizationMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/sql-optimization`}>
      {t('dmsMenu.sqlOptimization')}
    </Link>
  ),
  icon: <RiseSquareOutlined width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/sql-optimization`,
  structKey: 'sql-optimization'
});

export const sqlExecWorkflowMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/exec-workflow`}>
      {t('dmsMenu.sqlWorkflow')}
    </Link>
  ),
  icon: <BriefcaseFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/exec-workflow`,
  structKey: 'exec-workflow'
});

export const sqlManagementMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/sql-management`}>
      {t('dmsMenu.sqlManagement')}
    </Link>
  ),
  icon: <ManagementFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/sql-management`,
  structKey: 'sql-management'
});

export const auditPlanMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/audit-plan`}>
      {t('dmsMenu.auditPlan')}
    </Link>
  ),
  icon: <PlanFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/audit-plan`,
  structKey: 'audit-plane'
});

export const projectRuleTemplateMenuItem: GenerateMenuItemType = (
  projectID
) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/rule/template`}>
      {t('dmsMenu.ruleTemplate')}
    </Link>
  ),
  icon: <ProfileSquareFilled width={18} height={18} fill="none" />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/rule/template`,
  structKey: 'rule-template'
});

export const whiteListMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/whitelist`}>
      {t('dmsMenu.whitelist')}
    </Link>
  ),
  icon: <ResolveFileFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/whitelist`,
  structKey: 'whitelist'
});

export const workflowTemplateMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/progress`}>
      {t('dmsMenu.workflowTemplate')}
    </Link>
  ),
  icon: <WorkflowFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/progress`,
  structKey: 'workflow-template'
});

export const sqleOperationRecordMenuItem: GenerateMenuItemType = (
  projectID
) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/operation-record`}>
      {t('dmsMenu.SQLEOperateRecord')}
    </Link>
  ),
  icon: <OperateAuditFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/operation-record`,
  structKey: 'sqle-log',
  role: [SystemRole.admin]
});

export const sqlManagementConf: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/sql-management-conf`}>
      {t('dmsMenu.sqlManagementConf')}
    </Link>
  ),
  icon: <Icon component={IconWhitelist} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/sql-management-conf`,
  structKey: 'sql-management-conf'
});

const sqleMenusCollection = [
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
  workflowTemplateMenuItem,
  sqleOperationRecordMenuItem,
  sqlManagementConf
];

export default sqleMenusCollection;
