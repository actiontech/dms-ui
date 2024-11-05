import { Navigate, RouteObject } from 'react-router-dom';
import { RouterConfigItem } from '@actiontech/shared/lib/types/common.type';
import { lazy } from 'react';
import { BaseRouterConfig } from './router.base';

// #if [sqle]
import {
  projectDetailRouterConfig as SQLEProjectDetailRouterConfig,
  globalRouterConfig as SQLEGlobalRouterConfig
} from 'sqle/src/router/config';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
// #endif

const ProjectDetail = lazy(() => import('../page/Project/Detail'));

export const AuthRouterConfig: RouterConfigItem[] = [
  ...BaseRouterConfig,

  // #if [sqle]
  ...SQLEGlobalRouterConfig,
  {
    key: 'projectDetail',
    path: ROUTE_PATHS.BASE.SQLE_PROJECT_DETAIL,
    element: <ProjectDetail />,
    children: SQLEProjectDetailRouterConfig
  },
  // #endif

  {
    path: '*',
    key: 'null',
    element: <Navigate to="/" />
  }
];

const Login = lazy(() => import('../page/Login'));
const BindUser = lazy(() => import('../page/BindUser'));

export const unAuthRouterConfig: RouteObject[] = [
  {
    path: ROUTE_PATHS.BASE.LOGIN,
    element: <Login />
  },
  {
    path: ROUTE_PATHS.BASE.USER_BIND,
    element: <BindUser />
  },
  {
    path: '*',
    element: <Navigate to={`${ROUTE_PATHS.BASE.LOGIN}`} />
  }
];
