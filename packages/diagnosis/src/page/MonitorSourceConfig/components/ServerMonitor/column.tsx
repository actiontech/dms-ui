import {
  ActiontechTableColumn,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import { IViewServerReply } from '../../../../api/common';
import { t } from '../../../../locale';
import { ViewServerReplyStatusEnum } from '../../../../api/common.enum';
import { formatTime } from '@actiontech/shared/lib/utils/Common';

const serverMonitorStatusDictionary = {
  [ViewServerReplyStatusEnum.healthy]: t('monitorSourceConfig.status.normal'),
  [ViewServerReplyStatusEnum.unhealthy]: t(
    'monitorSourceConfig.status.abnormal'
  ),
  [ViewServerReplyStatusEnum.unknown]: t('monitorSourceConfig.status.unknown')
};

export const ServerMonitorColumns: ActiontechTableColumn<IViewServerReply> = [
  {
    dataIndex: 'name',
    title: t('monitorSourceConfig.monitorSourceName')
  },
  {
    dataIndex: 'host',
    title: t('monitorSourceConfig.serverMonitor.serverIp')
  },
  {
    dataIndex: 'port',
    title: t('monitorSourceConfig.serverMonitor.sshPort')
  },
  {
    dataIndex: 'user',
    title: t('monitorSourceConfig.serverMonitor.sshUser')
  },
  {
    dataIndex: 'created_at',
    title: t('monitorSourceConfig.serverMonitor.creationTime'),
    render: (time) => formatTime(time, '-')
  },
  {
    dataIndex: 'status',
    title: t('common.status'),
    render: (status) => {
      if (!status) return '-';
      return serverMonitorStatusDictionary[status as ViewServerReplyStatusEnum];
    }
  }
];

export const ServerMonitorActions = (
  onEditServerMonitor: (record: IViewServerReply | undefined) => void
): ActiontechTableActionMeta<IViewServerReply>[] => [
  {
    text: t('common.edit'),
    key: 'editServerMonitor',
    buttonProps: (record) => {
      return {
        onClick: () => {
          onEditServerMonitor(record);
        }
      };
    }
  }
];
