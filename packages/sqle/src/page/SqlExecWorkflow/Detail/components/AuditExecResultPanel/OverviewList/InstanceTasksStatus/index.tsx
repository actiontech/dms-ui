import { InstanceTasksStatusType } from './index.type';
import { GetWorkflowTasksItemV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { WorkflowStatusStyleWrapper } from '../../../../../List/components/WorkflowStatus/style';
import { t } from '../../../../../../../locale';
import {
  CheckHexagonOutlined,
  PartialHexagonFilled,
  AdvancedHexagonFilled,
  EmptyHexagonOutlined,
  InfoHexagonOutlined
} from '@actiontech/icons';

const statusIconMap: InstanceTasksStatusType = {
  [GetWorkflowTasksItemV2StatusEnum.wait_for_audit]: {
    icon: <EmptyHexagonOutlined />,
    label: t('execWorkflow.common.workflowStatus.waitForAudit')
  },
  [GetWorkflowTasksItemV2StatusEnum.wait_for_execution]: {
    icon: <PartialHexagonFilled />,
    label: t('execWorkflow.common.workflowStatus.waitForExecution')
  },
  [GetWorkflowTasksItemV2StatusEnum.exec_scheduled]: {
    icon: <AdvancedHexagonFilled />,
    label: t('execWorkflow.common.workflowStatus.execScheduled')
  },
  [GetWorkflowTasksItemV2StatusEnum.exec_succeeded]: {
    icon: <CheckHexagonOutlined />,
    label: t('execWorkflow.common.workflowStatus.execSucceeded')
  },
  [GetWorkflowTasksItemV2StatusEnum.executing]: {
    icon: <AdvancedHexagonFilled />,
    label: t('execWorkflow.common.workflowStatus.executing')
  },
  [GetWorkflowTasksItemV2StatusEnum.exec_failed]: {
    icon: <InfoHexagonOutlined />,
    label: t('execWorkflow.common.workflowStatus.execFailed')
  },
  [GetWorkflowTasksItemV2StatusEnum.manually_executed]: {
    icon: <CheckHexagonOutlined />,
    label: t('execWorkflow.common.workflowStatus.manuallyExecuted')
  },
  [GetWorkflowTasksItemV2StatusEnum.terminate_failed]: {
    icon: <InfoHexagonOutlined />,
    label: t('execWorkflow.common.workflowStatus.terminateFailed')
  },
  [GetWorkflowTasksItemV2StatusEnum.terminate_succeeded]: {
    icon: <CheckHexagonOutlined />,
    label: t('execWorkflow.common.workflowStatus.terminateSucceeded')
  },
  [GetWorkflowTasksItemV2StatusEnum.terminating]: {
    icon: <AdvancedHexagonFilled />,
    label: t('execWorkflow.common.workflowStatus.terminating')
  }
};

const InstanceTasksStatus: React.FC<{
  status?: GetWorkflowTasksItemV2StatusEnum;
}> = (props) => {
  if (!props.status) {
    return <span>-</span>;
  }

  return (
    <WorkflowStatusStyleWrapper>
      {statusIconMap[props.status]?.icon}
      <span>{statusIconMap[props.status]?.label}</span>
    </WorkflowStatusStyleWrapper>
  );
};

export default InstanceTasksStatus;
