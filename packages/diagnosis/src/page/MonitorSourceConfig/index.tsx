import { useState } from 'react';
import { SegmentedValue } from 'antd5/es/segmented';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
// import MemberModal from './Modal';
import { Space } from 'antd5';
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
import {
  TableToolbar,
  TableRefreshButton
} from '@actiontech/shared/lib/components/ActiontechTable';
import EventEmitter from '../../utils/EventEmitter';
import EmitterKey from '../../data/EmitterKey';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { MonitorSourceConfigTypeEnum } from './index.type';
import ServerMonitor from './components/ServerMonitor';

const MonitorSourceConfig: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { projectArchive } = useCurrentProject();

  const [listType, setListType] = useState<MonitorSourceConfigTypeEnum>(
    MonitorSourceConfigTypeEnum.server_monitor
  );

  const onChange = (key: SegmentedValue) => {
    setListType(key as MonitorSourceConfigTypeEnum);
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
      return <ServerMonitor />;
    }
    return <>数据库监控</>;
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
        title={
          <Space size={12}>
            {t('monitorSourceConfig.title')}
            <TableRefreshButton refresh={onRefreshTable} />
          </Space>
        }
        extra={
          <EmptyBox if={!projectArchive}>
            <Space size={12}>
              <BasicButton
                onClick={() => onAddMonitorSource(listType)}
                type="primary"
                icon={<IconAdd />}
              >
                {t('monitorSourceConfig.addMonitorSource')}
              </BasicButton>
            </Space>
          </EmptyBox>
        }
      />
      <TableToolbar>
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
      {/* <MemberModal /> */}
    </MonitorSourceConfigStyleWrapper>
  );
};

export default MonitorSourceConfig;
