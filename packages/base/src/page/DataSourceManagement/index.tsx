import { useTranslation } from 'react-i18next';
import {
  BasicButton,
  EmptyBox,
  PageHeader,
  SegmentedTabs
} from '@actiontech/shared';
import { DataSourceManagerSegmentedKey } from './index.type';
import { useEffect, useMemo, useState } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams
} from 'react-router-dom';
import { Space } from 'antd';
import { TableRefreshButton } from '@actiontech/shared/lib/components/ActiontechTable';
import eventEmitter from '../../utils/EventEmitter';
import EmitterKey from '../../data/EmitterKey';
import useCurrentUser from '@actiontech/shared/lib/global/useCurrentUser';
import { PlusOutlined } from '@actiontech/icons/src/outlined';
import GlobalDataSource from '../GlobalDataSource';
import SyncDataSource from '../SyncDataSource';
import { SegmentedTabsProps } from '@actiontech/shared/lib/components/SegmentedTabs/index.type';

const DataSourceManagement: React.FC = () => {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState(
    DataSourceManagerSegmentedKey.GlobalDataSource
  );

  const { isAdmin, isCertainProjectManager, hasGlobalViewingPermission } =
    useCurrentUser();

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
    const globalDataSourceItem: SegmentedTabsProps['items'][0] = {
      label: t('dmsGlobalDataSource.pageTitle'),
      value: DataSourceManagerSegmentedKey.GlobalDataSource,
      children: <GlobalDataSource />,
      destroyInactivePane: true
    };
    if (isAdmin || hasGlobalViewingPermission) {
      return [
        globalDataSourceItem,
        {
          label: t('dmsSyncDataSource.pageTitle'),
          value: DataSourceManagerSegmentedKey.SyncDataSource,
          children: <SyncDataSource />,
          destroyInactivePane: true
        }
      ];
    }

    if (isCertainProjectManager) {
      return [globalDataSourceItem];
    }

    return [];
  }, [hasGlobalViewingPermission, isAdmin, isCertainProjectManager, t]);

  // #if [ee]
  const renderExtra = () => {
    if (activeKey === DataSourceManagerSegmentedKey.SyncDataSource) {
      return (
        <EmptyBox if={isAdmin}>
          <Link to={`/sync-data-source/create`}>
            <BasicButton
              type="primary"
              icon={
                <PlusOutlined width={10} height={10} color="currentColor" />
              }
            >
              {t('dmsSyncDataSource.syncTaskList.addSyncTask')}
            </BasicButton>
          </Link>
        </EmptyBox>
      );
    }

    if (activeKey === DataSourceManagerSegmentedKey.GlobalDataSource) {
      return (
        <EmptyBox if={isAdmin || isCertainProjectManager}>
          <Space>
            <Link to={`/global-data-source/batch-import`}>
              <BasicButton>
                {t('dmsGlobalDataSource.batchImportDataSource.buttonText')}
              </BasicButton>
            </Link>
            <Link to={`/global-data-source/create`}>
              <BasicButton
                type="primary"
                icon={
                  <PlusOutlined width={10} height={10} color="currentColor" />
                }
              >
                {t('dmsGlobalDataSource.addDatabase')}
              </BasicButton>
            </Link>
          </Space>
        </EmptyBox>
      );
    }
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
