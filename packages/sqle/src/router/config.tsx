import React from 'react';
import { Navigate } from 'react-router-dom';
import {
  PieChartOutlined,
  DesktopOutlined,
  AuditOutlined,
  ConsoleSqlOutlined,
  ProfileOutlined,
  NodeIndexOutlined,
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

const WorkflowTemplate = React.lazy(
  () =>
    import(
      /* webpackChunkName: "WorkflowTemplate" */ '../page/WorkflowTemplate'
    )
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
    import(
      /* webpackChunkName: "ProjectOverview" */ '../page/ProjectManage/Overview'
    )
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

const UpdateWorkflowTemplate = React.lazy(
  () =>
    import(
      /* webpackChunkName: "UpdateWorkflowTemplate" */ '../page/WorkflowTemplate/UpdateWorkflowTemplate'
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

const SqlAuditCreate = React.lazy(() => import('../page/SqlAudit/Create'));

const SqlAuditDetail = React.lazy(() => import('../page/SqlAudit/Detail'));

// #if [ee]
const RuleKnowledge = React.lazy(() => import('../page/RuleKnowledge'));
const OrderSqlAnalyze = React.lazy(() => import('../page/SqlAnalyze/Order'));
const AuditPlanSqlAnalyze = React.lazy(
  () => import('../page/SqlAnalyze/AuditPlan')
);
const SQLManagementAnalyze = React.lazy(
  () => import('../page/SqlAnalyze/SqlManage')
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
      // #if [ee]
      {
        path: ':taskId/:sqlNum/analyze',
        element: <OrderSqlAnalyze />,
        key: 'orderAnalyze'
      }
      // #endif
    ]
  },
  {
    path: `${PROJECT_ROUTER_PARAM}/sqlAudit`,
    key: 'sqlAudit',
    label: 'menu.sqlAudit',
    icon: <NodeIndexOutlined />,
    element: <WorkflowTemplate />,
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
    path: `${PROJECT_ROUTER_PARAM}/auditPlan`,
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
      // #if [ee]
      {
        path: ':reportId/:sqlNum/:auditPlanName/analyze',
        key: 'auditPlanDetail',
        element: <AuditPlanSqlAnalyze />
      }
      // #endif
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
        key: 'ruleTemplateImport'
      }
    ]
  },
  {
    path: `${PROJECT_ROUTER_PARAM}/progress`,
    key: 'progress',
    label: 'menu.progressManage',
    icon: <NodeIndexOutlined />,
    element: <WorkflowTemplate />,
    children: [
      {
        index: true,
        element: <WorkflowTemplateDetail />,
        key: 'progressDetail'
      },
      {
        path: 'update/:workflowName',
        element: <UpdateWorkflowTemplate />,
        key: 'progressUpdate'
      }
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
    path: `${PROJECT_ROUTER_PARAM}/operationRecord`,
    label: 'menu.operationRecord',
    key: 'operationRecord',
    element: <OperationRecord />,
    role: [SystemRole.admin]
  },
  {
    path: `${PROJECT_ROUTER_PARAM}/sqlManagement`,
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
    path: '*',
    key: 'projectRedirect',
    element: <Navigate to="/" />,
    label: 'menu.projectOverview'
  }
];

export const globalRouterConfig: RouterConfigItem[] = [
  {
    path: 'sqle/reportStatistics',
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
    path: 'sqle/ruleManager',
    role: [SystemRole.admin],
    children: [
      {
        index: true,
        element: <RuleManager />
      },
      {
        path: 'globalCreate',
        key: 'globalRuleTemplateCreate',
        element: <GlobalCreateRuleTemplate />
      },
      {
        path: 'globalImport',
        key: 'globalRuleTemplateImport',
        element: <GlobalImportRuleTemplate />
      },
      {
        path: 'globalUpdate/:templateName',
        key: 'globalRuleTemplateUpdate',
        element: <GlobalUpdateRuleTemplate />
      },
      {
        path: 'globalDetail/:templateName/:dbType',
        key: 'globalRuleTemplateDetail',
        element: <GlobalRuleTemplateDetail />
      },
      {
        path: 'customCreate',
        key: 'createCustomRule',
        element: <CreateCustomRule />
      },
      {
        path: 'customUpdate/:ruleID',
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
