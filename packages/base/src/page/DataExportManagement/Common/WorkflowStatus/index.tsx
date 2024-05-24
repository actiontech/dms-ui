import { ListDataExportWorkflowStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { t } from '../../../../locale';
import { StatusStyleWrapper } from '../style';
import {
  IconWorkflowStatusIsCanceled,
  IconWorkflowStatusIsExecuting,
  IconWorkflowStatusIsFailed,
  IconWorkflowStatusIsFinished,
  IconWorkflowStatusIsRejected,
  IconWorkflowStatusIsWaitAudit,
  IconWorkflowStatusIsWaitExecution
} from 'sqle/src/icon/SqlExecWorkflow';

const workflowStatusMap = () => {
  return new Map<ListDataExportWorkflowStatusEnum, React.ReactNode>([
    [
      ListDataExportWorkflowStatusEnum.cancel,
      <>
        <IconWorkflowStatusIsCanceled />
        <span>{t('dmsDataExport.status.canceled')}</span>
      </>
    ],
    [
      ListDataExportWorkflowStatusEnum.exporting,
      <>
        <IconWorkflowStatusIsExecuting />
        <span>{t('dmsDataExport.status.exporting')}</span>
      </>
    ],
    [
      ListDataExportWorkflowStatusEnum.finish,
      <>
        <IconWorkflowStatusIsFinished />
        <span>{t('dmsDataExport.status.finished')}</span>
      </>
    ],
    [
      ListDataExportWorkflowStatusEnum.wait_for_export,
      <>
        <IconWorkflowStatusIsWaitExecution />
        <span>{t('dmsDataExport.status.wait_for_export')}</span>
      </>
    ],
    [
      ListDataExportWorkflowStatusEnum.failed,
      <>
        <IconWorkflowStatusIsFailed />
        <span>{t('dmsDataExport.status.export_failed')}</span>
      </>
    ],
    [
      ListDataExportWorkflowStatusEnum.wait_for_approve,
      <>
        <IconWorkflowStatusIsWaitAudit />
        <span>{t('dmsDataExport.status.wait_for_audit')}</span>
      </>
    ],
    [
      ListDataExportWorkflowStatusEnum.rejected,
      <>
        <IconWorkflowStatusIsRejected />
        <span>{t('dmsDataExport.status.rejected')}</span>
      </>
    ]
  ]);
};

const WorkflowStatus: React.FC<{
  status?: ListDataExportWorkflowStatusEnum;
}> = ({ status }) => {
  return (
    <>
      {status ? (
        <StatusStyleWrapper>
          {workflowStatusMap().get(status)}
        </StatusStyleWrapper>
      ) : (
        'unknown'
      )}
    </>
  );
};

export default WorkflowStatus;
