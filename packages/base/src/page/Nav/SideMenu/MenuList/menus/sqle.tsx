// @warn/cli/create-dms-page

import { SIDE_MENU_DATA_PLACEHOLDER_KEY } from './common';
import { GenerateMenuItemI18nConfig } from './index.type';
import {
  ManagementFilled,
  WorkflowFilled,
  OverviewOutlined,
  RiseSquareOutlined,
  ResolveFileFilled,
  ExceptionFileOutlined,
  MagnifierFilled,
  ProfileSquareFilled,
  CodeOutlined,
  OperateAuditFilled,
  BriefcaseFilled,
  PlanFilled,
  GearFilled,
  PipelineOutlined,
  FileVersionOutlined,
  ComparisonOutlined
} from '@actiontech/icons';
import { PERMISSIONS } from '@actiontech/shared/lib/features';
import { parse2ReactRouterPath } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const projectOverviewMenuItem: GenerateMenuItemI18nConfig = (projectID) => ({
  label: 'dmsMenu.projectOverview',
  to: parse2ReactRouterPath(ROUTE_PATHS.SQLE.PROJECT_OVERVIEW.index, {
    params: { projectID }
  }),
  icon: <OverviewOutlined width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/overview`,
  structKey: 'project-overview'
});

const sqlAuditMenuItem: GenerateMenuItemI18nConfig = (projectID) => ({
  label: 'dmsMenu.sqlAudit',
  to: parse2ReactRouterPath(ROUTE_PATHS.SQLE.SQL_AUDIT.index, {
    params: { projectID }
  }),
  icon: <MagnifierFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/sql-audit`,
  structKey: 'sql-audit'
});

const pluginAuditMenuItem: GenerateMenuItemI18nConfig = (projectID) => ({
  label: 'dmsMenu.pluginAudit',
  to: parse2ReactRouterPath(ROUTE_PATHS.SQLE.PLUGIN_AUDIT.index, {
    params: { projectID }
  }),
  icon: <CodeOutlined width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/plugin-audit`,
  structKey: 'plugin-audit'
});

const sqlOptimizationMenuItem: GenerateMenuItemI18nConfig = (projectID) => ({
  label: 'dmsMenu.sqlOptimization',
  to: parse2ReactRouterPath(ROUTE_PATHS.SQLE.SQL_OPTIMIZATION.index, {
    params: { projectID }
  }),
  icon: <RiseSquareOutlined width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/sql-optimization`,
  structKey: 'sql-optimization',
  // #if [ee]
  permission: PERMISSIONS.PAGES.SQLE.SQL_OPTIMIZATION
  // #endif
});

const sqlExecWorkflowMenuItem: GenerateMenuItemI18nConfig = (projectID) => ({
  label: 'dmsMenu.sqlWorkflow',
  to: parse2ReactRouterPath(ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.index, {
    params: { projectID }
  }),
  icon: <BriefcaseFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/exec-workflow`,
  structKey: 'exec-workflow'
});

const sqlManagementMenuItem: GenerateMenuItemI18nConfig = (projectID) => ({
  label: 'dmsMenu.sqlManagement',
  to: parse2ReactRouterPath(ROUTE_PATHS.SQLE.SQL_MANAGEMENT.index, {
    params: { projectID }
  }),
  icon: <ManagementFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/sql-management`,
  structKey: 'sql-management'
});

const projectRuleTemplateMenuItem: GenerateMenuItemI18nConfig = (
  projectID
) => ({
  label: 'dmsMenu.ruleTemplate',
  to: parse2ReactRouterPath(ROUTE_PATHS.SQLE.RULE_TEMPLATE.index, {
    params: { projectID }
  }),
  icon: <ProfileSquareFilled width={18} height={18} fill="none" />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/rule/template`,
  structKey: 'rule-template'
});

const whiteListMenuItem: GenerateMenuItemI18nConfig = (projectID) => ({
  label: 'dmsMenu.whitelist',
  to: parse2ReactRouterPath(ROUTE_PATHS.SQLE.WHITELIST.index, {
    params: { projectID }
  }),
  icon: <ResolveFileFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/whitelist`,
  structKey: 'whitelist'
});

const sqlManagementException: GenerateMenuItemI18nConfig = (projectID) => ({
  label: 'dmsMenu.sqlManagementExcept',
  to: parse2ReactRouterPath(ROUTE_PATHS.SQLE.SQL_MANAGEMENT_EXCEPTION.index, {
    params: { projectID }
  }),
  icon: <ExceptionFileOutlined width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/sql-management-exception`,
  structKey: 'sql-management-exception'
});

const workflowTemplateMenuItem: GenerateMenuItemI18nConfig = (projectID) => ({
  label: 'dmsMenu.workflowTemplate',
  to: parse2ReactRouterPath(ROUTE_PATHS.SQLE.PROGRESS.index, {
    params: { projectID }
  }),
  icon: <WorkflowFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/progress`,
  structKey: 'workflow-template'
});

const sqleOperationRecordMenuItem: GenerateMenuItemI18nConfig = (
  projectID
) => ({
  label: 'dmsMenu.SQLEOperateRecord',
  to: parse2ReactRouterPath(ROUTE_PATHS.SQLE.OPERATION_LOG.index, {
    params: { projectID }
  }),
  icon: <OperateAuditFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/operation-record`,
  structKey: 'sqle-log',
  permission: PERMISSIONS.PAGES.SQLE.OPERATION_RECORD
});

const sqlManagementConf: GenerateMenuItemI18nConfig = (projectID) => ({
  label: 'dmsMenu.sqlManagementConf',
  to: parse2ReactRouterPath(ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.index, {
    params: { projectID }
  }),
  icon: <PlanFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/sql-management-conf`,
  structKey: 'sql-management-conf'
});

const pushRuleConfiguration: GenerateMenuItemI18nConfig = (projectID) => ({
  label: 'dmsMenu.pushRuleConfiguration',
  to: parse2ReactRouterPath(ROUTE_PATHS.SQLE.PUSH_RULE.index, {
    params: { projectID }
  }),
  icon: <GearFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/push-rule`,
  structKey: 'push-rule-configuration'
});

const pipelineConfiguration: GenerateMenuItemI18nConfig = (projectID) => ({
  label: 'dmsMenu.pipelineConfiguration',
  to: parse2ReactRouterPath(ROUTE_PATHS.SQLE.PIPELINE_CONFIGURATION.index, {
    params: { projectID }
  }),
  icon: <PipelineOutlined width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/pipeline-configuration`,
  structKey: 'pipeline-configuration'
});

const versionManagement: GenerateMenuItemI18nConfig = (projectID) => ({
  label: 'dmsMenu.versionManagement',
  to: parse2ReactRouterPath(ROUTE_PATHS.SQLE.VERSION_MANAGEMENT.index, {
    params: { projectID }
  }),
  icon: <FileVersionOutlined width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/version-management`,
  structKey: 'version-management'
});

const dataSourceComparison: GenerateMenuItemI18nConfig = (projectID) => ({
  label: 'dmsMenu.dataSourceComparison',
  to: parse2ReactRouterPath(ROUTE_PATHS.SQLE.DATA_SOURCE_COMPARISON.index, {
    params: { projectID }
  }),
  icon: <ComparisonOutlined width={18} height={18} />,
  // todo 后续调整当前选中菜单与 key 绑定的逻辑
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/data-source-comparison`,
  structKey: 'data-source-comparison'
});
const sqlPerformanceInsights: GenerateMenuItemI18nConfig = (projectID) => ({
  label: 'dmsMenu.sqlPerformanceInsights',
  to: parse2ReactRouterPath(ROUTE_PATHS.SQLE.SQL_INSIGHTS.index, {
    params: { projectID: projectID }
  }),
  icon: <RiseSquareOutlined width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/sql-insights`,
  structKey: 'sql-insights'
});

const sqleMenusCollection = [
  projectOverviewMenuItem,
  sqlAuditMenuItem,
  pluginAuditMenuItem,
  sqlOptimizationMenuItem,
  sqlExecWorkflowMenuItem,
  sqlManagementMenuItem,
  projectRuleTemplateMenuItem,
  whiteListMenuItem,
  workflowTemplateMenuItem,
  workflowTemplateMenuItem,
  sqleOperationRecordMenuItem,
  sqlManagementConf,
  pushRuleConfiguration,
  sqlManagementException,
  pipelineConfiguration,
  versionManagement,
  dataSourceComparison,
  sqlPerformanceInsights
];

export default sqleMenusCollection;
