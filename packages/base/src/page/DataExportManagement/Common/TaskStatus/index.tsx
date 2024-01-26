import { GetDataExportTaskStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import {
  IconOrderStatusIsExecuting,
  IconOrderStatusIsFailed,
  IconOrderStatusIsFinished
} from 'sqle/src/icon/Order';
import { t } from '../../../../locale';
import { StatusStyleWrapper } from '../style';

const taskStatusMap = () => {
  return new Map<GetDataExportTaskStatusEnum, React.ReactNode>([
    [
      GetDataExportTaskStatusEnum.exporting,
      <>
        <IconOrderStatusIsExecuting />
        <span>{t('dmsDataExport.status.exporting')}</span>
      </>
    ],
    [
      GetDataExportTaskStatusEnum.failed,
      <>
        <IconOrderStatusIsFailed />
        <span>{t('dmsDataExport.status.export_failed')}</span>
      </>
    ],
    [
      GetDataExportTaskStatusEnum.finish,
      <>
        <IconOrderStatusIsFinished />
        <span>{t('dmsDataExport.status.finished')}</span>
      </>
    ],
    [
      GetDataExportTaskStatusEnum.init,
      <>
        <IconOrderStatusIsExecuting />
        <span>{t('dmsDataExport.status.wait_for_export')}</span>
      </>
    ]
  ]);
};

const ExportTaskStatus: React.FC<{ status?: GetDataExportTaskStatusEnum }> = ({
  status
}) => {
  return (
    <>
      {status ? (
        <StatusStyleWrapper>{taskStatusMap().get(status)}</StatusStyleWrapper>
      ) : (
        'unknown'
      )}
    </>
  );
};

export default ExportTaskStatus;
