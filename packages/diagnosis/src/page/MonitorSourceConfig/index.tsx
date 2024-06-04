import { useMemo, useState } from 'react';
import { SegmentedValue } from 'antd/es/segmented';
import { useTranslation } from 'react-i18next';
import { Space } from 'antd';
import {
  BasicButton,
  EmptyBox,
  PageHeader,
  SegmentedTabs
} from '@actiontech/shared';
import { IconAdd } from '@actiontech/shared/lib/Icon';
import { ModalName } from '../../data/ModalName';
import EventEmitter from '../../utils/EventEmitter';
import EmitterKey from '../../data/EmitterKey';
import { MonitorSourceConfigTypeEnum } from './index.type';
import ServerMonitor from './components/ServerMonitor';
import DatabaseMonitor from './components/DatabaseMonitor';
import useMonitorSourceConfigRedux from './hooks/useMonitorSourceConfigRedux';
import useCurrentUser from '../../hooks/useCurrentUser';
import RefreshButton from '@actiontech/shared/lib/components/ActiontechTable/components/RefreshButton';
import { AdminRolePermission } from '../../data/enum';
import { SearchInput } from '@actiontech/shared/lib/components/ActiontechTable';

const MonitorSourceConfig: React.FC = () => {
  const { t } = useTranslation();

  const { hasActionPermission } = useCurrentUser();

  const [searchServerValue, setSearchServerValue] = useState<string>();
  const [searchDatabaseValue, setSearchDatabaseValue] = useState<string>();

  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const { setModalStatus } = useMonitorSourceConfigRedux();

  const [activeTab, setActiveTab] = useState(
    MonitorSourceConfigTypeEnum.server_monitor
  );

  const handleClick = (modalName: ModalName) => {
    setModalStatus(modalName, true);
  };

  const onChangeListType = (key: SegmentedValue) => {
    setActiveTab(key as MonitorSourceConfigTypeEnum);
    setSearchServerValue('');
    setSearchDatabaseValue('');
  };

  const onRefreshTable = () => {
    EventEmitter.emit(EmitterKey.Refresh_Monitor_Source_Config);
  };

  const renderExtraButton = () => {
    if (activeTab === MonitorSourceConfigTypeEnum.server_monitor) {
      return (
        <EmptyBox
          if={hasActionPermission(AdminRolePermission.AddServer)}
          key={AdminRolePermission.AddServer}
        >
          <BasicButton
            type="primary"
            icon={<IconAdd />}
            onClick={() => {
              handleClick(ModalName.Add_Server_Monitor);
            }}
          >
            {t('monitorSourceConfig.serverMonitor.addServerMonitorSource')}
          </BasicButton>
        </EmptyBox>
      );
    }

    if (activeTab === MonitorSourceConfigTypeEnum.database_monitor) {
      return (
        <EmptyBox
          if={hasActionPermission(AdminRolePermission.AddDB)}
          key={AdminRolePermission.AddDB}
        >
          <BasicButton
            type="primary"
            icon={<IconAdd />}
            onClick={() => {
              handleClick(ModalName.Add_Database_Monitor);
            }}
          >
            {t('monitorSourceConfig.databaseMonitor.addDatabaseMonitorSource')}
          </BasicButton>
        </EmptyBox>
      );
    }
  };

  const searchInputProps = useMemo(() => {
    return activeTab === MonitorSourceConfigTypeEnum.server_monitor
      ? {
          placeholder: t('common.actiontechTable.searchInput.placeholder'),
          onChange: setSearchServerValue,
          onSearch: onRefreshTable,
          value: searchServerValue
        }
      : {
          placeholder: t('common.actiontechTable.searchInput.placeholder'),
          onChange: setSearchDatabaseValue,
          onSearch: onRefreshTable,
          value: searchDatabaseValue
        };
  }, [activeTab, searchDatabaseValue, searchServerValue, t]);

  return (
    <section>
      <PageHeader
        title={<Space size={12}>{t('monitorSourceConfig.title')}</Space>}
        extra={renderExtraButton()}
      />

      <SegmentedTabs
        segmentedRowExtraContent={
          // todo 样式问题需要去修改 SegmentedTabs，等 dms-ui 调整后同步到 dms-ui-ee 后再调整
          <Space style={{ marginLeft: 12 }} className="flex-space-between ">
            <SearchInput {...searchInputProps} />
            <RefreshButton
              refresh={onRefreshTable}
              loading={tableLoading}
              disabled={tableLoading}
            />
          </Space>
        }
        items={[
          {
            value: MonitorSourceConfigTypeEnum.server_monitor,
            label: t('monitorSourceConfig.serverMonitor.serverMonitorSource'),
            destroyInactivePane: true,
            children: (
              <ServerMonitor
                setLoading={setTableLoading}
                searchValue={searchServerValue ?? ''}
              />
            )
          },
          {
            value: MonitorSourceConfigTypeEnum.database_monitor,
            label: t(
              'monitorSourceConfig.databaseMonitor.databaseMonitorSource'
            ),
            destroyInactivePane: true,
            children: (
              <DatabaseMonitor
                setLoading={setTableLoading}
                searchValue={searchDatabaseValue ?? ''}
              />
            )
          }
        ]}
        activeKey={activeTab}
        onChange={onChangeListType}
      />
    </section>
  );
};

export default MonitorSourceConfig;
