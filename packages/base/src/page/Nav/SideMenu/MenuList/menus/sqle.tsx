import { Link } from 'react-router-dom';
import { SIDE_MENU_DATA_PLACEHOLDER_KEY } from './common';
import { t } from '../../../../../locale';
import { SystemRole } from '@actiontech/shared/lib/enum';
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
  FileVersionOutlined
} from '@actiontech/icons';

const projectOverviewMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/overview`}>
      {t('dmsMenu.projectOverview')}
    </Link>
  ),
  icon: <OverviewOutlined width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/overview`,
  structKey: 'project-overview'
});

const sqlAuditMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/sql-audit`}>
      {t('dmsMenu.sqlAudit')}
    </Link>
  ),
  icon: <MagnifierFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/sql-audit`,
  structKey: 'sql-audit'
});

const pluginAuditMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/plugin-audit`}>
      {t('dmsMenu.pluginAudit')}
    </Link>
  ),
  icon: <CodeOutlined width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/plugin-audit`,
  structKey: 'plugin-audit'
});

const sqlOptimizationMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/sql-optimization`}>
      {t('dmsMenu.sqlOptimization')}
    </Link>
  ),
  icon: <RiseSquareOutlined width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/sql-optimization`,
  structKey: 'sql-optimization'
});

const sqlExecWorkflowMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/exec-workflow`}>
      {t('dmsMenu.sqlWorkflow')}
    </Link>
  ),
  icon: <BriefcaseFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/exec-workflow`,
  structKey: 'exec-workflow'
});

const sqlManagementMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/sql-management`}>
      {t('dmsMenu.sqlManagement')}
    </Link>
  ),
  icon: <ManagementFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/sql-management`,
  structKey: 'sql-management'
});

const projectRuleTemplateMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/rule/template`}>
      {t('dmsMenu.ruleTemplate')}
    </Link>
  ),
  icon: <ProfileSquareFilled width={18} height={18} fill="none" />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/rule/template`,
  structKey: 'rule-template'
});

const whiteListMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/whitelist`}>
      {t('dmsMenu.whitelist')}
    </Link>
  ),
  icon: <ResolveFileFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/whitelist`,
  structKey: 'whitelist'
});

const sqlManagementException: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/sql-management-exception`}>
      {t('dmsMenu.sqlManagementExcept')}
    </Link>
  ),
  icon: <ExceptionFileOutlined width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/sql-management-exception`,
  structKey: 'sql-management-exception'
});

const workflowTemplateMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/progress`}>
      {t('dmsMenu.workflowTemplate')}
    </Link>
  ),
  icon: <WorkflowFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/progress`,
  structKey: 'workflow-template'
});

const sqleOperationRecordMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/operation-record`}>
      {t('dmsMenu.SQLEOperateRecord')}
    </Link>
  ),
  icon: <OperateAuditFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/operation-record`,
  structKey: 'sqle-log',
  role: [SystemRole.admin, SystemRole.globalViewing]
});

const sqlManagementConf: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/sql-management-conf`}>
      {t('dmsMenu.sqlManagementConf')}
    </Link>
  ),
  icon: <PlanFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/sql-management-conf`,
  structKey: 'sql-management-conf'
});

const pushRuleConfiguration: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/push-rule`}>
      {t('dmsMenu.pushRuleConfiguration')}
    </Link>
  ),
  icon: <GearFilled width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/push-rule`,
  structKey: 'push-rule-configuration'
});

const pipelineConfiguration: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/pipeline-configuration`}>
      {t('dmsMenu.pipelineConfiguration')}
    </Link>
  ),
  icon: <PipelineOutlined width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/pipeline-configuration`,
  structKey: 'pipeline-configuration'
});

const versionManagement: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/sqle/project/${projectID}/version-management`}>
      {t('dmsMenu.versionManagement')}
    </Link>
  ),
  icon: <FileVersionOutlined width={18} height={18} />,
  key: `sqle/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/version-management`,
  structKey: 'version-management'
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
  versionManagement
];

export default sqleMenusCollection;
