import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import { t } from '../../../../../../../locale';

export const CheckMonitorConfigColumns: ActiontechTableColumn<{
  desc?: string;
  metric_key?: string;
}> = [
  {
    dataIndex: 'metric_key',
    title: t('monitorSourceConfig.monitorConfig.monitorKey')
  },
  {
    dataIndex: 'desc',
    title: t('monitorSourceConfig.monitorConfig.monitorDesc')
  }
];
