import { GetDataExportTaskStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import {
  IconWorkflowStatusIsExecuting,
  IconWorkflowStatusIsFailed,
  IconWorkflowStatusIsFinished
} from 'sqle/src/icon/SqlExecWorkflow';
import { t } from '../../../../locale';
import { StatusStyleWrapper } from '../style';
import { IconDelete } from '@actiontech/shared/lib/Icon/common';

const taskStatusMap = () => {
  return new Map<GetDataExportTaskStatusEnum, React.ReactNode>([
    [
      GetDataExportTaskStatusEnum.exporting,
      <>
        <IconWorkflowStatusIsExecuting />
        <span>{t('dmsDataExport.status.exporting')}</span>
      </>
    ],
    [
      GetDataExportTaskStatusEnum.failed,
      <>
        <IconWorkflowStatusIsFailed />
        <span>{t('dmsDataExport.status.export_failed')}</span>
      </>
    ],
    [
      GetDataExportTaskStatusEnum.finish,
      <>
        <IconWorkflowStatusIsFinished />
        <span>{t('dmsDataExport.status.finished')}</span>
      </>
    ],
    [
      GetDataExportTaskStatusEnum.init,
      <>
        <IconWorkflowStatusIsExecuting />
        <span>{t('dmsDataExport.status.wait_for_export')}</span>
      </>
    ],
    [
      GetDataExportTaskStatusEnum.file_deleted,
      <>
        <IconDelete />
        <span>{t('dmsDataExport.status.file_deleted')}</span>
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
