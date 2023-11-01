import React from 'react';
import { Navigate } from 'react-router-dom';
import {
  GlobalRouterItemKeyLiteral,
  ProjectDetailRouterItemKeyLiteral,
  RouterConfigItem
} from '../types/router.type';
import {
  PieChartOutlined,
  DesktopOutlined,
  AuditOutlined,
  ConsoleSqlOutlined,
  ProfileOutlined,
  NodeIndexOutlined,
  CiCircleOutlined,
  BarChartOutlined,
  ProjectOutlined
} from '@ant-design/icons';
import { SystemRole } from '../data/common';
import { PROJECT_ROUTER_PARAM } from '@actiontech/shared/lib/data/common';

// 验收已反馈，待后端修改
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
// 已重构，剩余列宽问题
const Whitelist = React.lazy(
  () => import(/* webpackChunkName: "Whitelist" */ '../page/Whitelist')
);

const WorkflowTemplate = React.lazy(
  () =>
    import(
      /* webpackChunkName: "WorkflowTemplate" */ '../page/WorkflowTemplate'
    )
);

// 已重构
const AuditPlan = React.lazy(
  () => import(/* webpackChunkName: "AuditPlan" */ '../page/AuditPlan')
);

// 已重构
const AuditPlanList = React.lazy(
  () =>
    import(/* webpackChunkName: "AuditPlanList" */ '../page/AuditPlan/PlanList')
);

// 已重构
const CreateAuditPlan = React.lazy(
  () =>
    import(
      /* webpackChunkName: "CreateAuditPlan" */ '../page/AuditPlan/CreatePlan'
    )
);

// 已重构
const UpdateAuditPlan = React.lazy(
  () =>
    import(
      /* webpackChunkName: "AuditPlanList" */ '../page/AuditPlan/UpdatePlan'
    )
);

// 已重构
const AuditPlanDetail = React.lazy(
  () =>
    import(/* webpackChunkName: "PlanDetail" */ '../page/AuditPlan/PlanDetail')
);

// 已重构
const AuditPlanReport = React.lazy(
  () =>
    import(
      /* webpackChunkName: "AuditPlanReport" */ '../page/AuditPlan/PlanDetail/DetailReport'
    )
);

// 已重构
const AuditPlanSqlAnalyze = React.lazy(
  () =>
    import(
      /* webpackChunkName: "AuditPlanSqlAnalyze" */ '../page/SqlAnalyze/AuditPlan'
    )
);

// ----------------------------

// 已重构
const OrderSqlAnalyze = React.lazy(
  () =>
    import(/* webpackChunkName: "OrderSqlAnalyze" */ '../page/SqlAnalyze/Order')
);

// 已重构
const ReportStatistics = React.lazy(
  () =>
    import(
      /* webpackChunkName: "ReportStatistics" */ '../page/ReportStatistics'
    )
);

// 已重构
const ProjectOverview = React.lazy(
  () =>
    import(
      /* webpackChunkName: "ProjectOverview" */ '../page/ProjectManage/Overview'
    )
);

// 重构中
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

// 已重构
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

// 已重构
const CreateRuleTemplate = React.lazy(
  () =>
    import(
      /* webpackChunkName: "CreateRuleTemplate" */ '../page/RuleTemplate/CreateRuleTemplate'
    )
);

// 已重构
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
// 规则管理 重构中
const RuleManager = React.lazy(
  () => import(/* webpackChunkName: "RuleManager" */ '../page/RuleManager')
);

const GlobalImportRuleTemplate = React.lazy(
  () =>
    import(
      /* webpackChunkName: "ImportRuleTemplate" */ '../page/GlobalRuleTemplate/ImportRuleTemplate'
    )
);
const GlobalUpdateRuleTemplate = React.lazy(
  () =>
    import(
      /* webpackChunkName: "UpdateRuleTemplate" */ '../page/GlobalRuleTemplate/UpdateRuleTemplate'
    )
);
const GlobalCreateRuleTemplate = React.lazy(
  () =>
    import(
      /* webpackChunkName: "CreateRuleTemplate" */ '../page/GlobalRuleTemplate/CreateRuleTemplate'
    )
);
const CreateCustomRule = React.lazy(
  () =>
    import(
      /* webpackChunkName: "CreateCustomRule" */ '../page/CustomRule/CreateCustomRule'
    )
);
const UpdateCustomRule = React.lazy(
  () =>
    import(
      /* webpackChunkName: "UpdateCustomRule" */ '../page/CustomRule/UpdateCustomRule'
    )
);

const SqlAudit = React.lazy(
  () => import(/* webpackChunkName: "SqlAudit" */ '../page/SqlAudit')
);

export const projectDetailRouterConfig: RouterConfigItem<ProjectDetailRouterItemKeyLiteral>[] =
  [
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
      hideChildrenInSliderMenu: true,
      path: `${PROJECT_ROUTER_PARAM}/order`,
      children: [
        {
          index: true,
          element: <OrderList />,
          key: 'orderList'
        },
        //重构中
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
          hideInSliderMenu: true,
          element: <OrderSqlAnalyze />,
          key: 'orderAnalyze'
        }
        /* FITRUE_isEE */
      ] as RouterConfigItem<ProjectDetailRouterItemKeyLiteral>[]
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
          ],
          groups: [
            {
              title: '',
              values: [
                {
                  path: 'auditPlan',
                  key: 'auditPlan',
                  label: 'menu.auditPlane',
                  element: <AuditPlan />
                }
              ]
            }
          ]
        }
      ] as RouterConfigItem<ProjectDetailRouterItemKeyLiteral>[]
    },
    {
      path: `${PROJECT_ROUTER_PARAM}/rule/template`,
      key: 'ruleTemplate',
      label: 'menu.ruleTemplate',
      icon: <AuditOutlined />,
      element: <RuleTemplate />,
      hideChildrenInSliderMenu: true,
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
      ] as RouterConfigItem<ProjectDetailRouterItemKeyLiteral>[]
    },
    {
      path: `${PROJECT_ROUTER_PARAM}/progress`,
      key: 'progress',
      label: 'menu.progressManage',
      icon: <NodeIndexOutlined />,
      element: <WorkflowTemplate />,
      hideChildrenInSliderMenu: true,
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
      ] as RouterConfigItem<ProjectDetailRouterItemKeyLiteral>[]
    },
    {
      path: `${PROJECT_ROUTER_PARAM}/sqlAudit`,
      key: 'sqlAudit',
      label: 'menu.sqlAudit',
      icon: <NodeIndexOutlined />,
      element: <WorkflowTemplate />,
      hideChildrenInSliderMenu: true,
      // 'sqlAudit' | 'sqlAuditList' | 'sqlAuditCreate' | 'sqlAuditDetail'
      children: [
        {
          index: true,
          element: <SqlAudit />,
          key: 'sqlAuditList'
        }
      ] as RouterConfigItem<ProjectDetailRouterItemKeyLiteral>[]
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
      path: '*',
      key: 'projectRedirect',
      element: <Navigate to="/" />,
      hideInSliderMenu: true,
      label: 'menu.projectOverview'
    }
  ];

export const globalRouterConfig: RouterConfigItem<
  GlobalRouterItemKeyLiteral | ProjectDetailRouterItemKeyLiteral
>[] = [
  {
    path: 'reportStatistics',
    label: 'menu.reportStatistics',
    element: <ReportStatistics />,
    icon: <BarChartOutlined />,
    key: 'reportStatistics',
    role: [SystemRole.admin]
  },
  {
    key: 'ruleManager',
    path: 'sqle/ruleManager',
    element: <RuleManager />,
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
      /* IFTRUE_isEE */
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
      /* FITRUE_isEE */
    ] as RouterConfigItem<GlobalRouterItemKeyLiteral>[]
  },
  /* FITRUE_isEE */
  {
    path: '*',
    key: 'redirect',
    element: <Navigate to="/" />,
    hideInSliderMenu: true,
    label: 'menu.dashboard'
  }
];
