import { PROJECT_ROUTER_PARAM } from '@actiontech/shared/lib/data/common';
import { SystemRole } from '@actiontech/shared/lib/enum';
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

const SyncTaskList = lazy(() => import('../page/SyncDataSource/List'));
const AddSyncTask = lazy(() => import('../page/SyncDataSource/AddPage'));
const UpdateSyncTask = lazy(() => import('../page/SyncDataSource/UpdatePage'));
const BatchImportDataSource = lazy(
  () => import('../page/DataSource/components/BatchImportDataSource')
);
const GlobalDataSourceList = lazy(
  () => import('../page/GlobalDataSource/List')
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
const GlobalDataSource = lazy(() => import('../page/GlobalDataSource'));

const CloudBeaver = lazy(() => import('../page/CloudBeaver'));
const SyncDataSource = lazy(() => import('../page/SyncDataSource'));
const Account = lazy(() => import('../page/Account'));
const ExportTaskManagement = lazy(() => import('../page/DataExportManagement'));
const DataMaskRuleOverview = lazy(() => import('../page/DataMaskRuleOverview'));

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
    role: [SystemRole.admin]
  },
  {
    path: 'system',
    key: 'system',
    element: <System />,
    role: [SystemRole.admin]
  },
  {
    path: 'account',
    hideInMenu: true,
    key: 'account',
    element: <Account />
  },
  {
    path: 'global-data-source',
    key: 'globalDataSource',
    element: <GlobalDataSource />,
    role: [SystemRole.admin, SystemRole.certainProjectManager],
    // #if [ee]
    children: [
      {
        index: true,
        key: 'globalDataSourceList',
        element: <GlobalDataSourceList />
      },
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
    // #endif
  },
  // #if [ee]
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
        path: `${PROJECT_ROUTER_PARAM}/sync-data-source`,
        label: 'menu.syncDataSource',
        key: 'syncDataSource',
        element: <SyncDataSource />,
        // #if [ee]
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
        // #endif
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
      },
      // #if [dms]
      {
        path: `${PROJECT_ROUTER_PARAM}/data-mask-rule-overview`,
        key: 'dataMaskRuleOverview',
        label: 'dataMaskRuleOverview.list.title',
        element: <DataMaskRuleOverview />
      }
      // #endif
    ] as RouterConfigItem[]
  }
];
