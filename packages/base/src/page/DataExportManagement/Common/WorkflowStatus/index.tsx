import { ListDataExportWorkflowStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { t } from '../../../../locale';
import {
  IconOrderStatusIsCanceled,
  IconOrderStatusIsExecuting,
  IconOrderStatusIsFailed,
  IconOrderStatusIsFinished,
  IconOrderStatusIsRejected,
  IconOrderStatusIsWaitAudit,
  IconOrderStatusIsWaitExecution
} from 'sqle/src/icon/Order';
import { StatusStyleWrapper } from '../style';

const workflowStatusMap = () => {
  return new Map<ListDataExportWorkflowStatusEnum, React.ReactNode>([
    [
      ListDataExportWorkflowStatusEnum.cancel,
      <>
        <IconOrderStatusIsCanceled />
        <span>{t('dmsDataExport.status.canceled')}</span>
      </>
    ],
    [
      ListDataExportWorkflowStatusEnum.exporting,
      <>
        <IconOrderStatusIsExecuting />
        <span>{t('dmsDataExport.status.exporting')}</span>
      </>
    ],
    [
      ListDataExportWorkflowStatusEnum.finish,
      <>
        <IconOrderStatusIsFinished />
        <span>{t('dmsDataExport.status.finished')}</span>
      </>
    ],
    [
      ListDataExportWorkflowStatusEnum.wait_for_export,
      <>
        <IconOrderStatusIsWaitExecution />
        <span>{t('dmsDataExport.status.wait_for_export')}</span>
      </>
    ],
    [
      ListDataExportWorkflowStatusEnum.failed,
      <>
        <IconOrderStatusIsFailed />
        <span>{t('dmsDataExport.status.export_failed')}</span>
      </>
    ],
    [
      ListDataExportWorkflowStatusEnum.wait_for_approve,
      <>
        <IconOrderStatusIsWaitAudit />
        <span>{t('dmsDataExport.status.wait_for_audit')}</span>
      </>
    ],
    [
      ListDataExportWorkflowStatusEnum.rejected,
      <>
        <IconOrderStatusIsRejected />
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
