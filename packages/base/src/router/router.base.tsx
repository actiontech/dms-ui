import { PROJECT_ROUTER_PARAM } from '@actiontech/shared/lib/data/common';
import { SystemRole } from '@actiontech/shared/lib/enum';
import { RouterConfigItem } from '@actiontech/shared/lib/types/common.type';
import { lazy } from 'react';

// #if [ee]
const Project = lazy(() => import('../page/Project'));

const ExportTaskList = lazy(() => import('../page/DataExportManagement/List'));
const CreateExportTask = lazy(
  () => import('../page/DataExportManagement/Create')
);
const ExportTaskDetail = lazy(
  () => import('../page/DataExportManagement/Detail')
);

// const SyncTaskList = lazy(() => import('../page/SyncDataSource/List'));
// const AddSyncTask = lazy(() => import('../page/SyncDataSource/AddPage'));
// const UpdateSyncTask = lazy(() => import('../page/SyncDataSource/UpdatePage'));
// #endif

const Home = lazy(() => import('../page/Home'));
const UserCenter = lazy(() => import('../page/UserCenter'));
const DataSource = lazy(() => import('../page/DataSource'));
const AddDataSource = lazy(
  () => import('../page/DataSource/components/AddDataSource')
);
const UpdateDataSource = lazy(
  () => import('../page/DataSource/components/UpdateDataSource')
);
const DataSourceList = lazy(() => import('../page/DataSource/components/List'));
const Member = lazy(() => import('../page/Member'));
const ProjectDetail = lazy(() => import('../page/Project/Detail'));
const System = lazy(() => import('../page/System'));
const CloudBeaver = lazy(() => import('../page/CloudBeaver'));
// const SyncDataSource = lazy(() => import('../page/SyncDataSource'));
const Account = lazy(() => import('../page/Account'));
const ExportTaskManagement = lazy(() => import('../page/DataExportManagement'));

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
  // #if [ee]
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
      // {
      //   path: `${PROJECT_ROUTER_PARAM}/syncDataSource`,
      //   label: 'menu.syncDataSource',
      //   key: 'syncDataSource',
      //   element: <SyncDataSource />,
      //   // #if [ee]
      //   children: [
      //     {
      //       index: true,
      //       element: <SyncTaskList />,
      //       key: 'syncDataSourceList'
      //     },
      //     {
      //       path: 'create',
      //       element: <AddSyncTask />,
      //       key: 'syncDataSourceCreate'
      //     },
      //     {
      //       path: 'update/:taskId',
      //       element: <UpdateSyncTask />,
      //       key: 'syncDataSourceUpdate'
      //     }
      //   ]
      //   // #endif
      // },
      {
        path: `${PROJECT_ROUTER_PARAM}/data/export`,
        key: 'dataExportManagement',
        element: <ExportTaskManagement />,
        // #if [ee]
        children: [
          {
            index: true,
            key: 'dataExportManagement',
            element: <ExportTaskList />
          },
          {
            path: 'create',
            element: <CreateExportTask />,
            key: 'CreateExportTask'
          },
          {
            path: ':workflowID',
            element: <ExportTaskDetail />,
            key: 'ExportTaskDetail'
          }
        ]
        // #endif
      }
    ] as RouterConfigItem[]
  }
];
