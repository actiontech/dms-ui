import {
  HexagonOutlined,
  CheckHexagonOutlined,
  PartialHexagonFilled,
  AdvancedHexagonFilled,
  InfoHexagonOutlined,
  EmptyHexagonOutlined,
  CloseHexagonOutlined
} from '@actiontech/icons';
import { t } from '../../../../../../locale';
import { StatusStyleWrapper } from './style';
import { WorkflowDetailResV1StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

const workflowStatusMap = () => {
  return new Map<WorkflowDetailResV1StatusEnum, React.ReactNode>([
    [
      WorkflowDetailResV1StatusEnum.cancel,
      <>
        <CloseHexagonOutlined />
        <span>
          {t('globalDashboard.pendingExportWorkflow.status.canceled')}
        </span>
      </>
    ],
    [
      WorkflowDetailResV1StatusEnum.exporting,
      <>
        <AdvancedHexagonFilled />
        <span>
          {t('globalDashboard.pendingExportWorkflow.status.exporting')}
        </span>
      </>
    ],
    [
      WorkflowDetailResV1StatusEnum.finish,
      <>
        <CheckHexagonOutlined />
        <span>
          {t('globalDashboard.pendingExportWorkflow.status.finished')}
        </span>
      </>
    ],
    [
      WorkflowDetailResV1StatusEnum.wait_for_export,
      <>
        <PartialHexagonFilled />
        <span>
          {t('globalDashboard.pendingExportWorkflow.status.waiting_for_export')}
        </span>
      </>
    ],
    [
      WorkflowDetailResV1StatusEnum.failed,
      <>
        <InfoHexagonOutlined />
        <span>{t('globalDashboard.pendingExportWorkflow.status.failed')}</span>
      </>
    ],
    [
      WorkflowDetailResV1StatusEnum.wait_for_approve,
      <>
        <EmptyHexagonOutlined />
        <span>
          {t('globalDashboard.pendingExportWorkflow.status.wait_for_approve')}
        </span>
      </>
    ],
    [
      WorkflowDetailResV1StatusEnum.rejected,
      <>
        <HexagonOutlined />
        <span>
          {t('globalDashboard.pendingExportWorkflow.status.rejected')}
        </span>
      </>
    ]
  ]);
};

const WorkflowStatus: React.FC<{
  status?: WorkflowDetailResV1StatusEnum;
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
