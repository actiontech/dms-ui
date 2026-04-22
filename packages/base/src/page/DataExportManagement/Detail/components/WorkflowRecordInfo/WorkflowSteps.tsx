import { Divider, StepProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { WorkflowStepsProps } from './index.type';
import { useCallback, useMemo } from 'react';
import { CustomSteps, WorkflowStepsItemStyleWrapper } from './style';
import { Space } from 'antd';
import { formatTime } from '@actiontech/dms-kit';
import { EmptyBox } from '@actiontech/dms-kit';
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

  // Dynamic step number calculation based on workflow status and steps
  const stepNumber = useMemo(() => {
    if (!workflowStatus || !workflowSteps) {
      return currentStepNumber;
    }
    // Total steps: create(1) + N approval nodes + execute(1)
    const totalApprovalSteps = workflowSteps.length;

    if (workflowStatus === WorkflowRecordStatusEnum.rejected) {
      // Find which approval step was rejected
      for (let i = 0; i < workflowSteps.length; i++) {
        if (workflowSteps[i]?.state === 'rejected') {
          return i + 2; // +1 for create step, +1 for 1-indexed
        }
      }
      return 2;
    }

    if (workflowStatus === WorkflowRecordStatusEnum.wait_for_approve) {
      // Find the current step being awaited
      if (currentStepNumber !== undefined && currentStepNumber !== null) {
        // currentStepNumber from API represents which step we are on (1-indexed)
        return (currentStepNumber as number) + 1; // +1 for create step
      }
      return 2;
    }

    if (workflowStatus === WorkflowRecordStatusEnum.wait_for_export) {
      return totalApprovalSteps + 2; // all approval done, at execute step
    }

    if (
      [
        WorkflowRecordStatusEnum.exporting,
        WorkflowRecordStatusEnum.failed,
        WorkflowRecordStatusEnum.finish,
        WorkflowRecordStatusEnum.cancel
      ].includes(workflowStatus)
    ) {
      return totalApprovalSteps + 2; // at execute step
    }
  }, [currentStepNumber, workflowStatus, workflowSteps]);

  const renderTitle = useCallback(
    (type?: string) => {
      if (type === 'create') {
        return t('dmsDataExport.detail.record.steps.create');
      }

      if (type === 'approve') {
        return t('dmsDataExport.detail.record.steps.approve');
      }
      if (type === 'execute') {
        return t('dmsDataExport.detail.record.steps.execute');
      }
      return t('dmsDataExport.detail.operator.unknown');
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
                {t('dmsDataExport.detail.operator.waitAudit')}
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
              <span>{t('dmsDataExport.detail.operator.alreadyRejected')}</span>
            </div>
          </EmptyBox>

          <EmptyBox if={workflowStatus === WorkflowRecordStatusEnum.cancel}>
            <div className="step-info-rejected">
              <span>{t('dmsDataExport.detail.operator.alreadyClosed')}</span>
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
    (type?: string, step?: any) => {
      if (type === 'create') {
        return <PlusCircleFilled color="currentColor" />;
      }
      if (type === 'approve') {
        const isRejected =
          workflowStatus === WorkflowRecordStatusEnum.rejected &&
          step?.state === 'rejected';
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

    // Build dynamic steps: create + N approval nodes + execute
    const allSteps: any[] = [
      {
        type: 'create',
        number: 1,
        operation_user: {
          name: createUser
        },
        operation_time: createTime
      }
    ];

    // Add all approval steps from workflow_step_list
    workflowSteps.forEach((step, index) => {
      allSteps.push({
        ...step,
        type: 'approve',
        number: index + 2
      });
    });

    // Add execute step
    allSteps.push({
      type: 'execute',
      number: allSteps.length + 1
    });

    return allSteps.map<StepProps>((v, i) => {
      const nextStep = allSteps[i + 1];
      const isNextRejected = nextStep?.state === 'rejected';
      return {
        title: renderOrderStepsItem(renderTitle(v.type), v),
        icon: renderOrderStepsItemIcon(v.type, v),
        className: classNames({
          'prev-rejected-step': isNextRejected
        })
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
