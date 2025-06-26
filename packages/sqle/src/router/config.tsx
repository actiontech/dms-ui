// @warn/cli/create-dms-page

import React from 'react';
import { Navigate } from 'react-router-dom';
import { RouterConfigItem } from '@actiontech/shared/lib/types/common.type';
import { PERMISSIONS } from '@actiontech/shared/lib/features';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const Home = React.lazy(
  () => import(/* webpackChunkName: "Home" */ '../page/Home')
);

const RuleTemplate = React.lazy(
  () => import(/* webpackChunkName: "RuleTemplate" */ '../page/RuleTemplate')
);

const Whitelist = React.lazy(
  () => import(/* webpackChunkName: "Whitelist" */ '../page/Whitelist')
);

const SqlManagementException = React.lazy(
  () =>
    import(
      /* webpackChunkName: "SqlManagementException" */ '../page/SqlManagementException'
    )
);

const ProjectOverview = React.lazy(
  () =>
    import(/* webpackChunkName: "ProjectOverview" */ '../page/ProjectOverview')
);

const OperationRecord = React.lazy(
  () =>
    import(/* webpackChunkName: "OperationRecord" */ '../page/OperationRecord')
);

const ImportRuleTemplate = React.lazy(
  () =>
    import(
      /* webpackChunkName: "ImportRuleTemplate" */ '../page/RuleTemplate/ImportRuleTemplate'
    )
);

const RuleTemplateList = React.lazy(
  () =>
    import(
      /* webpackChunkName: "RuleTemplateList" */ '../page/RuleTemplate/RuleTemplateList'
    )
);

const RuleTemplateDetail = React.lazy(
  () =>
    import(
      /* webpackChunkName: "RuleTemplateDetail" */ '../page/RuleTemplate/RuleTemplateDetail'
    )
);

const CreateRuleTemplate = React.lazy(
  () =>
    import(
      /* webpackChunkName: "CreateRuleTemplate" */ '../page/RuleTemplate/CreateRuleTemplate'
    )
);

const UpdateRuleTemplate = React.lazy(
  () =>
    import(
      /* webpackChunkName: "UpdateRuleTemplate" */ '../page/RuleTemplate/UpdateRuleTemplate'
    )
);

const WorkflowTemplateDetail = React.lazy(
  () =>
    import(
      /* webpackChunkName: "WorkflowTemplateDetail" */ '../page/WorkflowTemplate/WorkflowTemplateDetail'
    )
);
const SqlManagement = React.lazy(
  () => import(/* webpackChunkName: "SqlManagement" */ '../page/SqlManagement')
);

const SqlAudit = React.lazy(() => import('../page/SqlAudit/List'));

const PluginAudit = React.lazy(() => import('../page/PluginAudit'));

const SqlOptimization = React.lazy(() => import('../page/SqlOptimization'));

const SqlOptimizationList = React.lazy(
  () => import('../page/SqlOptimization/List')
);

const SqlOptimizationCreate = React.lazy(
  () => import('../page/SqlOptimization/Create')
);

const SqlOptimizationOverview = React.lazy(
  () => import('../page/SqlOptimization/Overview')
);

const SqlOptimizationDetail = React.lazy(
  () => import('../page/SqlOptimization/Detail')
);

const SqlAuditCreate = React.lazy(() => import('../page/SqlAudit/Create'));

const SqlAuditDetail = React.lazy(() => import('../page/SqlAudit/Detail'));

const WorkflowSqlAnalyze = React.lazy(
  () => import('../page/SqlAnalyze/Workflow')
);

const Knowledge = React.lazy(() => import('../page/Knowledge/index'));

// #if [ee]
const RuleKnowledge = React.lazy(() => import('../page/RuleKnowledge'));

const KnowledgeRefineResults = React.lazy(
  () => import('../page/Knowledge/RefineResults')
);

const SqlManagementAnalyze = React.lazy(
  () => import('../page/SqlAnalyze/SqlManage')
);

const UpdateWorkflowTemplate = React.lazy(
  () =>
    import(
      /* webpackChunkName: "UpdateWorkflowTemplate" */ '../page/WorkflowTemplate/UpdateWorkflowTemplate'
    )
);
const VersionManagementCreation = React.lazy(
  () => import('../page/VersionManagement/Create')
);

const VersionManagementUpdate = React.lazy(
  () => import('../page/VersionManagement/Update')
);

const VersionManagementDetail = React.lazy(
  () => import('../page/VersionManagement/Detail')
);

// #endif

//workflow
const SqlExecWorkflowList = React.lazy(
  () => import('../page/SqlExecWorkflow/List')
);
const CreateSqlExecWorkflow = React.lazy(
  () => import('../page/SqlExecWorkflow/Create')
);
const SqlWorkflowDetail = React.lazy(
  () => import('../page/SqlExecWorkflow/Detail')
);

const WorkflowSqlFileStatementOverview = React.lazy(
  () =>
    import(
      '../page/SqlExecWorkflow/Detail/components/AuditExecResultPanel/TaskResultList/SqlFileStatementOverview'
    )
);

// sql management configuration
const SqlManagementConfList = React.lazy(
  () => import('../page/SqlManagementConf/List')
);
const CreateSqlManagementConf = React.lazy(
  () => import('../page/SqlManagementConf/Create')
);
const UpdateSqlManagementConf = React.lazy(
  () => import('../page/SqlManagementConf/Update')
);
const SqlManagementConfDetail = React.lazy(
  () => import('../page/SqlManagementConf/Detail')
);
const SqlManagementConfAnalyze = React.lazy(
  () => import('../page/SqlAnalyze/ManagementConf')
);

//data source comparison
const DataSourceComparison = React.lazy(
  () => import('../page/DataSourceComparison')
);

//sqle global page
const Rule = React.lazy(() => import('../page/Rule'));
const RuleManager = React.lazy(() => import('../page/RuleManager'));
const GlobalRuleTemplateDetail = React.lazy(
  () => import('../page/GlobalRuleTemplate/RuleTemplateDetail')
);
const GlobalImportRuleTemplate = React.lazy(
  () => import('../page/GlobalRuleTemplate/ImportRuleTemplate')
);
const GlobalUpdateRuleTemplate = React.lazy(
  () => import('../page/GlobalRuleTemplate/UpdateRuleTemplate')
);
const GlobalCreateRuleTemplate = React.lazy(
  () => import('../page/GlobalRuleTemplate/CreateRuleTemplate')
);
const CreateCustomRule = React.lazy(
  () => import('../page/CustomRule/CreateCustomRule')
);
const UpdateCustomRule = React.lazy(
  () => import('../page/CustomRule/UpdateCustomRule')
);
const ReportStatistics = React.lazy(() => import('../page/ReportStatistics'));

const PushRuleConfiguration = React.lazy(
  () => import('../page/PushRuleConfiguration')
);

const PipelineConfigurationList = React.lazy(
  () => import('../page/PipelineConfiguration/List')
);

const PipelineConfigurationCreation = React.lazy(
  () => import('../page/PipelineConfiguration/Create')
);

const PipelineConfigurationUpdate = React.lazy(
  () => import('../page/PipelineConfiguration/Update')
);

const VersionManagement = React.lazy(() => import('../page/VersionManagement'));

const GlobalDashboard = React.lazy(() => import('../page/GlobalDashboard'));

export const projectDetailRouterConfig: RouterConfigItem[] = [
  {
    key: 'projectOverview',
    path: ROUTE_PATHS.SQLE.PROJECT_OVERVIEW.index.path,
    element: <ProjectOverview />
  },
  {
    key: 'sqlExecWorkflow',
    path: ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.index.path,
    children: [
      {
        index: true,
        element: <SqlExecWorkflowList />,
        key: 'sqlExecWorkflowList'
      },
      {
        path: ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.create.path,
        element: <CreateSqlExecWorkflow />,
        key: 'createSqlExecWorkflow'
      },
      {
        path: ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.analyze.path,
        element: <WorkflowSqlAnalyze />,
        key: 'workflowAnalyze'
      },
      {
        path: ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.detail.path,
        element: <SqlWorkflowDetail />,
        key: 'workflowDetail'
      },
      {
        path: ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.sql_files_overview.path,
        element: <WorkflowSqlFileStatementOverview />,
        key: 'workflowSqlFileStatementOverview'
      }
    ]
  },
  {
    path: ROUTE_PATHS.SQLE.SQL_AUDIT.index.path,
    key: 'sqlAudit',
    children: [
      {
        index: true,
        element: <SqlAudit />,
        key: 'sqlAuditList'
      },
      {
        path: ROUTE_PATHS.SQLE.SQL_AUDIT.create.path,
        element: <SqlAuditCreate />,
        key: 'sqlAuditCreate'
      },
      {
        path: ROUTE_PATHS.SQLE.SQL_AUDIT.detail.path,
        element: <SqlAuditDetail />,
        key: 'sqlAuditDetail'
      }
    ]
  },
  {
    path: ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.index.path,
    key: 'sqlManagementConf',
    children: [
      {
        index: true,
        element: <SqlManagementConfList />,
        key: 'SqlManagementConfList'
      },
      {
        element: <CreateSqlManagementConf />,
        key: 'CreateSqlManagementConf',
        path: ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.create.path
      },
      {
        element: <UpdateSqlManagementConf />,
        key: 'UpdateSqlManagementConf',
        path: ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.update.path
      },
      {
        element: <SqlManagementConfDetail />,
        key: 'SqlManagementConfDetail',
        path: ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.detail.path
      },
      {
        element: <SqlManagementConfAnalyze />,
        key: 'SqlManagementConfAnalyze',
        path: ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.analyze.path
      }
    ]
  },
  {
    path: ROUTE_PATHS.SQLE.SQL_MANAGEMENT.index.path,
    key: 'sqlManagement',
    children: [
      {
        index: true,
        element: <SqlManagement />,
        key: 'SqlManagement'
      },
      // #if [ee]
      {
        path: ROUTE_PATHS.SQLE.SQL_MANAGEMENT.analyze.path,
        element: <SqlManagementAnalyze />,
        key: 'SqlManagementAnalyze'
      }
      // #endif
    ]
  },
  {
    path: ROUTE_PATHS.SQLE.PROJECT_DASHBOARD.index.path,
    element: <Home />,
    key: 'dashboard'
  },
  {
    path: ROUTE_PATHS.SQLE.RULE_TEMPLATE.index.path,
    key: 'ruleTemplate',
    element: <RuleTemplate />,
    permission: PERMISSIONS.PAGES.SQLE.PROJECT_RULE_TEMPLATE,
    children: [
      {
        index: true,
        element: <RuleTemplateList />,
        key: 'ruleTemplate'
      },
      {
        path: 'list',
        element: <RuleTemplateList />,
        key: 'ruleTemplate'
      },
      {
        path: ROUTE_PATHS.SQLE.RULE_TEMPLATE.create.path,
        element: <CreateRuleTemplate />,
        key: 'ruleTemplateCreate'
      },
      {
        path: ROUTE_PATHS.SQLE.RULE_TEMPLATE.import.path,
        element: <ImportRuleTemplate />,
        key: 'ruleTemplateImport'
      },
      {
        path: ROUTE_PATHS.SQLE.RULE_TEMPLATE.detail.path,
        element: <RuleTemplateDetail />,
        key: 'ruleTemplateDetail'
      },
      {
        path: ROUTE_PATHS.SQLE.RULE_TEMPLATE.update.path,
        element: <UpdateRuleTemplate />,
        key: 'ruleTemplateUpdate'
      }
    ]
  },
  {
    path: ROUTE_PATHS.SQLE.PROGRESS.index.path,
    key: 'progress',
    permission: PERMISSIONS.PAGES.SQLE.WORKFLOW_TEMPLATE,
    children: [
      {
        index: true,
        element: <WorkflowTemplateDetail />,
        key: 'progressDetail'
      },
      // #if [ee]
      {
        path: ROUTE_PATHS.SQLE.PROGRESS.update.path,
        element: <UpdateWorkflowTemplate />,
        key: 'progressUpdate'
      }
      // #endif
    ]
  },
  {
    path: ROUTE_PATHS.SQLE.WHITELIST.index.path,
    key: 'Whitelist',
    element: <Whitelist />,
    permission: PERMISSIONS.PAGES.SQLE.WHITE_LIST
  },
  {
    path: ROUTE_PATHS.SQLE.SQL_MANAGEMENT_EXCEPTION.index.path,
    key: 'sqlManagementException',
    element: <SqlManagementException />,
    permission: PERMISSIONS.PAGES.SQLE.SQL_MANAGEMENT_EXCEPTION
  },
  {
    path: ROUTE_PATHS.SQLE.OPERATION_LOG.index.path,
    key: 'operationRecord',
    element: <OperationRecord />,
    permission: PERMISSIONS.PAGES.SQLE.OPERATION_RECORD
  },
  {
    path: ROUTE_PATHS.SQLE.PLUGIN_AUDIT.index.path,
    key: 'pluginAudit',
    children: [
      {
        index: true,
        element: <PluginAudit />,
        key: 'pluginAuditList'
      }
    ]
  },
  {
    path: ROUTE_PATHS.SQLE.SQL_OPTIMIZATION.index.path,
    key: 'sqlOptimization',
    element: <SqlOptimization />,
    // #if [ee]
    permission: PERMISSIONS.PAGES.SQLE.SQL_OPTIMIZATION,
    children: [
      {
        index: true,
        element: <SqlOptimizationList />,
        key: 'sqlOptimizationList'
      },
      {
        path: ROUTE_PATHS.SQLE.SQL_OPTIMIZATION.create.path,
        element: <SqlOptimizationCreate />,
        key: 'sqlOptimizationCreate'
      },
      {
        path: ROUTE_PATHS.SQLE.SQL_OPTIMIZATION.overview.path,
        element: <SqlOptimizationOverview />,
        key: 'sqlOptimizationOverview'
      },
      {
        path: ROUTE_PATHS.SQLE.SQL_OPTIMIZATION.detail.path,
        element: <SqlOptimizationDetail />,
        key: 'sqlOptimizationDetail'
      }
    ]
    // #endif
  },
  {
    path: ROUTE_PATHS.SQLE.PUSH_RULE.index.path,
    key: 'pushRuleConfiguration',
    element: <PushRuleConfiguration />,
    permission: PERMISSIONS.PAGES.SQLE.PUSH_RULE_CONFIGURATION
  },
  {
    path: ROUTE_PATHS.SQLE.PIPELINE_CONFIGURATION.index.path,
    key: 'pipelineConfiguration',
    children: [
      {
        index: true,
        element: <PipelineConfigurationList />,
        key: 'pipelineConfigurationList'
      },
      {
        path: ROUTE_PATHS.SQLE.PIPELINE_CONFIGURATION.create.path,
        element: <PipelineConfigurationCreation />,
        key: 'sqlOptimizationCreate'
      },
      {
        path: ROUTE_PATHS.SQLE.PIPELINE_CONFIGURATION.update.path,
        element: <PipelineConfigurationUpdate />,
        key: 'sqlOptimizationCreate'
      }
    ]
  },
  {
    path: ROUTE_PATHS.SQLE.VERSION_MANAGEMENT.index.path,
    key: 'versionManagement',
    children: [
      {
        index: true,
        element: <VersionManagement />,
        key: 'VersionManagementList'
      },
      // #if [ee]
      {
        path: ROUTE_PATHS.SQLE.VERSION_MANAGEMENT.create.path,
        element: <VersionManagementCreation />,
        key: 'versionManagementCreation'
      },
      {
        path: ROUTE_PATHS.SQLE.VERSION_MANAGEMENT.update.path,
        element: <VersionManagementUpdate />,
        key: 'versionManagementCreation'
      },
      {
        path: ROUTE_PATHS.SQLE.VERSION_MANAGEMENT.detail.path,
        element: <VersionManagementDetail />,
        key: 'versionManagementDetail'
      }
      // #endif
    ]
  },
  {
    path: ROUTE_PATHS.SQLE.DATA_SOURCE_COMPARISON.index.path,
    key: 'dataSourceComparison',
    element: <DataSourceComparison />
  },
  {
    path: '*',
    key: 'projectRedirect',
    element: <Navigate to={ROUTE_PATHS.BASE.HOME} />
  }
];

export const globalRouterConfig: RouterConfigItem[] = [
  {
    path: ROUTE_PATHS.SQLE.REPORT_STATISTICS,
    element: <ReportStatistics />,
    key: 'reportStatistics',
    permission: PERMISSIONS.PAGES.SQLE.REPORT_STATISTICS
  },
  {
    path: ROUTE_PATHS.SQLE.RULE.index.path,
    element: <Rule />,
    key: 'rule'
  },
  {
    path: `${ROUTE_PATHS.SQLE.RULE_MANAGEMENT.detail.prefix}/${ROUTE_PATHS.SQLE.RULE_MANAGEMENT.detail.path}`,
    key: 'globalRuleTemplateDetail',
    element: <GlobalRuleTemplateDetail />
  },
  {
    key: 'ruleManager',
    permission: PERMISSIONS.PAGES.SQLE.RULE_MANAGEMENT,
    path: ROUTE_PATHS.SQLE.RULE_MANAGEMENT.index.path,
    children: [
      {
        index: true,
        key: 'ruleTemplateManagement',
        element: <RuleManager />
      },
      {
        path: ROUTE_PATHS.SQLE.RULE_MANAGEMENT.create.path,
        key: 'globalRuleTemplateCreate',
        element: <GlobalCreateRuleTemplate />
      },
      {
        path: ROUTE_PATHS.SQLE.RULE_MANAGEMENT.import.path,
        key: 'globalRuleTemplateImport',
        element: <GlobalImportRuleTemplate />
      },
      {
        path: ROUTE_PATHS.SQLE.RULE_MANAGEMENT.update.path,
        key: 'globalRuleTemplateUpdate',
        element: <GlobalUpdateRuleTemplate />
      },
      {
        path: ROUTE_PATHS.SQLE.CUSTOM_RULE.create.path,
        key: 'createCustomRule',
        element: <CreateCustomRule />
      },
      {
        path: ROUTE_PATHS.SQLE.CUSTOM_RULE.update.path,
        key: 'updateCustomRule',
        element: <UpdateCustomRule />
      }
    ]
  },
  {
    path: ROUTE_PATHS.SQLE.KNOWLEDGE.index.path,
    key: 'knowledge',
    // #if [ee]
    permission: PERMISSIONS.PAGES.SQLE.KNOWLEDGE,
    // #endif
    children: [
      {
        index: true,
        key: 'knowledgeIndex',
        element: <Knowledge />
      },
      // #if [ee]
      {
        path: ROUTE_PATHS.SQLE.KNOWLEDGE.refined.path,
        key: 'knowledgeRefinedResults',
        element: <KnowledgeRefineResults />
      }
      // #endif
    ]
  },
  // #if [ee]
  {
    path: ROUTE_PATHS.SQLE.RULE_KNOWLEDGE.index.path,
    key: 'ruleKnowledge',
    element: <RuleKnowledge />
  },
  // #endif
  {
    path: ROUTE_PATHS.SQLE.GLOBAL_DASHBOARD,
    key: 'globalDashboard',
    element: <GlobalDashboard />
  }
];
