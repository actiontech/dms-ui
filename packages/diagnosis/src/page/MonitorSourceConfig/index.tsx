import { useEffect, useState } from 'react';
import { SegmentedValue } from 'antd/es/segmented';
import { useTranslation } from 'react-i18next';
import { Space } from 'antd';
import { BasicButton, PageHeader } from '@actiontech/shared';
import { IconAdd } from '@actiontech/shared/lib/Icon';
import { ModalName } from '../../data/ModalName';
import EventEmitter from '../../utils/EventEmitter';
import EmitterKey from '../../data/EmitterKey';
import { MonitorSourceConfigTypeEnum } from './index.type';
import ServerMonitor from './components/ServerMonitor';
import DatabaseMonitor from './components/DatabaseMonitor';
import useMonitorSourceConfigRedux from './hooks/useMonitorSourceConfigRedux';
import {
  BasicSegmentedPage,
  useSegmentedPageParams
} from '@actiontech/shared/lib/components/BasicSegmentedPage';

const MonitorSourceConfig: React.FC = () => {
  const { t } = useTranslation();

  const [searchServerValue, setSearchServerValue] = useState<string>();
  const [searchDatabaseValue, setSearchDatabaseValue] = useState<string>();

  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const { setModalStatus } = useMonitorSourceConfigRedux();

  const {
    updateSegmentedPageData,
    renderExtraButton,
    onChange,
    value,
    ...otherProps
  } = useSegmentedPageParams<MonitorSourceConfigTypeEnum>();

  useEffect(() => {
    const onClick = (modalName: ModalName) => {
      setModalStatus(modalName, true);
    };

    updateSegmentedPageData([
      {
        value: MonitorSourceConfigTypeEnum.server_monitor,
        label: t('monitorSourceConfig.serverMonitor.serverMonitorSource'),
        content: (
          <ServerMonitor
            setLoading={setTableLoading}
            searchValue={searchServerValue ?? ''}
          />
        ),
        extraButton: (
          <BasicButton
            type="primary"
            icon={<IconAdd />}
            onClick={() => {
              onClick(ModalName.Add_Server_Monitor);
            }}
          >
            {t('monitorSourceConfig.serverMonitor.addServerMonitorSource')}
          </BasicButton>
        )
      },
      {
        value: MonitorSourceConfigTypeEnum.database_monitor,
        label: t('monitorSourceConfig.databaseMonitor.databaseMonitorSource'),
        content: (
          <DatabaseMonitor
            setLoading={setTableLoading}
            searchValue={searchDatabaseValue ?? ''}
          />
        ),
        extraButton: (
          <BasicButton
            type="primary"
            icon={<IconAdd />}
            onClick={() => {
              onClick(ModalName.Add_Database_Monitor);
            }}
          >
            {t('monitorSourceConfig.databaseMonitor.addDatabaseMonitorSource')}
          </BasicButton>
        )
      }
    ]);
  }, [updateSegmentedPageData, t, searchServerValue, searchDatabaseValue]);

  const onChangeListType = (key: SegmentedValue) => {
    onChange(key as MonitorSourceConfigTypeEnum);
    setSearchServerValue('');
    setSearchDatabaseValue('');
  };

  const onRefreshTable = () => {
    EventEmitter.emit(EmitterKey.Refresh_Monitor_Source_Config);
  };

  return (
    <section>
      <PageHeader
        title={<Space size={12}>{t('monitorSourceConfig.title')}</Space>}
        extra={renderExtraButton()}
      />
      <BasicSegmentedPage
        {...otherProps}
        refreshButton={{ refresh: onRefreshTable, disabled: tableLoading }}
        value={value}
        onChange={onChangeListType}
        searchInput={
          value === MonitorSourceConfigTypeEnum.server_monitor
            ? {
                placeholder: t(
                  'common.actiontechTable.searchInput.placeholder'
                ),
                onChange: setSearchServerValue,
                onSearch: onRefreshTable,
                value: searchServerValue
              }
            : {
                placeholder: t(
                  'common.actiontechTable.searchInput.placeholder'
                ),
                onChange: setSearchDatabaseValue,
                onSearch: onRefreshTable,
                value: searchDatabaseValue
              }
        }
      />
    </section>
  );
};

export default MonitorSourceConfig;
