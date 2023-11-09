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

//重构中
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

const AuditPlan = React.lazy(
  () => import(/* webpackChunkName: "AuditPlan" */ '../page/AuditPlan')
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

const AuditPlanSqlAnalyze = React.lazy(
  () =>
    import(
      /* webpackChunkName: "AuditPlanSqlAnalyze" */ '../page/SqlAnalyze/AuditPlan'
    )
);

const OrderSqlAnalyze = React.lazy(
  () =>
    import(/* webpackChunkName: "OrderSqlAnalyze" */ '../page/SqlAnalyze/Order')
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

/* IFTRUE_isEE */
const RuleKnowledge = React.lazy(() => import('../page/RuleKnowledge'));
/* FITRUE_isEE */

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
        icon: <DesktopOutlined />,
        key: 'orderCreate'
      },
      {
        path: ':orderId',
        element: <OrderDetail />,
        key: 'orderDetail'
      },
      /* IFTRUE_isEE */
      {
        path: ':taskId/:sqlNum/analyze',
        label: 'menu.orderSqlAnalyze',
        element: <OrderSqlAnalyze />,
        key: 'orderAnalyze'
      }
      /* FITRUE_isEE */
    ] as RouterConfigItem[]
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
    element: <AuditPlan />,
    children: [
      {
        key: 'auditPlan',
        label: 'menu.auditPlaneList',
        path: `${PROJECT_ROUTER_PARAM}/auditPlan`,
        children: [
          {
            index: true,
            element: <AuditPlanList />,
            key: 'auditPlanList'
          },
          {
            path: 'create',
            label: 'menu.rule',
            element: <CreateAuditPlan />,
            key: 'auditPlanCreate'
          },
          {
            path: 'update/:auditPlanName',
            label: 'menu.rule',
            element: <UpdateAuditPlan />,
            key: 'auditPlanUpdate'
          },
          {
            path: 'detail/:auditPlanName',
            key: 'auditPlanDetail',
            label: 'menu.auditPlane',
            element: <AuditPlanDetail />
          },
          {
            path: 'detail/:auditPlanName/report/:reportId',
            key: 'auditPlanDetailReport',
            label: 'menu.auditPlane',
            element: <AuditPlanReport />
          },
          /* IFTRUE_isEE */
          {
            path: ':reportId/:sqlNum/:auditPlanName/analyze',
            key: 'auditPlanDetail',
            label: 'menu.auditPlanSqlAnalyze',
            element: <AuditPlanSqlAnalyze />,
            hideInSliderMenu: true
          }
          /* FITRUE_isEE */
        ]
      }
    ] as RouterConfigItem[]
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
    ] as RouterConfigItem[]
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
    ] as RouterConfigItem[]
  },
  {
    path: `${PROJECT_ROUTER_PARAM}/whitelist`,
    key: 'Whitelist',
    label: 'menu.whitelist',
    element: <Whitelist />,
    icon: <ProfileOutlined />
  },
  /* IFTRUE_isEE */
  {
    path: `${PROJECT_ROUTER_PARAM}/operationRecord`,
    label: 'menu.operationRecord',
    key: 'operationRecord',
    element: <OperationRecord />,
    role: [SystemRole.admin]
  },
  /* FITRUE_isEE */
  {
    path: `${PROJECT_ROUTER_PARAM}/sqlManagement`,
    label: 'menu.sqlManagement',
    key: 'sqlManagement',
    element: <SQLManagement />
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
  /* IFTRUE_isEE */
  {
    path: 'sqle/rule/knowledge/:ruleName/:dbType',
    key: 'ruleKnowledge',
    element: <RuleKnowledge />
  }
  /* FITRUE_isEE */
];
