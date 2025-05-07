// @warn/cli/create-dms-page
import { PERMISSIONS } from '@actiontech/shared/lib/features';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { RouterConfigItem } from '@actiontech/shared/lib/types/common.type';
import React from 'react';
import { PROJECT_ROUTER_PARAM } from '@actiontech/shared/lib/data/common';

// #if [ee]
const Project = React.lazy(() => import('../page/Project'));
const ImportProject = React.lazy(() => import('../page/Project/ImportProject'));
const ProjectBatchImportDataSource = React.lazy(
  () => import('../page/Project/BatchImportDataSource')
);

const ExportTaskList = React.lazy(
  () => import('../page/DataExportManagement/List')
);
const CreateExportTask = React.lazy(
  () => import('../page/DataExportManagement/Create')
);
const ExportTaskDetail = React.lazy(
  () => import('../page/DataExportManagement/Detail')
);

const AddSyncTask = React.lazy(() => import('../page/SyncDataSource/AddPage'));
const UpdateSyncTask = React.lazy(
  () => import('../page/SyncDataSource/UpdatePage')
);
const BatchImportDataSource = React.lazy(
  () => import('../page/DataSource/components/BatchImportDataSource')
);

const GlobalBatchImportDataSource = React.lazy(
  () => import('../page/GlobalDataSource/BatchImportDataSource')
);
const GlobalAddDataSource = React.lazy(
  () => import('../page/DataSource/components/AddDataSource')
);

const ResourceOverview = React.lazy(() => import('../page/ResourceOverview'));

const AvailabilityZoneList = React.lazy(
  () => import('../page/AvailabilityZone/List')
);
// #endif

const Home = React.lazy(() => import('../page/Home'));
const UserCenter = React.lazy(() => import('../page/UserCenter'));
const DataSource = React.lazy(() => import('../page/DataSource'));
const AddDataSource = React.lazy(
  () => import('../page/DataSource/components/AddDataSource')
);
const UpdateDataSource = React.lazy(
  () => import('../page/DataSource/components/UpdateDataSource')
);
const DataSourceList = React.lazy(
  () => import('../page/DataSource/components/List')
);

const Member = React.lazy(() => import('../page/Member'));
const System = React.lazy(() => import('../page/System'));

const CloudBeaver = React.lazy(() => import('../page/CloudBeaver'));
const Account = React.lazy(() => import('../page/Account'));
const ExportTaskManagement = React.lazy(
  () => import('../page/DataExportManagement')
);
const DataSourceManagement = React.lazy(
  () => import('../page/DataSourceManagement')
);
const DataMaskRuleOverview = React.lazy(
  () => import('../page/DataMaskRuleOverview')
);

const Transit = React.lazy(() => import('../page/Transit'));

/**
 * 默认所有页面（除了login和bind user外）都需要可用区验证，（当配置了可用区时，如果没有选择当前可用区，则显示可用区选择弹窗，阻塞页面跳转）
 * 如果页面不需要可用区验证，则在此处添加，将不会进行可用区验证
 */
export const BaseNoZoneRequiredRouterConfig: RouterConfigItem[] = [
  {
    path: ROUTE_PATHS.BASE.HOME,
    key: 'home',
    element: <Home />
  },
  // #if [ee]
  {
    path: ROUTE_PATHS.BASE.AVAILABILITY_ZONE,
    key: 'availabilityZone',
    element: <AvailabilityZoneList />
  }
  // #endif
];

export const BaseGlobalRouterConfig: RouterConfigItem[] = [
  {
    path: ROUTE_PATHS.BASE.USER_CENTER,
    key: 'userCenter',
    element: <UserCenter />,
    permission: PERMISSIONS.PAGES.BASE.USER_CENTER
  },
  {
    path: ROUTE_PATHS.BASE.SYSTEM.index.path,
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
    path: ROUTE_PATHS.BASE.TRANSIT.index.path,
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
  {
    path: ROUTE_PATHS.BASE.RESOURCE_OVERVIEW,
    key: 'resourceOverview',
    element: <ResourceOverview />,
    permission: PERMISSIONS.PAGES.BASE.RESOURCE_OVERVIEW
  }
  // #endif
];

export const BaseProjectRouterConfig: RouterConfigItem[] = [
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
  },
  // #if [dms]
  {
    path: `${PROJECT_ROUTER_PARAM}/data-mask-rule-overview`,
    key: 'dataMaskRuleOverview',
    element: <DataMaskRuleOverview />
  }
  // #endif
];
