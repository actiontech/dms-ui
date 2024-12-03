import React from 'react';
import { Navigate } from 'react-router-dom';
import { RouterConfigItem } from '@actiontech/shared/lib/types/common.type';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

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
const CreateRole = React.lazy(
  () => import('../page/DatabaseRole/components/CreateRole')
);
const UpdateRole = React.lazy(
  () => import('../page/DatabaseRole/components/UpdateRole')
);

export const AuthRouterConfig: RouterConfigItem[] = [
  {
    path: ROUTE_PATHS.PROVISION.DATABASE_ACCOUNT.index.path,
    key: 'databaseAccount',
    children: [
      {
        index: true,
        key: 'databaseAccountList',
        element: <DatabaseAccountList />
      },
      {
        path: ROUTE_PATHS.PROVISION.DATABASE_ACCOUNT.create.path,
        key: 'createDatabaseAccount',
        element: <CreateDatabaseAccount />
      },
      {
        path: ROUTE_PATHS.PROVISION.DATABASE_ACCOUNT.update.path,
        key: 'updateDatabaseAccount',
        element: <UpdateDatabaseAccount />
      }
    ]
  },
  {
    path: ROUTE_PATHS.PROVISION.DATABASE_ACCOUNT_PASSWORD.index.path,
    key: 'databaseAccountPassword',
    element: <DatabaseAccountPassword />
  },
  {
    key: 'auditWrapper',
    children: [
      {
        path: ROUTE_PATHS.PROVISION.AUDIT.auth.path,
        key: 'authAudit',
        element: <AuthAudit />
      },
      {
        path: ROUTE_PATHS.PROVISION.AUDIT.template.path,
        key: 'templateAudit',
        element: <TemplateAudit />
      }
    ]
  },
  {
    key: 'databaseRole',
    path: ROUTE_PATHS.PROVISION.DATABASE_ROLE.index.path,
    children: [
      {
        index: true,
        key: 'databaseRoleList',
        element: <DatabaseRole />
      },
      {
        path: ROUTE_PATHS.PROVISION.DATABASE_ROLE.create.path,
        key: 'createRole',
        element: <CreateRole />
      },
      {
        path: ROUTE_PATHS.PROVISION.DATABASE_ROLE.update.path,
        key: 'updateRole',
        element: <UpdateRole />
      }
    ]
  },
  {
    path: '*',
    key: 'null',
    element: <Navigate to="/" />
  }
];
