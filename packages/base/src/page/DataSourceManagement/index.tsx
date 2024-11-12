import { useTranslation } from 'react-i18next';
import {
  PageHeader,
  SegmentedTabs,
  useTypedNavigate,
  useTypedQuery
} from '@actiontech/shared';
import { DataSourceManagerSegmentedKey } from './index.type';
import { useEffect, useMemo, useState } from 'react';
import { Space } from 'antd';
import { TableRefreshButton } from '@actiontech/shared/lib/components/ActiontechTable';
import eventEmitter from '../../utils/EventEmitter';
import EmitterKey from '../../data/EmitterKey';
import GlobalDataSource from '../GlobalDataSource';
import SyncDataSource from '../SyncDataSource';
import { SegmentedTabsProps } from '@actiontech/shared/lib/components/SegmentedTabs/index.type';
import {
  PERMISSIONS,
  PermissionsConstantType
} from '@actiontech/shared/lib/global';
import usePermission from '@actiontech/shared/lib/global/usePermission/usePermission';
import { DataSourceManagementPageHeaderActions } from './action';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

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
      SegmentedTabsProps['items'][0] & { permission: PermissionsConstantType }
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
  const renderExtra = () => {
    const pageHeaderActions = DataSourceManagementPageHeaderActions(activeKey);
    return (
      <>
        {pageHeaderActions['add_sync_task']}
        <Space>
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
            queries: { active: key },
            replace: true
          });
        }}
        items={tabItems}
      />
    </article>
  );
};

export default DataSourceManagement;
