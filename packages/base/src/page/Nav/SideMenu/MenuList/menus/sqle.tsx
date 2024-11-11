import { SIDE_MENU_DATA_PLACEHOLDER_KEY } from './common';
import { t } from '../../../../../locale';
import { GenerateMenuItemType } from './index.type';
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
import { PERMISSIONS } from '@actiontech/shared/lib/global';
import { TypedLink } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const projectOverviewMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <TypedLink
      to={ROUTE_PATHS.SQLE.PROJECT_OVERVIEW.index}
      params={{ projectID }}
    >
      {t('dmsMenu.projectOverview')}
    </TypedLink>
  ),
  icon: <OverviewOutlined width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/overview`,
  structKey: 'project-overview'
});

const sqlAuditMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <TypedLink to={ROUTE_PATHS.SQLE.SQL_AUDIT.index} params={{ projectID }}>
      {t('dmsMenu.sqlAudit')}
    </TypedLink>
  ),
  icon: <MagnifierFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/sql-audit`,
  structKey: 'sql-audit'
});

const pluginAuditMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <TypedLink to={ROUTE_PATHS.SQLE.PLUGIN_AUDIT.index} params={{ projectID }}>
      {t('dmsMenu.pluginAudit')}
    </TypedLink>
  ),
  icon: <CodeOutlined width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/plugin-audit`,
  structKey: 'plugin-audit'
});

const sqlOptimizationMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <TypedLink
      to={ROUTE_PATHS.SQLE.SQL_OPTIMIZATION.index}
      params={{ projectID }}
    >
      {t('dmsMenu.sqlOptimization')}
    </TypedLink>
  ),
  icon: <RiseSquareOutlined width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/sql-optimization`,
  structKey: 'sql-optimization',
  // #if [ee]
  permission: PERMISSIONS.PAGES.SQLE.SQL_OPTIMIZATION
  // #endif
});

const sqlExecWorkflowMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <TypedLink
      to={ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.index}
      params={{ projectID }}
    >
      {t('dmsMenu.sqlWorkflow')}
    </TypedLink>
  ),
  icon: <BriefcaseFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/exec-workflow`,
  structKey: 'exec-workflow'
});

const sqlManagementMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <TypedLink
      to={ROUTE_PATHS.SQLE.SQL_MANAGEMENT.index}
      params={{ projectID }}
    >
      {t('dmsMenu.sqlManagement')}
    </TypedLink>
  ),
  icon: <ManagementFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/sql-management`,
  structKey: 'sql-management'
});

const projectRuleTemplateMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <TypedLink to={ROUTE_PATHS.SQLE.RULE_TEMPLATE.index} params={{ projectID }}>
      {t('dmsMenu.ruleTemplate')}
    </TypedLink>
  ),
  icon: <ProfileSquareFilled width={18} height={18} fill="none" />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/rule/template`,
  structKey: 'rule-template'
});

const whiteListMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <TypedLink to={ROUTE_PATHS.SQLE.WHITELIST.index} params={{ projectID }}>
      {t('dmsMenu.whitelist')}
    </TypedLink>
  ),
  icon: <ResolveFileFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/whitelist`,
  structKey: 'whitelist'
});

const sqlManagementException: GenerateMenuItemType = (projectID) => ({
  label: (
    <TypedLink
      to={ROUTE_PATHS.SQLE.SQL_MANAGEMENT_EXCEPTION.index}
      params={{ projectID }}
    >
      {t('dmsMenu.sqlManagementExcept')}
    </TypedLink>
  ),
  icon: <ExceptionFileOutlined width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/sql-management-exception`,
  structKey: 'sql-management-exception'
});

const workflowTemplateMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <TypedLink to={ROUTE_PATHS.SQLE.PROGRESS.index} params={{ projectID }}>
      {t('dmsMenu.workflowTemplate')}
    </TypedLink>
  ),
  icon: <WorkflowFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/progress`,
  structKey: 'workflow-template'
});

const sqleOperationRecordMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <TypedLink to={ROUTE_PATHS.SQLE.OPERATION_LOG.index} params={{ projectID }}>
      {t('dmsMenu.SQLEOperateRecord')}
    </TypedLink>
  ),
  icon: <OperateAuditFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/operation-record`,
  structKey: 'sqle-log',
  permission: PERMISSIONS.PAGES.SQLE.OPERATION_RECORD
});

const sqlManagementConf: GenerateMenuItemType = (projectID) => ({
  label: (
    <TypedLink
      to={ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.index}
      params={{ projectID }}
    >
      {t('dmsMenu.sqlManagementConf')}
    </TypedLink>
  ),
  icon: <PlanFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/sql-management-conf`,
  structKey: 'sql-management-conf'
});

const pushRuleConfiguration: GenerateMenuItemType = (projectID) => ({
  label: (
    <TypedLink to={ROUTE_PATHS.SQLE.PUSH_RULE.index} params={{ projectID }}>
      {t('dmsMenu.pushRuleConfiguration')}
    </TypedLink>
  ),
  icon: <GearFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/push-rule`,
  structKey: 'push-rule-configuration'
});

const pipelineConfiguration: GenerateMenuItemType = (projectID) => ({
  label: (
    <TypedLink
      to={ROUTE_PATHS.SQLE.PIPELINE_CONFIGURATION.index}
      params={{ projectID }}
    >
      {t('dmsMenu.pipelineConfiguration')}
    </TypedLink>
  ),
  icon: <PipelineOutlined width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/pipeline-configuration`,
  structKey: 'pipeline-configuration'
});

const versionManagement: GenerateMenuItemType = (projectID) => ({
  label: (
    <TypedLink
      to={ROUTE_PATHS.SQLE.VERSION_MANAGEMENT.index}
      params={{ projectID }}
    >
      {t('dmsMenu.versionManagement')}
    </TypedLink>
  ),
  icon: <FileVersionOutlined width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/version-management`,
  structKey: 'version-management'
});

const dataSourceComparison: GenerateMenuItemType = (projectID) => ({
  label: (
    <TypedLink
      to={ROUTE_PATHS.SQLE.DATA_SOURCE_COMPARISON.index}
      params={{ projectID }}
    >
      {t('dmsMenu.dataSourceComparison')}
    </TypedLink>
  ),
  icon: <ComparisonOutlined width={18} height={18} />,
  // todo 后续调整当前选中菜单与 key 绑定的逻辑
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/data-source-comparison`,
  structKey: 'data-source-comparison'
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
  dataSourceComparison
];

export default sqleMenusCollection;
