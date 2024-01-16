import { Divider, StepProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { OrderStepsProps } from './index.type';
import { useCallback, useMemo } from 'react';
import { CustomSteps, OrderStepsItemStyleWrapper } from './style';
import { Space } from 'antd';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import {
  IconFailedOrderStep,
  IconFinishedOrderStep,
  IconInitializedOrderStep,
  IconProgressOrderStep
} from '../../../../icon/Order';
import {
  WorkflowRecordResV2StatusEnum,
  WorkflowStepResV2StateEnum,
  WorkflowStepResV2TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { EmptyBox } from '@actiontech/shared';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';
import { IWorkflowStepResV2 } from '@actiontech/shared/lib/api/sqle/service/common';

const OrderSteps: React.FC<OrderStepsProps> = ({
  workflowSteps,
  currentStepNumber,
  orderStatus,
  tasksStatusNumber
}) => {
  const { t } = useTranslation();
  const { sharedTheme } = useThemeStyleData();

  const stepNumber = useMemo(() => {
    if (typeof currentStepNumber === 'number') {
      return currentStepNumber;
    }

    let number = 1;

    if (!workflowSteps) {
      return number;
    }

    // 上线成功 上线失败 或 正在上线
    if (
      orderStatus === WorkflowRecordResV2StatusEnum.finished ||
      orderStatus === WorkflowRecordResV2StatusEnum.exec_failed ||
      orderStatus === WorkflowRecordResV2StatusEnum.executing
    ) {
      return workflowSteps.length + 1;
    }

    // 驳回 或者 关闭工单
    for (let i = 0; i < workflowSteps.length; ++i) {
      if (
        !workflowSteps[i].operation_time &&
        !workflowSteps[i].operation_user_name
      ) {
        /**
         * 当没有 currentStepNumber 时, workflowSteps 中第一项没有操作人与操作时间的步骤为执行 驳回 或者 关闭 工单的下一步,
         *所以当前步骤应该为上一步, 而 stepNumber 从 1 开始, index 从 0 开始, 所以执行 number = i
         **/
        number = i;
        break;
      }
    }

    /**
     * 驳回或者关闭工单流程中不会存在 number = 1 的情况, 当 workflowSteps 中所有数据都有操作人时, 当前步骤为最后一步
     */
    if (number === 1) {
      number = workflowSteps.length;
    }

    return number;
  }, [currentStepNumber, orderStatus, workflowSteps]);

  const renderTitle = useCallback(
    (type?: WorkflowStepResV2TypeEnum) => {
      if (type === WorkflowStepResV2TypeEnum.create_workflow) {
        return t('order.operator.createOrderStep');
      }

      if (type === WorkflowStepResV2TypeEnum.update_workflow) {
        return t('order.operator.updateOrderStep');
      }

      if (type === WorkflowStepResV2TypeEnum.sql_review) {
        return t('order.operator.reviewOrderStep');
      }

      if (type === WorkflowStepResV2TypeEnum.sql_execute) {
        return t('order.operator.executeOrderStep');
      }

      return t('order.operator.unknown');
    },
    [t]
  );

  const renderOrderStepsItemContent = useCallback(
    (step: IWorkflowStepResV2) => {
      if (step.type === WorkflowStepResV2TypeEnum.sql_execute) {
        return (
          <>
            <div>
              <span>{t('order.status.finished')}: </span>
              <span>{tasksStatusNumber?.success ?? 0}</span>
            </div>
            <div>
              <span>{t('order.status.exec_failed')}: </span>
              <span>{tasksStatusNumber?.failed ?? 0}</span>
            </div>
            <div>
              <span>{t('order.status.executing')}: </span>
              <span>{tasksStatusNumber?.executing ?? 0}</span>
            </div>
          </>
        );
      }

      return (
        <>
          <EmptyBox
            if={!!step.operation_user_name && !!step.operation_time}
            defaultNode={
              <div className="step-info-tips">
                {t('order.operator.waitAudit')}
              </div>
            }
          >
            <Space>
              <span>{step.operation_user_name}</span>
              <Divider type="vertical" />
              <span>{formatTime(step.operation_time)}</span>
            </Space>
          </EmptyBox>

          <EmptyBox
            if={
              orderStatus === WorkflowRecordResV2StatusEnum.rejected &&
              step.state === WorkflowStepResV2StateEnum.rejected
            }
          >
            <div className="step-info-rejected">
              <span>{t('order.operator.alreadyRejected')}</span>
            </div>
          </EmptyBox>

          <EmptyBox if={orderStatus === WorkflowRecordResV2StatusEnum.canceled}>
            <div className="step-info-rejected">
              <span>{t('order.operator.alreadyClosed')}</span>
            </div>
          </EmptyBox>
        </>
      );
    },
    [
      orderStatus,
      t,
      tasksStatusNumber?.executing,
      tasksStatusNumber?.failed,
      tasksStatusNumber?.success
    ]
  );

  const renderOrderStepsItem = useCallback(
    (title: string, step: IWorkflowStepResV2) => {
      return (
        <OrderStepsItemStyleWrapper>
          <div className="step-title">{title}</div>

          <div className="step-info">{renderOrderStepsItemContent(step)}</div>
        </OrderStepsItemStyleWrapper>
      );
    },
    [renderOrderStepsItemContent]
  );

  const renderOrderStepsItemIcon = useCallback(
    (type?: WorkflowStepResV2TypeEnum, state?: WorkflowStepResV2StateEnum) => {
      if (
        type === WorkflowStepResV2TypeEnum.create_workflow ||
        type === WorkflowStepResV2TypeEnum.update_workflow
      ) {
        return <IconInitializedOrderStep />;
      }

      if (type === WorkflowStepResV2TypeEnum.sql_review) {
        const isRejected =
          orderStatus === WorkflowRecordResV2StatusEnum.rejected &&
          state === WorkflowStepResV2StateEnum.rejected;
        return (
          <IconProgressOrderStep
            color={isRejected ? sharedTheme.uiToken.colorWarning : undefined}
          />
        );
      }

      if (type === WorkflowStepResV2TypeEnum.sql_execute) {
        if (
          orderStatus &&
          [
            WorkflowRecordResV2StatusEnum.canceled,
            WorkflowRecordResV2StatusEnum.rejected
          ].includes(orderStatus)
        ) {
          return (
            <IconFailedOrderStep
              color={
                stepNumber === workflowSteps?.length
                  ? sharedTheme.uiToken.colorWarning
                  : undefined
              }
            />
          );
        }

        if (orderStatus === WorkflowRecordResV2StatusEnum.exec_failed) {
          return (
            <IconFailedOrderStep color={sharedTheme.uiToken.colorWarning} />
          );
        }
        return <IconFinishedOrderStep />;
      }
    },
    [
      orderStatus,
      sharedTheme.uiToken.colorWarning,
      stepNumber,
      workflowSteps?.length
    ]
  );

  const stepsItems = useMemo(() => {
    if (!workflowSteps) {
      return [];
    }

    return workflowSteps.map<StepProps>((v, i) => {
      const isNextRejected =
        workflowSteps[i + 1]?.state === WorkflowStepResV2StateEnum.rejected;

      return {
        title: renderOrderStepsItem(renderTitle(v.type), v),
        icon: renderOrderStepsItemIcon(v.type, v.state),
        className: isNextRejected ? 'prev-rejected-step' : undefined
      };
    });
  }, [
    renderOrderStepsItem,
    renderOrderStepsItemIcon,
    renderTitle,
    workflowSteps
  ]);

  return (
    <div className="custom-steps-wrapper">
      <div className="custom-steps-wrapper-title">
        {t('order.orderSteps.stepsTitle')}
      </div>

      <CustomSteps
        direction="vertical"
        initial={1}
        current={stepNumber}
        items={stepsItems}
      />
    </div>
  );
};

export default OrderSteps;
