import { ReactNode } from 'react';
import { t } from '../../../../locale';
import {
  IconOrderStatusIsCanceled,
  IconOrderStatusIsExecuting,
  IconOrderStatusIsFailed,
  IconOrderStatusIsFinished,
  IconOrderStatusIsRejected,
  IconOrderStatusIsWaitAudit,
  IconOrderStatusIsWaitExecution
} from '../../../../icon/Order';
import { OrderStatusStyleWrapper } from './style';
import { WorkflowDetailResV1StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

const orderStatusMap = () => {
  return new Map<WorkflowDetailResV1StatusEnum, ReactNode>([
    [
      WorkflowDetailResV1StatusEnum.canceled,
      <>
        <IconOrderStatusIsCanceled />
        <span>{t('order.status.canceled')}</span>
      </>
    ],
    [
      WorkflowDetailResV1StatusEnum.executing,
      <>
        <IconOrderStatusIsExecuting />
        <span>{t('order.status.executing')}</span>
      </>
    ],
    [
      WorkflowDetailResV1StatusEnum.finished,
      <>
        <IconOrderStatusIsFinished />
        <span>{t('order.status.finished')}</span>
      </>
    ],
    [
      WorkflowDetailResV1StatusEnum.exec_failed,
      <>
        <IconOrderStatusIsFailed />
        <span>{t('order.status.exec_failed')}</span>
      </>
    ],
    [
      WorkflowDetailResV1StatusEnum.wait_for_audit,
      <>
        <IconOrderStatusIsWaitAudit />
        <span>{t('order.status.wait_for_audit')}</span>
      </>
    ],
    [
      WorkflowDetailResV1StatusEnum.wait_for_execution,
      <>
        <IconOrderStatusIsWaitExecution />
        <span>{t('order.status.wait_for_execution')}</span>
      </>
    ],
    [
      WorkflowDetailResV1StatusEnum.rejected,
      <>
        <IconOrderStatusIsRejected />
        <span>{t('order.status.reject')}</span>
      </>
    ]
  ]);
};

const OrderStatus: React.FC<{ status?: WorkflowDetailResV1StatusEnum }> = ({
  status
}) => {
  //todo unknown
  return (
    <>
      {status ? (
        <OrderStatusStyleWrapper>
          {orderStatusMap().get(status)}
        </OrderStatusStyleWrapper>
      ) : (
        'unknown'
      )}
    </>
  );
};

export default OrderStatus;
