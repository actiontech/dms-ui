import { ReactNode } from 'react';
import { WorkflowStatusStyleWrapper } from './style';
import { WorkflowDetailResV1StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { t } from '../../../../../locale';
import {
  HexagonOutlined,
  CheckHexagonOutlined,
  PartialHexagonFilled,
  CloseHexagonOutlined,
  AdvancedHexagonFilled,
  EmptyHexagonOutlined,
  InfoHexagonOutlined
} from '@actiontech/icons';

const WorkflowStatusMap = () => {
  return new Map<WorkflowDetailResV1StatusEnum, ReactNode>([
    [
      WorkflowDetailResV1StatusEnum.canceled,
      <>
        <CloseHexagonOutlined />
        <span>{t('execWorkflow.common.workflowStatus.canceled')}</span>
      </>
    ],
    [
      WorkflowDetailResV1StatusEnum.executing,
      <>
        <AdvancedHexagonFilled />
        <span>{t('execWorkflow.common.workflowStatus.executing')}</span>
      </>
    ],
    [
      WorkflowDetailResV1StatusEnum.finished,
      <>
        <CheckHexagonOutlined />
        <span>{t('execWorkflow.common.workflowStatus.execSucceeded')}</span>
      </>
    ],
    [
      WorkflowDetailResV1StatusEnum.exec_failed,
      <>
        <InfoHexagonOutlined />
        <span>{t('execWorkflow.common.workflowStatus.execFailed')}</span>
      </>
    ],
    [
      WorkflowDetailResV1StatusEnum.wait_for_audit,
      <>
        <EmptyHexagonOutlined />
        <span>{t('execWorkflow.common.workflowStatus.waitForAudit')}</span>
      </>
    ],
    [
      WorkflowDetailResV1StatusEnum.wait_for_execution,
      <>
        <PartialHexagonFilled />
        <span>{t('execWorkflow.common.workflowStatus.waitForExecution')}</span>
      </>
    ],
    [
      WorkflowDetailResV1StatusEnum.rejected,
      <>
        <HexagonOutlined />
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
