import {
  ActiontechTableColumn,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import { IViewMonitorConfigReply } from '../../../../api/common';
import { t } from '../../../../locale';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { MonitorSourceConfigTypeEnum } from '../../index.type';

export const monitorSourceDictionary = {
  [MonitorSourceConfigTypeEnum.server_monitor]: t(
    'monitorSourceConfig.sourceType.serverMonitorSource'
  ),
  [MonitorSourceConfigTypeEnum.database_monitor]: t(
    'monitorSourceConfig.sourceType.databaseMonitorSource'
  )
};

export const MonitorConfigColumns =
  (): ActiontechTableColumn<IViewMonitorConfigReply> => {
    return [
      {
        dataIndex: 'monitor_name',
        title: t('monitorSourceConfig.monitorConfig.monitorItem')
      },
      {
        dataIndex: 'interval',
        title: t('monitorSourceConfig.monitorConfig.monitorInterval')
      },
      {
        dataIndex: 'via',
        title: t('monitorSourceConfig.monitorConfig.monitorVia')
      },
      {
        dataIndex: 'desc',
        title: t('monitorSourceConfig.monitorConfig.monitorDesc')
      },
      {
        dataIndex: 'enable',
        title: t('common.status'),
        render: (status) => {
          if (!status) return '-';
          return status
            ? t('monitorSourceConfig.status.enable')
            : t('monitorSourceConfig.status.disable');
        }
      }
    ];
  };

export const MonitorConfigActions = (
  onCheckMonitorConfig: (record: IViewMonitorConfigReply | undefined) => void
): ActiontechTableActionMeta<IViewMonitorConfigReply>[] => [
  {
    text: t('monitorSourceConfig.monitorConfig.checkMonitorConfig'),
    key: 'checkMonitorConfig',
    buttonProps: (record) => {
      return {
        onClick: () => {
          onCheckMonitorConfig(record);
        }
      };
    }
  }
];
