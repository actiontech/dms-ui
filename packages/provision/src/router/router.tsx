import React, { ReactNode } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { DatabaseOutlined } from '@ant-design/icons';
import { PROJECT_ROUTER_PARAM } from '@actiontech/shared/lib/data/common';

const Operation = React.lazy(() => import('../page/Data/Operation'));

const AuthAudit = React.lazy(() => import('~/page/Audit/AuthAudit'));
const TemplateAudit = React.lazy(() => import('~/page/Audit/TemplateAudit'));
// const ServiceAudit = React.lazy(() => import('~/page/Audit/ServiceAudit'));

const DatabaseAccountList = React.lazy(
  () => import('../page/DatabaseAccount/List')
);
const CreateDatabaseAccount = React.lazy(
  () => import('../page/DatabaseAccount/Create')
);
const UpdateDatabaseAccount = React.lazy(
  () => import('../page/DatabaseAccount/Update')
);

const DatabaseAccountPassword = React.lazy(
  () => import('../page/DatabaseAccountPassword')
);

export type RouterConfigItem = RouteObject & {
  label?: string;
  icon?: ReactNode;
  hideInMenu?: boolean;
  key: string;
  children?: RouterConfigItem[];
};

export const AuthRouterConfig: RouterConfigItem[] = [
  {
    path: `${PROJECT_ROUTER_PARAM}/database-account`,
    key: 'databaseAccount',
    children: [
      {
        index: true,
        key: 'databaseAccountList',
        element: <DatabaseAccountList />
      },
      {
        path: 'create',
        key: 'createDatabaseAccount',
        element: <CreateDatabaseAccount />
      },
      {
        path: 'update/:id',
        key: 'updateDatabaseAccount',
        element: <UpdateDatabaseAccount />
      }
    ]
  },
  {
    path: `${PROJECT_ROUTER_PARAM}/database-account-password`,
    key: 'databaseAccountPassword',
    element: <DatabaseAccountPassword />
  },
  {
    label: 'provisionNav.menu.dataObjectWrapper',
    key: 'dataObjectWrapper',
    icon: <DatabaseOutlined />,
    children: [
      {
        path: `${PROJECT_ROUTER_PARAM}/data/operation`,
        key: 'operation',
        label: 'provisionNav.menu.operation',
        element: <Operation />
      }
    ] as RouterConfigItem[]
  },
  {
    label: 'provisionNav.menu.auditWrapper',
    key: 'auditWrapper',
    icon: <DatabaseOutlined />,
    children: [
      {
        path: `${PROJECT_ROUTER_PARAM}/audit/auth`,
        key: 'authAudit',
        label: 'provisionNav.menu.authAudit',
        element: <AuthAudit />
      },
      {
        path: `${PROJECT_ROUTER_PARAM}/audit/template`,
        key: 'templateAudit',
        label: 'provisionNav.menu.templateAudit',
        element: <TemplateAudit />
      }
      // {
      //   path: `${PROJECT_ROUTER_PARAM}/audit/service`,
      //   key: 'serviceAudit',
      //   label: 'provisionNav.menu.serviceAudit',
      //   element: <ServiceAudit />
      // }
    ] as RouterConfigItem[]
  },
  {
    path: '*',
    hideInMenu: true,
    key: 'null',
    element: <Navigate to="/" />
  }
];
