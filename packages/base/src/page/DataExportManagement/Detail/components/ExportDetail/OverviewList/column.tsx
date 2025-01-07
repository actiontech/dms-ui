import { IGetDataExportTask } from '@actiontech/shared/lib/api/base/service/common';
import {
  ActiontechTableColumn,
  ActiontechTableProps
} from '@actiontech/shared/lib/components/ActiontechTable';
import { t } from '../../../../../../locale';
import ExportTaskStatus from '../../../../Common/TaskStatus';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import dayjs from 'dayjs';
import { GetDataExportTaskStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { BasicToolTip } from '@actiontech/shared';
import { InfoCircleOutlined } from '@actiontech/icons';

export const OverviewListColumn: () => ActiontechTableColumn<
  IGetDataExportTask,
  unknown,
  'db_service'
> = () => {
  return [
    {
      dataIndex: 'db_service',
      title: () =>
        t('dmsDataExport.detail.exportResult.overview.column.dbService'),
      render: (_, record) => {
        return record.db_info?.name ?? '-';
      }
    },
    {
      dataIndex: 'status',
      title: () =>
        t('dmsDataExport.detail.exportResult.overview.column.status'),
      render: (status) => {
        return <ExportTaskStatus status={status} />;
      }
    },
    {
      dataIndex: 'export_type',
      title: () =>
        t('dmsDataExport.detail.exportResult.overview.column.exportType'),
      render: (type) => type ?? '-'
    },
    {
      dataIndex: 'export_file_type',
      title: () =>
        t('dmsDataExport.detail.exportResult.overview.column.exportFileType'),
      render: (type) => type ?? '-'
    },
    {
      dataIndex: 'export_start_time',
      title: () =>
        t('dmsDataExport.detail.exportResult.overview.column.exportStartTime'),
      render: (time) => formatTime(time, '-')
    },
    {
      dataIndex: 'export_end_time',
      title: () =>
        t('dmsDataExport.detail.exportResult.overview.column.exportEndTime'),
      render: (time) => formatTime(time, '-')
    }
  ];
};

const checkExportTimeHasExpired = (startTime?: string, timeout = 24) => {
  if (!startTime || !dayjs(startTime)) {
    return true;
  }
  return dayjs().isAfter(dayjs(startTime).add(timeout, 'hour'));
};

export const OverviewListAction: (
  downloadLoading: boolean,
  downloadAction: (taskID: string) => void
) => ActiontechTableProps<IGetDataExportTask>['actions'] = (
  downloadLoading,
  downloadAction
) => {
  return {
    title: () => (
      <>
        <BasicToolTip
          title={t(
            'dmsDataExport.detail.exportResult.overview.column.action.downloadTips'
          )}
          suffixIcon={<InfoCircleOutlined width={14} height={14} />}
        >
          {t('common.operate')}
        </BasicToolTip>
      </>
    ),
    buttons: [
      {
        key: 'download',
        text: t(
          'dmsDataExport.detail.exportResult.overview.column.action.download'
        ),
        buttonProps(record) {
          return {
            loading: downloadLoading,
            disabled:
              record?.status !== GetDataExportTaskStatusEnum.finish ||
              checkExportTimeHasExpired(record?.export_end_time),
            onClick: () => {
              downloadAction(record?.task_uid ?? '');
            }
          };
        }
      }
    ]
  };
};
