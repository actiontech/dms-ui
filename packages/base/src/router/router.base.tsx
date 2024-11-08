import { PERMISSIONS } from '@actiontech/shared/lib/global';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
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
    path: ROUTE_PATHS.BASE.HOME,
    key: 'home',
    element: <Home />
  },
  {
    path: ROUTE_PATHS.BASE.USER_CENTER,
    key: 'userCenter',
    element: <UserCenter />,
    permission: PERMISSIONS.PAGES.BASE.USER_CENTER
  },
  {
    path: ROUTE_PATHS.BASE.SYSTEM,
    key: 'system',
    element: <System />,
    permission: PERMISSIONS.PAGES.BASE.SYSTEM_SETTING
  },
  {
    path: ROUTE_PATHS.BASE.ACCOUNT,
    key: 'account',
    element: <Account />
  },
  {
    path: ROUTE_PATHS.BASE.DATA_SOURCE_MANAGEMENT.index.path,
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
    path: ROUTE_PATHS.BASE.GLOBAL_DATA_SOURCE.index,
    key: 'globalDataSource',
    permission: PERMISSIONS.PAGES.BASE.GLOBAL_DATA_SOURCE,
    children: [
      {
        path: ROUTE_PATHS.BASE.GLOBAL_DATA_SOURCE.batch_import.path,
        key: 'globalBatchImportDataSource',
        element: <GlobalBatchImportDataSource />
      },
      {
        path: ROUTE_PATHS.BASE.GLOBAL_DATA_SOURCE.create.path,
        element: <GlobalAddDataSource />,
        key: 'globalDataSourceCreate'
      }
    ]
  },
  {
    path: ROUTE_PATHS.BASE.SYNC_DATA_SOURCE.index,
    key: 'syncDataSource',
    permission: PERMISSIONS.PAGES.BASE.SYNC_DATA_SOURCE,
    children: [
      {
        path: ROUTE_PATHS.BASE.SYNC_DATA_SOURCE.create.path,
        element: <AddSyncTask />,
        key: 'syncDataSourceCreate'
      },
      {
        path: ROUTE_PATHS.BASE.SYNC_DATA_SOURCE.update.path,
        element: <UpdateSyncTask />,
        key: 'syncDataSourceUpdate'
      }
    ]
  },
  {
    path: ROUTE_PATHS.BASE.PROJECT.index,
    key: 'project',
    children: [
      {
        index: true,
        key: 'projectList',
        element: <Project />
      },
      {
        path: ROUTE_PATHS.BASE.PROJECT.import.path,
        key: 'projectImport',
        element: <ImportProject />
      },
      {
        path: ROUTE_PATHS.BASE.PROJECT.batch_import.path,
        key: 'projectBatchImportDataSource',
        element: <ProjectBatchImportDataSource />
      }
    ]
  },
  // #endif

  {
    key: 'projectDetail',
    path: ROUTE_PATHS.BASE.PROJECT_DETAIL,
    element: <ProjectDetail />,
    children: [
      {
        path: ROUTE_PATHS.BASE.MEMBER.index.path,
        key: 'member',
        element: <Member />
      },
      {
        path: ROUTE_PATHS.BASE.DATA_SOURCE.index.path,
        key: 'dataSource',
        element: <DataSource />,
        children: [
          {
            index: true,
            element: <DataSourceList />,
            key: 'dataSourceList'
          },
          {
            path: ROUTE_PATHS.BASE.DATA_SOURCE.create.path,
            element: <AddDataSource />,
            key: 'dataSourceCreate'
          },
          {
            path: ROUTE_PATHS.BASE.DATA_SOURCE.update.path,
            element: <UpdateDataSource />,
            key: 'dataSourceUpdate'
          },
          // #if [ee]
          {
            path: ROUTE_PATHS.BASE.DATA_SOURCE.batch_import.path,
            element: <BatchImportDataSource />,
            key: 'batchImportDataSource'
          }
          // #endif
        ]
      },
      {
        path: ROUTE_PATHS.BASE.DATA_EXPORT.index.path,
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
            path: ROUTE_PATHS.BASE.DATA_EXPORT.create.path,
            element: <CreateExportTask />,
            key: 'CreateExportTask'
          },
          {
            path: ROUTE_PATHS.BASE.DATA_EXPORT.detail.path,
            element: <ExportTaskDetail />,
            key: 'ExportTaskDetail'
          }
        ]
        // #endif
      },
      {
        path: ROUTE_PATHS.BASE.CLOUD_BEAVER.index.path,
        key: 'cloudBeaver',
        element: <CloudBeaver />
      }
    ]
  }
];
