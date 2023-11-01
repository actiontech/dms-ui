import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { RouterConfigItem } from '@actiontech/shared/lib/types/common.type';

/* IFTRUE_isSQLE */
import { SQLERouterConfig } from './routers/sqle';
/* FITRUE_isSQLE */

/* IFTRUE_isDMS */
import { DMSRouterConfig } from './routers/dms';
/* FITRUE_isDMS */

/* IFTRUE_isPROVISION */
import { ProvisionRouterConfig } from './routers/provision';
/* FITRUE_isPROVISION */

/* IFTRUE_isDIAGNOSIS */
import { DiagnosisRouterConfig } from './routers/diagnosis';
/* FITRUE_isDIAGNOSIS */

export const AuthRouterConfig: RouterConfigItem[] = [
  /* IFTRUE_isSQLE */
  ...SQLERouterConfig,
  /* FITRUE_isSQLE */

  /* IFTRUE_isDMS */
  ...DMSRouterConfig,
  /* FITRUE_isDMS */

  /* IFTRUE_isPROVISION */
  ...ProvisionRouterConfig,
  /* FITRUE_isPROVISION */

  /* IFTRUE_isDIAGNOSIS */
  ...DiagnosisRouterConfig,
  /* FITRUE_isDIAGNOSIS */
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
