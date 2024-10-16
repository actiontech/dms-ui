import { useTranslation } from 'react-i18next';
import { ActionButton, PageHeader, SegmentedTabs } from '@actiontech/shared';
import { DataSourceManagerSegmentedKey } from './index.type';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Space } from 'antd';
import { TableRefreshButton } from '@actiontech/shared/lib/components/ActiontechTable';
import eventEmitter from '../../utils/EventEmitter';
import EmitterKey from '../../data/EmitterKey';
import GlobalDataSource from '../GlobalDataSource';
import SyncDataSource from '../SyncDataSource';
import { SegmentedTabsProps } from '@actiontech/shared/lib/components/SegmentedTabs/index.type';
import {
  PERMISSIONS,
  PermissionControl,
  PermissionsConstantType
} from '@actiontech/shared/lib/global';
import usePermission from '@actiontech/shared/lib/global/usePermission/usePermission';
import { PlusOutlined } from '@actiontech/icons';

const DataSourceManagement: React.FC = () => {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState(
    DataSourceManagerSegmentedKey.GlobalDataSource
  );

  const { checkPagePermission } = usePermission();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

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
    return (
      <>
        <PermissionControl
          permission={PERMISSIONS.ACTIONS.BASE.SYNC_DATA_SOURCE.ADD}
        >
          <ActionButton
            text={t('dmsSyncDataSource.syncTaskList.addSyncTask')}
            type="primary"
            icon={<PlusOutlined width={10} height={10} color="currentColor" />}
            hidden={activeKey !== DataSourceManagerSegmentedKey.SyncDataSource}
            actionType="navigate-link"
            link={{ to: `/sync-data-source/create` }}
          />
        </PermissionControl>
        <Space>
          <PermissionControl
            permission={
              PERMISSIONS.ACTIONS.BASE.GLOBAL_DATA_SOURCE.BATCH_IMPORT
            }
          >
            <ActionButton
              text={t('dmsGlobalDataSource.batchImportDataSource.buttonText')}
              hidden={
                activeKey !== DataSourceManagerSegmentedKey.GlobalDataSource
              }
              actionType="navigate-link"
              link={{ to: `/global-data-source/batch-import` }}
            />
          </PermissionControl>
          <PermissionControl
            permission={PERMISSIONS.ACTIONS.BASE.GLOBAL_DATA_SOURCE.ADD}
          >
            <ActionButton
              text={t('dmsGlobalDataSource.addDatabase')}
              type="primary"
              icon={
                <PlusOutlined width={10} height={10} color="currentColor" />
              }
              hidden={
                activeKey !== DataSourceManagerSegmentedKey.GlobalDataSource
              }
              actionType="navigate-link"
              link={{ to: `/global-data-source/create` }}
            />
          </PermissionControl>
        </Space>
      </>
    );
  };
  // #endif

  useEffect(() => {
    if (searchParams && searchParams.has('active')) {
      setActiveKey(searchParams.get('active') as DataSourceManagerSegmentedKey);
    }
  }, [searchParams]);

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
          navigate(
            {
              pathname: location.pathname,
              search: `active=${key}`
            },
            {
              replace: true
            }
          );
        }}
        items={tabItems}
      />
    </article>
  );
};

export default DataSourceManagement;
