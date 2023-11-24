import {
  ActiontechTableColumn,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import { IViewDatabaseReply } from '../../../../api/common';
import { t } from '../../../../locale';
import { ViewDatabaseReplyStatusEnum } from '../../../../api/common.enum';
import { Link } from 'react-router-dom';
import { MonitorSourceConfigTypeEnum } from '../../index.type';
import { formatTime } from '@actiontech/shared/lib/utils/Common';

const databaseMonitorStatusDictionary = {
  [ViewDatabaseReplyStatusEnum.healthy]: t('monitorSourceConfig.status.normal'),
  [ViewDatabaseReplyStatusEnum.unhealthy]: t(
    'monitorSourceConfig.status.abnormal'
  ),
  [ViewDatabaseReplyStatusEnum.unknown]: t('monitorSourceConfig.status.unknown')
};

export const DatabaseMonitorColumns =
  (): ActiontechTableColumn<IViewDatabaseReply> => [
    {
      dataIndex: 'monitor_name',
      title: t('monitorSourceConfig.monitorSourceName'),
      render: (name, record) => (
        <Link
          to={`/${record?.monitor_name}/${record?.id}/${MonitorSourceConfigTypeEnum.database_monitor}/monitorItemList`}
        >
          {name}
        </Link>
      )
    },
    {
      dataIndex: 'host',
      title: t('monitorSourceConfig.databaseMonitor.databaseIp')
    },
    {
      dataIndex: 'port',
      title: t('monitorSourceConfig.databaseMonitor.databasePort')
    },
    {
      dataIndex: 'db_type',
      title: t('monitorSourceConfig.databaseMonitor.databaseType')
    },
    {
      dataIndex: 'created_at',
      title: t('monitorSourceConfig.databaseMonitor.creationTime'),
      render: (time) => formatTime(time, '-')
    },
    {
      dataIndex: 'status',
      title: t('common.status'),
      render: (record: IViewDatabaseReply) => {
        if (!record.status) return '-';
        return databaseMonitorStatusDictionary[record.status];
      }
    }
  ];

export const DatabaseMonitorActions = (
  deleteDatabaseMonitor: (record?: IViewDatabaseReply) => void
): {
  buttons: ActiontechTableActionMeta<IViewDatabaseReply>[];
  width: number;
} => {
  return {
    width: 70,
    buttons: [
      {
        text: t('common.delete'),
        buttonProps: () => ({
          danger: true
        }),
        key: 'deleteDatabaseMonitor',
        confirm: (record) => {
          return {
            title: t(
              'monitorSourceConfig.databaseMonitor.deleteDatabaseMonitorSource',
              {
                name: record?.monitor_name
              }
            ),
            onConfirm: () => {
              deleteDatabaseMonitor(record);
            }
          };
        }
      }
    ]
  };
};
