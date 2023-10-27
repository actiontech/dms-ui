import {
  ActiontechTableColumn,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import { t } from '../../../../locale';

export const ServerMonitorColumns: ActiontechTableColumn<any> = [
  {
    dataIndex: 'user',
    title: t('monitorSourceConfig.monitorSourceName')
  },
  {
    dataIndex: 'user',
    title: t('monitorSourceConfig.serverMonitor.serverIp')
  },
  {
    dataIndex: 'user',
    title: t('monitorSourceConfig.serverMonitor.sshPort')
  },
  {
    dataIndex: 'user',
    title: t('monitorSourceConfig.serverMonitor.sshUser')
  },
  {
    dataIndex: 'user',
    title: t('monitorSourceConfig.serverMonitor.creationTime')
  },
  {
    dataIndex: 'user',
    title: t('common.status')
  }
];

export const ServerMonitorActions = (
  onEditServerMonitor: (record: any | undefined) => void
): ActiontechTableActionMeta<any>[] => [
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
