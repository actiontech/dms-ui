import { Navigate, RouteObject } from 'react-router-dom';
import { RouterConfigItem } from '@actiontech/shared/lib/types/common.type';
import { lazy } from 'react';
import { BaseRouterConfig } from './routers/base';

/* IFTRUE_isSQLE */
import { SQLERouterConfig } from './routers/sqle';
/* FITRUE_isSQLE */

export const AuthRouterConfig: RouterConfigItem[] = [
  ...BaseRouterConfig,

  /* IFTRUE_isSQLE */
  ...SQLERouterConfig,
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
