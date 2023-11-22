import { PROJECT_ROUTER_PARAM } from '@actiontech/shared/lib/data/common';
import { SystemRole } from '@actiontech/shared/lib/enum';
import { RouterConfigItem } from '@actiontech/shared/lib/types/common.type';
import { lazy } from 'react';

// #if [prod_version=ee]
const Project = lazy(() => import('../page/Project'));
// #endif

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

export const BaseRouterConfig: RouterConfigItem[] = [
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
  // #if [prod_version=ee]
  {
    path: 'project',
    key: 'project',
    element: <Project />
  },
  // #endif

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
  }
];
