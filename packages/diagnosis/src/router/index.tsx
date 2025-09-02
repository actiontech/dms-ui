import React, { ReactNode } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';

const Login = React.lazy(() => import('../page/Login'));
const MonitorSourceConfig = React.lazy(
  () => import('../page/MonitorSourceConfig')
);
const MonitorItemConfig = React.lazy(
  () => import('../page/MonitorSourceConfig/components/MonitorItemConfig')
);
const UserManagement = React.lazy(() => import('../page/UserManagement'));

export type RouterConfigItem = {
  path?: string;
  label?: string;
  icon?: ReactNode;
  hideInMenu?: boolean;
  key: string;
  children?: RouterConfigItem[];
  element?: ReactNode;
};

export const diagnosisAuthRouterConfig: RouterConfigItem[] = [
  // todo: 首页添加后修改
  {
    path: '/',
    label: 'menu.monitorSourceConfig',
    key: 'monitorSourceConfig',
    element: <MonitorSourceConfig />
  },
  {
    path: '/monitor-source-config',
    label: 'menu.monitorSourceConfig',
    key: 'monitorSourceConfig',
    element: <MonitorSourceConfig />
  },
  {
    path: `/:name/:id/:type/monitor-item-list`,
    key: 'monitorItemList',
    element: <MonitorItemConfig />,
    hideInMenu: true
  },
  {
    path: '/user-management',
    label: 'menu.userManagement',
    key: 'userManagement',
    element: <UserManagement />
  },
  {
    path: '*',
    hideInMenu: true,
    key: 'null',
    element: <Navigate to="/" />
  }
];

export const diagnosisUnAuthRouterConfig: RouteObject[] = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '*',
    element: <Navigate to="/login" />
  }
];
