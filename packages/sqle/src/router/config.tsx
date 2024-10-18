import React from 'react';
import { Navigate } from 'react-router-dom';
import { SystemRole } from '../data/common';
import { PROJECT_ROUTER_PARAM } from '@actiontech/shared/lib/data/common';
import { RouterConfigItem } from '@actiontech/shared/lib/types/common.type';
import { ROUTE_PATH_COLLECTION } from '@actiontech/shared/lib/data/routePathCollection';

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

// #if [ee]
const RuleKnowledge = React.lazy(() => import('../page/RuleKnowledge'));

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
    path: `${PROJECT_ROUTER_PARAM}/overview`,
    element: <ProjectOverview />
  },
  {
    key: 'sqlExecWorkflow',
    path: `${PROJECT_ROUTER_PARAM}/exec-workflow`,
    children: [
      {
        index: true,
        element: <SqlExecWorkflowList />,
        key: 'sqlExecWorkflowList'
      },
      {
        path: 'create',
        element: <CreateSqlExecWorkflow />,
        key: 'createSqlExecWorkflow'
      },
      {
        path: ':taskId/:sqlNum/analyze',
        element: <WorkflowSqlAnalyze />,
        key: 'workflowAnalyze'
      },
      {
        path: ':workflowId',
        element: <SqlWorkflowDetail />,
        key: 'workflowDetail'
      },
      {
        path: ':taskId/files/:fileId/sqls',
        element: <WorkflowSqlFileStatementOverview />,
        key: 'workflowSqlFileStatementOverview'
      }
    ]
  },
  {
    path: `${PROJECT_ROUTER_PARAM}/sql-audit`,
    key: 'sqlAudit',
    children: [
      {
        index: true,
        element: <SqlAudit />,
        key: 'sqlAuditList'
      },
      {
        path: 'create',
        element: <SqlAuditCreate />,
        key: 'sqlAuditCreate'
      },
      {
        path: 'detail/:sql_audit_record_id',
        element: <SqlAuditDetail />,
        key: 'sqlAuditDetail'
      }
    ]
  },
  {
    path: `${PROJECT_ROUTER_PARAM}/sql-management-conf`,
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
        path: 'create'
      },
      {
        element: <UpdateSqlManagementConf />,
        key: 'UpdateSqlManagementConf',
        path: 'update/:id'
      },
      {
        element: <SqlManagementConfDetail />,
        key: 'SqlManagementConfDetail',
        path: ':id'
      },
      {
        element: <SqlManagementConfAnalyze />,
        key: 'SqlManagementConfAnalyze',
        path: ':instanceAuditPlanId/analyze/:id'
      }
    ]
  },
  {
    path: `${PROJECT_ROUTER_PARAM}/sql-management`,
    key: 'sqlManagement',
    children: [
      {
        index: true,
        element: <SqlManagement />,
        key: 'SqlManagement'
      },
      // #if [ee]
      {
        path: ':sqlManageId/analyze',
        hideInSliderMenu: true,
        element: <SqlManagementAnalyze />,
        key: 'SqlManagementAnalyze'
      }
      // #endif
    ]
  },
  {
    path: `${PROJECT_ROUTER_PARAM}/dashboard`,
    element: <Home />,
    key: 'dashboard'
  },
  {
    path: `${PROJECT_ROUTER_PARAM}/rule/template`,
    key: 'ruleTemplate',
    element: <RuleTemplate />,
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
        path: 'create',
        element: <CreateRuleTemplate />,
        key: 'ruleTemplateCreate'
      },
      {
        path: 'import',
        element: <ImportRuleTemplate />,
        key: 'ruleTemplateImport'
      },
      {
        path: 'detail/:templateName/:dbType',
        element: <RuleTemplateDetail />,
        key: 'ruleTemplateDetail'
      },
      {
        path: 'update/:templateName',
        element: <UpdateRuleTemplate />,
        key: 'ruleTemplateUpdate'
      }
    ]
  },
  {
    path: `${PROJECT_ROUTER_PARAM}/progress`,
    key: 'progress',
    children: [
      {
        index: true,
        element: <WorkflowTemplateDetail />,
        key: 'progressDetail'
      },
      // #if [ee]
      {
        path: 'update/:workflowName',
        element: <UpdateWorkflowTemplate />,
        key: 'progressUpdate'
      }
      // #endif
    ]
  },
  {
    path: `${PROJECT_ROUTER_PARAM}/whitelist`,
    key: 'Whitelist',
    element: <Whitelist />
  },
  {
    path: `${PROJECT_ROUTER_PARAM}/sql-management-exception`,
    key: 'sqlManagementException',
    element: <SqlManagementException />
  },
  {
    path: `${PROJECT_ROUTER_PARAM}/operation-record`,
    key: 'operationRecord',
    element: <OperationRecord />,
    role: [SystemRole.admin, SystemRole.globalViewing]
  },
  {
    path: `${PROJECT_ROUTER_PARAM}/plugin-audit`,
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
    path: `${PROJECT_ROUTER_PARAM}/sql-optimization`,
    key: 'sqlOptimization',
    element: <SqlOptimization />,
    // #if [ee]
    permission: ['sqlOptimizationIsSupported'],
    children: [
      {
        index: true,
        element: <SqlOptimizationList />,
        key: 'sqlOptimizationList'
      },
      {
        path: 'create',
        element: <SqlOptimizationCreate />,
        key: 'sqlOptimizationCreate'
      },
      {
        path: 'overview/:optimizationId',
        element: <SqlOptimizationOverview />,
        key: 'sqlOptimizationOverview'
      },
      {
        path: 'detail/:dbType/:optimizationId/:number',
        element: <SqlOptimizationDetail />,
        key: 'sqlOptimizationDetail'
      }
    ]
    // #endif
  },
  {
    path: `${PROJECT_ROUTER_PARAM}/push-rule`,
    key: 'pushRuleConfiguration',
    element: <PushRuleConfiguration />
  },
  {
    path: `${PROJECT_ROUTER_PARAM}/pipeline-configuration`,
    key: 'pipelineConfiguration',
    children: [
      {
        index: true,
        element: <PipelineConfigurationList />,
        key: 'pipelineConfigurationList'
      },
      {
        path: 'create',
        element: <PipelineConfigurationCreation />,
        key: 'sqlOptimizationCreate'
      },
      {
        path: 'update/:id',
        element: <PipelineConfigurationUpdate />,
        key: 'sqlOptimizationCreate'
      }
    ]
  },
  {
    path: `${PROJECT_ROUTER_PARAM}/version-management`,
    key: 'versionManagement',
    children: [
      {
        index: true,
        element: <VersionManagement />,
        key: 'VersionManagementList'
      },
      // #if [ee]
      {
        path: 'create',
        element: <VersionManagementCreation />,
        key: 'versionManagementCreation'
      },
      {
        path: 'update/:versionId',
        element: <VersionManagementUpdate />,
        key: 'versionManagementCreation'
      },
      {
        path: 'detail/:versionId',
        element: <VersionManagementDetail />,
        key: 'versionManagementDetail'
      }
      // #endif
    ]
  },
  {
    path: '*',
    key: 'projectRedirect',
    element: <Navigate to="/" />
  }
];

export const globalRouterConfig: RouterConfigItem[] = [
  {
    path: ROUTE_PATH_COLLECTION.SQLE.REPORT_STATISTICS,
    label: 'menu.reportStatistics',
    element: <ReportStatistics />,
    key: 'reportStatistics',
    role: [SystemRole.admin, SystemRole.globalViewing]
  },
  {
    path: ROUTE_PATH_COLLECTION.SQLE.RULE,
    label: 'menu.rule',
    element: <Rule />,
    key: 'rule'
  },
  {
    key: 'ruleManager',
    path: 'sqle/rule-manager',
    role: [SystemRole.admin, SystemRole.globalViewing],
    children: [
      {
        index: true,
        key: 'ruleTemplateManagement',
        element: <RuleManager />
      },
      {
        path: 'global-create',
        key: 'globalRuleTemplateCreate',
        element: <GlobalCreateRuleTemplate />
      },
      {
        path: 'global-import',
        key: 'globalRuleTemplateImport',
        element: <GlobalImportRuleTemplate />
      },
      {
        path: 'global-update/:templateName',
        key: 'globalRuleTemplateUpdate',
        element: <GlobalUpdateRuleTemplate />
      },
      {
        path: 'global-detail/:templateName/:dbType',
        key: 'globalRuleTemplateDetail',
        element: <GlobalRuleTemplateDetail />
      },
      {
        path: 'custom-create',
        key: 'createCustomRule',
        element: <CreateCustomRule />
      },
      {
        path: 'custom-update/:ruleID',
        key: 'updateCustomRule',
        element: <UpdateCustomRule />
      }
    ] as RouterConfigItem[]
  },
  // #if [ee]
  {
    path: 'sqle/rule/knowledge/:ruleName/:dbType',
    key: 'ruleKnowledge',
    element: <RuleKnowledge />
  },
  // #endif
  {
    path: ROUTE_PATH_COLLECTION.SQLE.GLOBAL_DASHBOARD,
    key: 'globalDashboard',
    element: <GlobalDashboard />
  }
];
