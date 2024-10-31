import { PROJECT_ROUTER_PARAM } from '@actiontech/shared/lib/data/common';
import { PERMISSIONS } from '@actiontech/shared/lib/global';
import { RouterConfigItem } from '@actiontech/shared/lib/types/common.type';
import { lazy } from 'react';

// #if [ee]
const Project = lazy(() => import('../page/Project'));
const ImportProject = lazy(() => import('../page/Project/ImportProject'));
const ProjectBatchImportDataSource = lazy(
  () => import('../page/Project/BatchImportDataSource')
);

const ExportTaskList = lazy(() => import('../page/DataExportManagement/List'));
const CreateExportTask = lazy(
  () => import('../page/DataExportManagement/Create')
);
const ExportTaskDetail = lazy(
  () => import('../page/DataExportManagement/Detail')
);

const AddSyncTask = lazy(() => import('../page/SyncDataSource/AddPage'));
const UpdateSyncTask = lazy(() => import('../page/SyncDataSource/UpdatePage'));
const BatchImportDataSource = lazy(
  () => import('../page/DataSource/components/BatchImportDataSource')
);

const GlobalBatchImportDataSource = lazy(
  () => import('../page/GlobalDataSource/BatchImportDataSource')
);
const GlobalAddDataSource = lazy(
  () => import('../page/DataSource/components/AddDataSource')
);
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
const Account = lazy(() => import('../page/Account'));
const ExportTaskManagement = lazy(() => import('../page/DataExportManagement'));
const DataSourceManagement = lazy(() => import('../page/DataSourceManagement'));

const Transit = lazy(() => import('../page/Transit'));

export const BaseRouterConfig: RouterConfigItem[] = [
  {
    path: '/',
    key: 'home',
    element: <Home />
  },
  {
    path: 'user-center',
    key: 'userCenter',
    element: <UserCenter />,
    permission: PERMISSIONS.PAGES.BASE.USER_CENTER
  },
  {
    path: 'system',
    key: 'system',
    element: <System />,
    permission: PERMISSIONS.PAGES.BASE.SYSTEM_SETTING
  },
  {
    path: 'account',
    hideInMenu: true,
    key: 'account',
    element: <Account />
  },
  {
    path: 'data-source-management',
    key: 'dataSourceManagement',
    permission: PERMISSIONS.PAGES.BASE.DATA_SOURCE_MANAGEMENT,
    element: <DataSourceManagement />
  },
  {
    path: '/transit',
    key: 'transit',
    element: <Transit />
  },

  // #if [ee]
  {
    path: 'global-data-source',
    key: 'globalDataSource',
    permission: PERMISSIONS.PAGES.BASE.GLOBAL_DATA_SOURCE,
    children: [
      {
        path: 'batch-import',
        key: 'globalBatchImportDataSource',
        element: <GlobalBatchImportDataSource />
      },
      {
        path: 'create',
        element: <GlobalAddDataSource />,
        key: 'globalDataSourceCreate'
      }
    ] as RouterConfigItem[]
  },
  {
    path: `sync-data-source`,
    key: 'syncDataSource',
    permission: PERMISSIONS.PAGES.BASE.SYNC_DATA_SOURCE,
    children: [
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
    ] as RouterConfigItem[]
  },
  {
    path: 'project',
    key: 'project',
    children: [
      {
        index: true,
        key: 'projectList',
        element: <Project />
      },
      {
        path: 'import',
        key: 'projectImport',
        element: <ImportProject />
      },
      {
        path: 'batch-import',
        key: 'projectBatchImportDataSource',
        element: <ProjectBatchImportDataSource />
      }
    ]
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
          },
          // #if [ee]
          {
            path: 'batch-import',
            element: <BatchImportDataSource />,
            key: 'batchImportDataSource'
          }
          // #endif
        ]
      },
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
      },
      {
        path: `${PROJECT_ROUTER_PARAM}/cloud-beaver`,
        key: 'cloudBeaver',
        element: <CloudBeaver />
      }
    ] as RouterConfigItem[]
  }
];
