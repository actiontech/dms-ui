import { Navigate, RouteObject } from 'react-router-dom';
import { RouterConfigItem } from '@actiontech/shared/lib/types/common.type';
import { lazy } from 'react';
import { BaseGlobalRouterConfig, BaseProjectRouterConfig } from './router.base';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

// #if [sqle]
import {
  projectDetailRouterConfig as SQLEProjectDetailRouterConfig,
  globalRouterConfig as SQLEGlobalRouterConfig
} from 'sqle/src/router/config';
// #endif

// #if [provision]
import { AuthRouterConfig as ProvisionAuthRouterConfig } from 'provision/src/router/router';
// #endif

const ProjectDetail = lazy(() => import('../page/Project/Detail'));

export const AuthRouterConfig: RouterConfigItem[] = [
  ...BaseGlobalRouterConfig,
  {
    key: 'projectDetail',
    path: ROUTE_PATHS.BASE.PROJECT_DETAIL,
    element: <ProjectDetail />,
    children: BaseProjectRouterConfig
  },

  // #if [sqle]
  ...SQLEGlobalRouterConfig,
  {
    key: 'sqleProjectDetail',
    path: ROUTE_PATHS.BASE.SQLE_PROJECT_DETAIL,
    element: <ProjectDetail />,
    children: SQLEProjectDetailRouterConfig
  },
  // #endif

  // #if [provision]
  {
    path: 'provision/project/*',
    key: 'provision',
    element: <ProjectDetail />,
    children: ProvisionAuthRouterConfig
  },
  // #endif

  {
    path: '*',
    key: 'null',
    element: <Navigate to={ROUTE_PATHS.BASE.HOME} />
  }
];

const Login = lazy(() => import('../page/Login'));
const BindUser = lazy(() => import('../page/BindUser'));

export const unAuthRouterConfig: RouteObject[] = [
  {
    path: ROUTE_PATHS.BASE.LOGIN.index.path,
    element: <Login />
  },
  {
    path: ROUTE_PATHS.BASE.USER_BIND.index.path,
    element: <BindUser />
  },
  {
    path: '*',
    element: <Navigate to={`${ROUTE_PATHS.BASE.LOGIN.index.path}`} />
  }
];
