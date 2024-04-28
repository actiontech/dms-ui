import React from 'react';
import { Navigate } from 'react-router-dom';
import {
  PieChartOutlined,
  AuditOutlined,
  ConsoleSqlOutlined,
  ProfileOutlined,
  CiCircleOutlined,
  ProjectOutlined
} from '@ant-design/icons';
import { SystemRole } from '../data/common';
import { PROJECT_ROUTER_PARAM } from '@actiontech/shared/lib/data/common';
import { RouterConfigItem } from '@actiontech/shared/lib/types/common.type';

const Home = React.lazy(
  () => import(/* webpackChunkName: "Home" */ '../page/Home')
);

const RuleTemplate = React.lazy(
  () => import(/* webpackChunkName: "RuleTemplate" */ '../page/RuleTemplate')
);

const CreateOrder = React.lazy(
  () => import(/* webpackChunkName: "CreateOrder" */ '../page/Order/Create')
);

const OrderDetail = React.lazy(
  () => import(/* webpackChunkName: "OrderDetail" */ '../page/Order/Detail')
);

const OrderList = React.lazy(
  () => import(/* webpackChunkName: "Order" */ '../page/Order/List')
);
const Whitelist = React.lazy(
  () => import(/* webpackChunkName: "Whitelist" */ '../page/Whitelist')
);

const AuditPlanList = React.lazy(
  () =>
    import(/* webpackChunkName: "AuditPlanList" */ '../page/AuditPlan/PlanList')
);

const CreateAuditPlan = React.lazy(
  () =>
    import(
      /* webpackChunkName: "CreateAuditPlan" */ '../page/AuditPlan/CreatePlan'
    )
);

const UpdateAuditPlan = React.lazy(
  () =>
    import(
      /* webpackChunkName: "AuditPlanList" */ '../page/AuditPlan/UpdatePlan'
    )
);

const AuditPlanDetail = React.lazy(
  () =>
    import(/* webpackChunkName: "PlanDetail" */ '../page/AuditPlan/PlanDetail')
);

const AuditPlanReport = React.lazy(
  () =>
    import(
      /* webpackChunkName: "AuditPlanReport" */ '../page/AuditPlan/PlanDetail/DetailReport'
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
const SQLManagement = React.lazy(
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

const OrderSqlAnalyze = React.lazy(() => import('../page/SqlAnalyze/Order'));

const AuditPlanSqlAnalyze = React.lazy(
  () => import('../page/SqlAnalyze/AuditPlan')
);

// #if [ee]
const RuleKnowledge = React.lazy(() => import('../page/RuleKnowledge'));

const SQLManagementAnalyze = React.lazy(
  () => import('../page/SqlAnalyze/SqlManage')
);

const UpdateWorkflowTemplate = React.lazy(
  () =>
    import(
      /* webpackChunkName: "UpdateWorkflowTemplate" */ '../page/WorkflowTemplate/UpdateWorkflowTemplate'
    )
);
// #endif

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

export const projectDetailRouterConfig: RouterConfigItem[] = [
  {
    label: 'menu.projectOverview',
    key: 'projectOverview',
    icon: <ProjectOutlined />,
    path: `${PROJECT_ROUTER_PARAM}/overview`,
    element: <ProjectOverview />
  },
  {
    label: 'menu.order',
    key: 'order',
    icon: <ConsoleSqlOutlined />,
    path: `${PROJECT_ROUTER_PARAM}/order`,
    children: [
      {
        index: true,
        element: <OrderList />,
        key: 'orderList'
      },
      {
        path: 'create',
        element: <CreateOrder />,
        key: 'orderCreate'
      },
      {
        path: ':orderId',
        element: <OrderDetail />,
        key: 'orderDetail'
      },
      {
        path: ':taskId/:sqlNum/analyze',
        element: <OrderSqlAnalyze />,
        key: 'orderAnalyze'
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
    path: `${PROJECT_ROUTER_PARAM}/dashboard`,
    label: 'menu.dashboard',
    element: <Home />,
    icon: <PieChartOutlined />,
    key: 'dashboard'
  },
  {
    key: 'plane',
    label: 'menu.auditPlane',
    icon: <CiCircleOutlined />,
    path: `${PROJECT_ROUTER_PARAM}/audit-plan`,
    children: [
      {
        index: true,
        element: <AuditPlanList />,
        key: 'auditPlanList'
      },
      {
        path: 'create',
        element: <CreateAuditPlan />,
        key: 'auditPlanCreate'
      },
      {
        path: 'update/:auditPlanName',
        element: <UpdateAuditPlan />,
        key: 'auditPlanUpdate'
      },
      {
        path: 'detail/:auditPlanName',
        key: 'auditPlanDetail',
        element: <AuditPlanDetail />
      },
      {
        path: 'detail/:auditPlanName/report/:reportId',
        key: 'auditPlanDetailReport',
        element: <AuditPlanReport />
      },
      {
        path: ':reportId/:sqlNum/:auditPlanName/analyze',
        key: 'auditPlanDetailAnalyze',
        element: <AuditPlanSqlAnalyze />
      }
    ]
  },
  {
    path: `${PROJECT_ROUTER_PARAM}/rule/template`,
    key: 'ruleTemplate',
    label: 'menu.ruleTemplate',
    icon: <AuditOutlined />,
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
    label: 'menu.whitelist',
    element: <Whitelist />,
    icon: <ProfileOutlined />
  },
  {
    path: `${PROJECT_ROUTER_PARAM}/operation-record`,
    label: 'menu.operationRecord',
    key: 'operationRecord',
    element: <OperationRecord />,
    role: [SystemRole.admin]
  },
  {
    path: `${PROJECT_ROUTER_PARAM}/sql-management`,
    label: 'menu.sqlManagement',
    key: 'sqlManagement',
    children: [
      {
        index: true,
        element: <SQLManagement />,
        key: 'SQLManagement'
      },
      // #if [ee]
      {
        path: ':sqlManageId/analyze',
        hideInSliderMenu: true,
        element: <SQLManagementAnalyze />,
        key: 'SQLManagementAnalyze'
      }
      // #endif
    ]
  },
  {
    path: `${PROJECT_ROUTER_PARAM}/plugin-audit`,
    label: 'menu.pluginAudit',
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
    label: 'menu.sqlOptimization',
    key: 'sqlOptimization',
    element: <SqlOptimization />,
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
        path: 'detail/:optimizationId/:number',
        element: <SqlOptimizationDetail />,
        key: 'sqlOptimizationDetail'
      }
    ]
  },
  {
    path: '*',
    key: 'projectRedirect',
    element: <Navigate to="/" />,
    label: 'menu.projectOverview'
  }
];

export const globalRouterConfig: RouterConfigItem[] = [
  {
    path: 'sqle/report-statistics',
    label: 'menu.reportStatistics',
    element: <ReportStatistics />,
    key: 'reportStatistics',
    role: [SystemRole.admin]
  },
  {
    path: 'sqle/rule',
    label: 'menu.rule',
    element: <Rule />,
    key: 'rule'
  },
  {
    key: 'ruleManager',
    path: 'sqle/rule-manager',
    role: [SystemRole.admin],
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
  }
  // #endif
];
