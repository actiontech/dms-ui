import { lazy, ReactNode } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';

/* IFTRUE_isPROVISION */
import { AuthRouterConfig as ProvisionAuthRouterConfig } from 'provision/src/router/router';
/* FITRUE_isPROVISION */

/* IFTRUE_isSQLE */
import { projectDetailRouterConfig } from 'sqle/src/router/config';
/* FITRUE_isSQLE */

/* IFTRUE_isDIAGNOSIS */
import { DiagnosisRouterConfig } from 'diagnosis/src/router/router';
/* FITRUE_isDIAGNOSIS */

import { PROJECT_ROUTER_PARAM } from '@actiontech/shared/lib/data/common';
import { SystemRole } from '@actiontech/shared/lib/enum';

/* IFTRUE_isEE */
const Project = lazy(() => import('../page/Project'));
/* FITRUE_isEE */

const Login = lazy(() => import('../page/Login'));
const BindUser = lazy(() => import('../page/BindUser'));
const Home = lazy(() => import('../page/Home'));
const UserCenter = lazy(() => import('../page/UserCenter'));
const DataSource = lazy(() => import('../page/DataSource'));
const AddDataSource = lazy(() => import('../page/DataSource/AddDataSource'));
const DataSourceList = lazy(() => import('../page/DataSource/DataSourceList'));
const UpdateDataSource = lazy(
  () => import('../page/DataSource/UpdateDataSource')
);
const Member = lazy(() => import('../page/Member'));
const ProjectDetail = lazy(() => import('../page/Project/Detail'));
const System = lazy(() => import('../page/System'));
const CloudBeaver = lazy(() => import('../page/CloudBeaver'));
const SyncDataSource = lazy(() => import('../page/SyncDataSource'));
const SyncTaskList = lazy(() => import('../page/SyncDataSource/SyncTaskList'));
const AddSyncTask = lazy(() => import('../page/SyncDataSource/AddSyncTask'));
const UpdateSyncTask = lazy(
  () => import('../page/SyncDataSource/UpdateSyncTask')
);
const Account = lazy(() => import('../page/Account'));

/* IFTRUE_isSQLE */
//sqle global page
const Rule = lazy(() => import('sqle/src/page/Rule'));
const RuleManager = lazy(() => import('sqle/src/page/RuleManager'));
const GlobalRuleTemplateDetail = lazy(
  () =>
    import(
      /* webpackChunkName: "GlobalRuleTemplateDetail" */ 'sqle/src/page/GlobalRuleTemplate/RuleTemplateDetail'
    )
);
const GlobalImportRuleTemplate = lazy(
  () =>
    import(
      /* webpackChunkName: "ImportRuleTemplate" */ 'sqle/src/page/GlobalRuleTemplate/ImportRuleTemplate'
    )
);
const GlobalUpdateRuleTemplate = lazy(
  () =>
    import(
      /* webpackChunkName: "UpdateRuleTemplate" */ 'sqle/src/page/GlobalRuleTemplate/UpdateRuleTemplate'
    )
);
const GlobalCreateRuleTemplate = lazy(
  () =>
    import(
      /* webpackChunkName: "CreateRuleTemplate" */ 'sqle/src/page/GlobalRuleTemplate/CreateRuleTemplate'
    )
);
const CreateCustomRule = lazy(
  () =>
    import(
      /* webpackChunkName: "CreateCustomRule" */ 'sqle/src/page/CustomRule/CreateCustomRule'
    )
);
const UpdateCustomRule = lazy(
  () =>
    import(
      /* webpackChunkName: "UpdateCustomRule" */ 'sqle/src/page/CustomRule/UpdateCustomRule'
    )
);
const ReportStatistics = lazy(() => import('sqle/src/page/ReportStatistics'));
/* FITRUE_isSQLE */

export type RouterConfigItem = RouteObject & {
  label?: string;
  icon?: ReactNode;
  hideInMenu?: boolean;
  key: string;
  children?: RouterConfigItem[];
  role?: Array<SystemRole | ''>;
};

export const AuthRouterConfig: RouterConfigItem[] = [
  {
    path: '/',
    key: 'home',
    element: <Home />
  },
  {
    path: 'userCenter',
    key: 'userCenter',
    element: <UserCenter />,
    role: [SystemRole.admin]
  },
  {
    path: 'system',
    key: 'system',
    element: <System />,
    role: [SystemRole.admin]
  },
  {
    path: 'cloudBeaver',
    key: 'cloudBeaver',
    element: <CloudBeaver />
  },
  {
    path: 'account',
    hideInMenu: true,
    key: 'account',
    element: <Account />
  },
  /* IFTRUE_isEE */
  {
    path: 'project',
    key: 'project',
    element: <Project />
  },
  /* FITRUE_isEE */

  /* IFTRUE_isSQLE */
  //====== 这部分路由为sqle特有的全局页面, 所以无法放在 projectDetailRouterConfig, 其内容为 sqle 中 globalRouterConfig 的展开项
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
  //=========
  {
    key: 'projectDetail',
    path: 'sqle/project/*',
    element: <ProjectDetail />,
    children: projectDetailRouterConfig
  },
  /* FITRUE_isSQLE */
  {
    key: 'projectDetail',
    path: 'project/*',
    element: <ProjectDetail />,
    children: [
      {
        path: `${PROJECT_ROUTER_PARAM}/member`,
        key: 'member',
        element: <Member />
      },
      {
        path: `${PROJECT_ROUTER_PARAM}/db-services`,
        key: 'dataSource',
        element: <DataSource />,
        children: [
          {
            index: true,
            element: <DataSourceList />,
            key: 'dataSourceList'
          },
          {
            path: 'create',
            element: <AddDataSource />,
            key: 'dataSourceCreate'
          },
          {
            path: 'update/:dbServiceUid',
            element: <UpdateDataSource />,
            key: 'dataSourceUpdate'
          }
        ]
      },
      {
        path: `${PROJECT_ROUTER_PARAM}/syncDataSource`,
        label: 'menu.syncDataSource',
        key: 'syncDataSource',
        element: <SyncDataSource />,
        children: [
          {
            index: true,
            element: <SyncTaskList />,
            key: 'syncDataSourceList'
          },
          {
            path: 'create',
            element: <AddSyncTask />,
            key: 'syncDataSourceCreate'
          },
          {
            path: 'update/:taskId',
            element: <UpdateSyncTask />,
            key: 'syncDataSourceUpdate'
          }
        ]
      }
    ] as RouterConfigItem[]
  },

  /* IFTRUE_isPROVISION */
  {
    path: 'provision/project/*',
    key: 'provision',
    element: <ProjectDetail />,
    children: ProvisionAuthRouterConfig
  },
  /* FITRUE_isPROVISION */

  /* IFTRUE_isDIAGNOSIS */
  {
    path: 'diagnosis/project/*',
    key: 'diagnosis',
    element: <ProjectDetail />,
    children: DiagnosisRouterConfig
  },
  /* FITRUE_isDIAGNOSIS */
  {
    path: '*',
    hideInMenu: true,
    key: 'null',
    element: <Navigate to="/" />
  }
];

export const unAuthRouterConfig: RouteObject[] = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/user/bind',
    element: <BindUser />
  },
  {
    path: '*',
    element: <Navigate to="/login" />
  }
];
