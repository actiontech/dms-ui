import { ReactNode } from 'react';
import {
  IconWorkflowStatusIsCanceled,
  IconWorkflowStatusIsExecuting,
  IconWorkflowStatusIsFailed,
  IconWorkflowStatusIsFinished,
  IconWorkflowStatusIsRejected,
  IconWorkflowStatusIsWaitAudit,
  IconWorkflowStatusIsWaitExecution
} from '../../../../../icon/SqlExecWorkflow';
import { WorkflowStatusStyleWrapper } from './style';
import { WorkflowDetailResV1StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { t } from '../../../../../locale';

const WorkflowStatusMap = () => {
  return new Map<WorkflowDetailResV1StatusEnum, ReactNode>([
    [
      WorkflowDetailResV1StatusEnum.canceled,
      <>
        <IconWorkflowStatusIsCanceled />
        <span>{t('execWorkflow.common.workflowStatus.canceled')}</span>
      </>
    ],
    [
      WorkflowDetailResV1StatusEnum.executing,
      <>
        <IconWorkflowStatusIsExecuting />
        <span>{t('execWorkflow.common.workflowStatus.executing')}</span>
      </>
    ],
    [
      WorkflowDetailResV1StatusEnum.finished,
      <>
        <IconWorkflowStatusIsFinished />
        <span>{t('execWorkflow.common.workflowStatus.execSucceeded')}</span>
      </>
    ],
    [
      WorkflowDetailResV1StatusEnum.exec_failed,
      <>
        <IconWorkflowStatusIsFailed />
        <span>{t('execWorkflow.common.workflowStatus.execFailed')}</span>
      </>
    ],
    [
      WorkflowDetailResV1StatusEnum.wait_for_audit,
      <>
        <IconWorkflowStatusIsWaitAudit />
        <span>{t('execWorkflow.common.workflowStatus.waitForAudit')}</span>
      </>
    ],
    [
      WorkflowDetailResV1StatusEnum.wait_for_execution,
      <>
        <IconWorkflowStatusIsWaitExecution />
        <span>{t('execWorkflow.common.workflowStatus.waitForExecution')}</span>
      </>
    ],
    [
      WorkflowDetailResV1StatusEnum.rejected,
      <>
        <IconWorkflowStatusIsRejected />
        <span>{t('execWorkflow.common.workflowStatus.reject')}</span>
      </>
    ]
  ]);
};

const WorkflowStatus: React.FC<{ status?: WorkflowDetailResV1StatusEnum }> = ({
  status
}) => {
  //todo unknown
  return (
    <>
      {status ? (
        <WorkflowStatusStyleWrapper>
          {WorkflowStatusMap().get(status)}
        </WorkflowStatusStyleWrapper>
      ) : (
        'unknown'
      )}
    </>
  );
};

export default WorkflowStatus;
