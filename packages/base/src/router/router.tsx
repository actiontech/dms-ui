import { Navigate, RouteObject } from 'react-router-dom';
import { RouterConfigItem } from '@actiontech/shared/lib/types/common.type';
import { lazy } from 'react';
import { BaseRouterConfig } from './router.base';

/* IFTRUE_isSQLE */
import {
  projectDetailRouterConfig as SQLEProjectDetailRouterConfig,
  globalRouterConfig as SQLEGlobalRouterConfig
} from 'sqle/src/router/config';
/* FITRUE_isSQLE */

const ProjectDetail = lazy(() => import('../page/Project/Detail'));

export const AuthRouterConfig: RouterConfigItem[] = [
  ...BaseRouterConfig,

  /* IFTRUE_isSQLE */
  ...SQLEGlobalRouterConfig,
  {
    key: 'projectDetail',
    path: 'sqle/project/*',
    element: <ProjectDetail />,
    children: SQLEProjectDetailRouterConfig
  },
  /* FITRUE_isSQLE */

  {
    path: '*',
    hideInMenu: true,
    key: 'null',
    element: <Navigate to="/" />
  }
];

const Login = lazy(() => import('../page/Login'));
const BindUser = lazy(() => import('../page/BindUser'));

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
