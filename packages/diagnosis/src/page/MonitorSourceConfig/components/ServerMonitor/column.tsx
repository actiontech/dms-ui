import {
  ActiontechTableColumn,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import { IViewServerReply } from '@actiontech/shared/lib/api/diagnosis/service/common';
import { t } from '../../../../locale';
import { ViewServerReplyStatusEnum } from '@actiontech/shared/lib/api/diagnosis/service/common.enum';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { Link } from 'react-router-dom';
import { MonitorSourceConfigTypeEnum } from '../../index.type';

const serverMonitorStatusDictionary = {
  [ViewServerReplyStatusEnum.healthy]: t('monitorSourceConfig.status.normal'),
  [ViewServerReplyStatusEnum.unhealthy]: t(
    'monitorSourceConfig.status.abnormal'
  ),
  [ViewServerReplyStatusEnum.unknown]: t('monitorSourceConfig.status.unknown')
};

export const ServerMonitorColumns = (
  projectId: string
): ActiontechTableColumn<IViewServerReply> => {
  return [
    {
      dataIndex: 'name',
      title: t('monitorSourceConfig.monitorSourceName'),
      render: (name, record) => (
        <Link
          to={`/diagnosis/project/${projectId}/${record?.name}/${record?.id}/${MonitorSourceConfigTypeEnum.server_monitor}/monitorConfigList`}
        >
          {name}
        </Link>
      )
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
        return serverMonitorStatusDictionary[
          status as ViewServerReplyStatusEnum
        ];
      }
    }
  ];
};

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
