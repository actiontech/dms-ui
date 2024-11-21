import React from 'react';
import { Navigate } from 'react-router-dom';
import { PROJECT_ROUTER_PARAM } from '@actiontech/shared/lib/data/common';
import { RouterConfigItem } from '@actiontech/shared/lib/types/common.type';

const AuthAudit = React.lazy(() => import('~/page/Audit/AuthAudit'));
const TemplateAudit = React.lazy(() => import('~/page/Audit/TemplateAudit'));

const DatabaseAccountList = React.lazy(
  () => import('../page/DatabaseAccount/')
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

const DatabaseRole = React.lazy(() => import('../page/DatabaseRole'));

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
    key: 'auditWrapper',
    children: [
      {
        path: `${PROJECT_ROUTER_PARAM}/audit/auth`,
        key: 'authAudit',
        element: <AuthAudit />
      },
      {
        path: `${PROJECT_ROUTER_PARAM}/audit/template`,
        key: 'templateAudit',
        element: <TemplateAudit />
      }
    ]
  },
  {
    key: 'databaseRole',
    path: `${PROJECT_ROUTER_PARAM}/database-role`,
    element: <DatabaseRole />
  },
  {
    path: '*',
    key: 'null',
    element: <Navigate to="/" />
  }
];
