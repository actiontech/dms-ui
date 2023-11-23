import { useState } from 'react';
import { SegmentedValue } from 'antd/es/segmented';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Space } from 'antd';
import {
  BasicButton,
  PageHeader,
  BasicSegmented,
  EmptyBox
} from '@actiontech/shared';
import { IconAdd } from '@actiontech/shared/lib/Icon';
import { MonitorSourceConfigStyleWrapper } from './style';
import { updateMonitorSourceConfigModalStatus } from '../../store/monitorSourceConfig';
import { ModalName } from '../../data/ModalName';
import { TableToolbar } from '@actiontech/shared/lib/components/ActiontechTable';
import EventEmitter from '../../utils/EventEmitter';
import EmitterKey from '../../data/EmitterKey';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { MonitorSourceConfigTypeEnum } from './index.type';
import ServerMonitor from './components/ServerMonitor';
import DatabaseMonitor from './components/DatabaseMonitor';

const MonitorSourceConfig: React.FC = () => {
  const { t } = useTranslation();

  const [searchServerValue, setSearchServerValue] = useState<string>();
  const [searchDatabaseValue, setSearchDatabaseValue] = useState<string>();

  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const dispatch = useDispatch();
  const { projectArchive } = useCurrentProject();

  const [listType, setListType] = useState<MonitorSourceConfigTypeEnum>(
    MonitorSourceConfigTypeEnum.server_monitor
  );

  const onChange = (key: SegmentedValue) => {
    setListType(key as MonitorSourceConfigTypeEnum);
    setSearchServerValue('');
    setSearchDatabaseValue('');
  };

  const onAddMonitorSource = (type: MonitorSourceConfigTypeEnum) => {
    const name =
      type === MonitorSourceConfigTypeEnum.server_monitor
        ? ModalName.Add_Server_Monitor
        : ModalName.Add_Database_Monitor;
    dispatch(
      updateMonitorSourceConfigModalStatus({
        modalName: name,
        status: true
      })
    );
  };

  const renderTable = () => {
    if (listType === MonitorSourceConfigTypeEnum.server_monitor) {
      return (
        <ServerMonitor
          setLoading={setTableLoading}
          searchValue={searchServerValue ?? ''}
        />
      );
    }
    return (
      <DatabaseMonitor
        setLoading={setTableLoading}
        searchValue={searchDatabaseValue ?? ''}
      />
    );
  };

  const onRefreshTable = () => {
    if (listType === MonitorSourceConfigTypeEnum.server_monitor) {
      EventEmitter.emit(EmitterKey.Refresh_Server_Monitor);
      return;
    }
    EventEmitter.emit(EmitterKey.Refresh_Database_Monitor);
  };

  return (
    <MonitorSourceConfigStyleWrapper>
      <PageHeader
        title={<Space size={12}>{t('monitorSourceConfig.title')}</Space>}
        extra={
          <EmptyBox if={!projectArchive}>
            <Space size={12}>
              <BasicButton
                onClick={() => onAddMonitorSource(listType)}
                type="primary"
                icon={<IconAdd />}
              >
                {listType === MonitorSourceConfigTypeEnum.server_monitor
                  ? t(
                      'monitorSourceConfig.serverMonitor.addServerMonitorSource'
                    )
                  : t(
                      'monitorSourceConfig.databaseMonitor.addDatabaseMonitorSource'
                    )}
              </BasicButton>
            </Space>
          </EmptyBox>
        }
      />
      <TableToolbar
        refreshButton={{ refresh: onRefreshTable, disabled: tableLoading }}
        searchInput={
          listType === MonitorSourceConfigTypeEnum.server_monitor
            ? {
                placeholder: t(
                  'common.actiontechTable.searchInput.placeholder'
                ),
                onSearch: (value) => {
                  setSearchServerValue(value);
                }
              }
            : {
                placeholder: t(
                  'common.actiontechTable.searchInput.placeholder'
                ),
                onSearch: (value) => {
                  setSearchDatabaseValue(value);
                }
              }
        }
      >
        <BasicSegmented
          value={listType}
          onChange={onChange}
          options={[
            {
              value: MonitorSourceConfigTypeEnum.server_monitor,
              label: t('monitorSourceConfig.serverMonitor.serverMonitorSource')
            },
            {
              value: MonitorSourceConfigTypeEnum.database_monitor,
              label: t(
                'monitorSourceConfig.databaseMonitor.databaseMonitorSource'
              )
            }
          ]}
        />
      </TableToolbar>
      {renderTable()}
    </MonitorSourceConfigStyleWrapper>
  );
};

export default MonitorSourceConfig;
