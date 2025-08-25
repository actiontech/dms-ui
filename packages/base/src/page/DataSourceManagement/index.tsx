import { useTranslation } from 'react-i18next';
import {
  PageHeader,
  SegmentedTabs,
  SegmentedTabsProps
} from '@actiontech/dms-kit';
import { useTypedNavigate, useTypedQuery } from '@actiontech/shared';
import { DataSourceManagerSegmentedKey } from './index.type';
import { useEffect, useMemo, useState } from 'react';
import { Space } from 'antd';
import { TableRefreshButton } from '@actiontech/shared/lib/components/ActiontechTable';
import eventEmitter from '../../utils/EventEmitter';
import EmitterKey from '../../data/EmitterKey';
import GlobalDataSource from '../GlobalDataSource';
import SyncDataSource from '../SyncDataSource';
import {
  PERMISSIONS,
  PermissionsConstantType,
  usePermission
} from '@actiontech/shared/lib/features';
import { DataSourceManagementPageHeaderActions } from './action';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
const DataSourceManagement: React.FC = () => {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState(
    DataSourceManagerSegmentedKey.GlobalDataSource
  );
  const { checkPagePermission } = usePermission();
  const extractQuery = useTypedQuery();
  const navigate = useTypedNavigate();
  const onRefresh = () => {
    if (activeKey === DataSourceManagerSegmentedKey.GlobalDataSource) {
      eventEmitter.emit(EmitterKey.DMS_Refresh_Global_Data_Source);
    } else if (activeKey === DataSourceManagerSegmentedKey.SyncDataSource) {
      eventEmitter.emit(EmitterKey.DMS_Refresh_Sync_Data_Source);
    }
  };
  const tabItems = useMemo<SegmentedTabsProps['items']>(() => {
    const items: Array<
      SegmentedTabsProps['items'][0] & {
        permission: PermissionsConstantType;
      }
    > = [
      {
        label: t('dmsGlobalDataSource.pageTitle'),
        value: DataSourceManagerSegmentedKey.GlobalDataSource,
        children: <GlobalDataSource />,
        destroyInactivePane: true,
        permission: PERMISSIONS.PAGES.BASE.GLOBAL_DATA_SOURCE
      },
      {
        label: t('dmsSyncDataSource.pageTitle'),
        value: DataSourceManagerSegmentedKey.SyncDataSource,
        children: <SyncDataSource />,
        destroyInactivePane: true,
        permission: PERMISSIONS.PAGES.BASE.SYNC_DATA_SOURCE
      }
    ];
    return items.filter((item) => checkPagePermission(item.permission));
  }, [checkPagePermission, t]);

  // #if [ee]
  const onBatchTestConnection = () => {
    eventEmitter.emit(EmitterKey.DMS_Batch_Test_Data_Source_Connection);
  };
  const renderExtra = () => {
    const pageHeaderActions = DataSourceManagementPageHeaderActions(
      activeKey,
      onBatchTestConnection
    );
    return (
      <>
        {pageHeaderActions['add_sync_task']}
        <Space>
          {pageHeaderActions['batch_test_data_source_connection']}
          {pageHeaderActions['batch_import_db_service']}
          {pageHeaderActions['add_db_service']}
        </Space>
      </>
    );
  };
  // #endif

  useEffect(() => {
    const searchParams = extractQuery(
      ROUTE_PATHS.BASE.DATA_SOURCE_MANAGEMENT.index
    );
    if (searchParams && searchParams.active) {
      setActiveKey(searchParams.active as DataSourceManagerSegmentedKey);
    }
  }, [extractQuery]);
  return (
    <article>
      <PageHeader
        title={
          <Space>
            {t('dmsMenu.globalSettings.instanceManager')}
            {/* #if [ee] */}
            <TableRefreshButton refresh={onRefresh} />
            {/* #endif */}
          </Space>
        }
        // #if [ee]
        extra={renderExtra()}
        // #endif
      />

      <SegmentedTabs
        activeKey={activeKey}
        onChange={(key) => {
          setActiveKey(key);
          navigate(ROUTE_PATHS.BASE.DATA_SOURCE_MANAGEMENT.index, {
            queries: {
              active: key
            },
            replace: true
          });
        }}
        items={tabItems}
      />
    </article>
  );
};
export default DataSourceManagement;
