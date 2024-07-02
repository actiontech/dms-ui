import { Divider, StepProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { WorkflowStepsProps } from './index.type';
import { useCallback, useMemo } from 'react';
import { CustomSteps, WorkflowStepsItemStyleWrapper } from './style';
import { Space } from 'antd';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { EmptyBox } from '@actiontech/shared';
import useThemeStyleData from '../../../../../hooks/useThemeStyleData';
import { WorkflowRecordStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { IWorkflowStep } from '@actiontech/shared/lib/api/base/service/common';
import classNames from 'classnames';
import {
  ProgressCircleFilled,
  CloseCircleFilled,
  PlusCircleFilled,
  CheckCircleFilled
} from '@actiontech/icons';

const WorkflowSteps: React.FC<WorkflowStepsProps> = ({
  workflowSteps,
  currentStepNumber,
  workflowStatus,
  createTime,
  createUser,
  taskStatusNumber
}) => {
  const { t } = useTranslation();
  const { sharedTheme } = useThemeStyleData();
  const stepNumber = useMemo(() => {
    if (!workflowStatus) {
      return currentStepNumber;
    }
    //本期后端没有流程模板，当前固定为：创建、审核、执行 三步，所以前端自己判断当前到第几步了
    if (
      workflowStatus === WorkflowRecordStatusEnum.wait_for_approve ||
      workflowStatus === WorkflowRecordStatusEnum.rejected
    ) {
      return 2;
    }

    if (workflowStatus === WorkflowRecordStatusEnum.wait_for_export) {
      return 3;
    }

    if (
      [
        WorkflowRecordStatusEnum.exporting,
        WorkflowRecordStatusEnum.failed,
        WorkflowRecordStatusEnum.finish,
        WorkflowRecordStatusEnum.cancel
      ].includes(workflowStatus)
    ) {
      return 4;
    }
  }, [currentStepNumber, workflowStatus]);

  const renderTitle = useCallback(
    (type?: string) => {
      if (type === 'create') {
        return t('dmsDataExport.detail.record.steps.create');
      }

      // if (type === WorkflowStepResV2TypeEnum.update_workflow) {
      //   return t('dmsDataExport.detail.record.steps.update');
      // }

      if (type === 'approve') {
        return t('dmsDataExport.detail.record.steps.approve');
      }

      if (type === 'execute') {
        return t('dmsDataExport.detail.record.steps.execute');
      }

      return t('order.operator.unknown');
    },
    [t]
  );

  const renderOrderStepsItemContent = useCallback(
    (step: IWorkflowStep) => {
      if (step.type === 'execute') {
        return (
          <>
            <div>
              <span>{t('dmsDataExport.status.finished')}: </span>
              <span>{taskStatusNumber?.success ?? 0}</span>
            </div>
            <div>
              <span>{t('dmsDataExport.status.export_failed')}: </span>
              <span>{taskStatusNumber?.failed ?? 0}</span>
            </div>
            <div>
              <span>{t('dmsDataExport.status.exporting')}: </span>
              <span>{taskStatusNumber?.exporting ?? 0}</span>
            </div>
          </>
        );
      }
      return (
        <>
          <EmptyBox
            if={!!step.operation_user?.name && !!step.operation_time}
            defaultNode={
              <div className="step-info-tips">
                {t('order.operator.waitAudit')}
              </div>
            }
          >
            <Space>
              <span>{step.operation_user?.name}</span>
              <Divider type="vertical" />
              <span>{formatTime(step.operation_time)}</span>
            </Space>
          </EmptyBox>

          <EmptyBox
            if={
              workflowStatus === WorkflowRecordStatusEnum.rejected &&
              step.state === 'rejected'
            }
          >
            <div className="step-info-rejected">
              <span>{t('order.operator.alreadyRejected')}</span>
            </div>
          </EmptyBox>

          <EmptyBox if={workflowStatus === WorkflowRecordStatusEnum.cancel}>
            <div className="step-info-rejected">
              <span>{t('order.operator.alreadyClosed')}</span>
            </div>
          </EmptyBox>
        </>
      );
    },
    [
      t,
      workflowStatus,
      taskStatusNumber?.success,
      taskStatusNumber?.failed,
      taskStatusNumber?.exporting
    ]
  );

  const renderOrderStepsItem = useCallback(
    (title: string, step: any) => {
      return (
        <WorkflowStepsItemStyleWrapper>
          <div className="step-title">{title}</div>

          <div className="step-info">{renderOrderStepsItemContent(step)}</div>
        </WorkflowStepsItemStyleWrapper>
      );
    },
    [renderOrderStepsItemContent]
  );

  const renderOrderStepsItemIcon = useCallback(
    (type?: string) => {
      if (type === 'create') {
        return <PlusCircleFilled color="currentColor" />;
      }

      if (type === 'approve') {
        const isRejected = workflowStatus === WorkflowRecordStatusEnum.rejected;
        return (
          <ProgressCircleFilled
            fill="currentColor"
            color={isRejected ? sharedTheme.uiToken.colorWarning : undefined}
          />
        );
      }

      if (type === 'execute') {
        if (
          workflowStatus &&
          [
            WorkflowRecordStatusEnum.cancel,
            WorkflowRecordStatusEnum.rejected
          ].includes(workflowStatus)
        ) {
          return <CloseCircleFilled color={sharedTheme.uiToken.colorWarning} />;
        }

        if (workflowStatus === WorkflowRecordStatusEnum.failed) {
          return <CloseCircleFilled color={sharedTheme.uiToken.colorWarning} />;
        }
        return <CheckCircleFilled />;
      }
    },
    [workflowStatus, sharedTheme.uiToken.colorWarning]
  );

  const stepsItems = useMemo(() => {
    if (!workflowSteps) {
      return [];
    }

    // 没有流程模板，先固定这 3 步
    return [
      {
        type: 'create',
        number: 1,
        operation_user: { name: createUser },
        operation_time: createTime
      },
      {
        ...workflowSteps[0],
        type: 'approve',
        number: 2
      },
      { type: 'execute', number: 3 }
    ].map<StepProps>((v, i) => {
      const isNextRejected = workflowSteps[i + 1]?.state === 'rejected';

      return {
        title: renderOrderStepsItem(renderTitle(v.type), v),
        icon: renderOrderStepsItemIcon(v.type),
        className: classNames({ 'prev-rejected-step': isNextRejected })
      };
    });
  }, [
    createTime,
    createUser,
    renderOrderStepsItem,
    renderOrderStepsItemIcon,
    renderTitle,
    workflowSteps
  ]);
  return (
    <div className="custom-steps-wrapper">
      <div className="custom-steps-wrapper-title">
        {t('dmsDataExport.detail.record.steps.title')}
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

export default WorkflowSteps;
