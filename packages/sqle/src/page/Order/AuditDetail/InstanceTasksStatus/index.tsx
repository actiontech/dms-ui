import { useTranslation } from 'react-i18next';
import { InstanceTasksStatusType } from './index.type';
import { GetWorkflowTasksItemV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  IconOrderStatusIsExecScheduled,
  IconOrderStatusIsExecuting,
  IconOrderStatusIsFailed,
  IconOrderStatusIsFinished,
  IconOrderStatusIsWaitAudit,
  IconOrderStatusIsWaitExecution
} from '../../../../icon/Order';
import { OrderStatusStyleWrapper } from '../../List/components/style';

const statusIconMap: InstanceTasksStatusType = {
  [GetWorkflowTasksItemV2StatusEnum.wait_for_audit]: {
    icon: <IconOrderStatusIsWaitAudit />,
    label: 'order.status.wait_for_audit'
  },
  [GetWorkflowTasksItemV2StatusEnum.wait_for_execution]: {
    icon: <IconOrderStatusIsWaitExecution />,
    label: 'order.status.wait_for_execution'
  },
  [GetWorkflowTasksItemV2StatusEnum.exec_scheduled]: {
    icon: <IconOrderStatusIsExecScheduled />,
    label: 'order.status.exec_scheduled'
  },
  [GetWorkflowTasksItemV2StatusEnum.exec_succeeded]: {
    icon: <IconOrderStatusIsFinished />,
    label: 'order.status.exec_succeeded'
  },
  [GetWorkflowTasksItemV2StatusEnum.executing]: {
    icon: <IconOrderStatusIsExecuting />,
    label: 'order.status.executing'
  },
  [GetWorkflowTasksItemV2StatusEnum.exec_failed]: {
    icon: <IconOrderStatusIsFailed />,
    label: 'order.status.exec_failed'
  },
  [GetWorkflowTasksItemV2StatusEnum.manually_executed]: {
    icon: <IconOrderStatusIsFinished />,
    label: 'order.status.manually_executed'
  },
  [GetWorkflowTasksItemV2StatusEnum.terminate_failed]: {
    icon: <IconOrderStatusIsFailed />,
    label: 'order.status.terminate_failed'
  },
  [GetWorkflowTasksItemV2StatusEnum.terminate_succeeded]: {
    icon: <IconOrderStatusIsFinished />,
    label: 'order.status.terminate_succeeded'
  },
  [GetWorkflowTasksItemV2StatusEnum.terminating]: {
    icon: <IconOrderStatusIsExecuting />,
    label: 'order.status.terminating'
  }
};

const InstanceTasksStatus: React.FC<{
  status?: GetWorkflowTasksItemV2StatusEnum;
}> = (props) => {
  const { t } = useTranslation();

  if (!props.status) {
    return <span>-</span>;
  }

  return (
    <OrderStatusStyleWrapper>
      {statusIconMap[props.status]?.icon}
      <span>{t(statusIconMap[props.status]?.label)}</span>
    </OrderStatusStyleWrapper>
  );
};

export default InstanceTasksStatus;
