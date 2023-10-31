import {
  ActiontechTableColumn,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import { IViewDatabaseReply } from '@actiontech/shared/lib/api/diagnosis/service/common';
import { t } from '../../../../locale';
import { ViewDatabaseReplyStatusEnum } from '@actiontech/shared/lib/api/diagnosis/service/common.enum';

const databaseMonitorStatusDictionary = {
  [ViewDatabaseReplyStatusEnum.healthy]: t('monitorSourceConfig.status.normal'),
  [ViewDatabaseReplyStatusEnum.unhealthy]: t(
    'monitorSourceConfig.status.abnormal'
  ),
  [ViewDatabaseReplyStatusEnum.unknown]: t('monitorSourceConfig.status.unknown')
};

export const DatabaseMonitorColumns: ActiontechTableColumn<IViewDatabaseReply> =
  [
    {
      dataIndex: 'monitor_name',
      title: t('monitorSourceConfig.monitorSourceName')
    },
    {
      dataIndex: 'datasource_name',
      title: t('monitorSourceConfig.databaseMonitor.dataSourceName')
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
      dataIndex: 'createdAt',
      title: t('monitorSourceConfig.databaseMonitor.creationTime')
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
  onEditDatabaseMonitor: (record: IViewDatabaseReply | undefined) => void
): ActiontechTableActionMeta<IViewDatabaseReply>[] => [
  {
    text: t('common.edit'),
    key: 'editDatabaseMonitor',
    buttonProps: (record) => {
      return {
        onClick: () => {
          onEditDatabaseMonitor(record);
        }
      };
    }
  }
];
