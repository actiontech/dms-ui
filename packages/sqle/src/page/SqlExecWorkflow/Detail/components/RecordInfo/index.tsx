import { useTranslation } from 'react-i18next';
import { WorkflowRecordInfoProps } from './index.type';
import { WorkflowStepsStyleWrapper } from './style';
import WorkflowBasicInfo from './components/WorkflowBasicInfo';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import WorkflowSteps from './components/WorkflowSteps';
import { EmptyBox, LazyLoadComponent } from '@actiontech/shared';
import WorkflowHistorySteps from './components/WorkflowHistorySteps';
import { CloseOutlined } from '@actiontech/icons';
import AssociatedWorkflows from './components/AssociatedWorkflows';

const WorkflowRecordInfo: React.FC<WorkflowRecordInfoProps> = ({
  visibility,
  workflowInfo,
  tasksStatusCount,
  onClose
}) => {
  const { t } = useTranslation();

  return (
    <LazyLoadComponent open={visibility}>
      <WorkflowStepsStyleWrapper>
        <div className="workflow-record-info-header">
          <span className="workflow-record-info-header-text">
            {t('execWorkflow.detail.operator.title')}
          </span>
          <CloseOutlined className="custom-icon-close" onClick={onClose} />
        </div>

        <WorkflowBasicInfo
          createTime={formatTime(workflowInfo?.create_time, '-')}
          createUserName={workflowInfo?.create_user_name ?? '-'}
          workflowStatus={workflowInfo?.record?.status}
        />

        <WorkflowSteps
          workflowSteps={workflowInfo?.record?.workflow_step_list}
          currentStepNumber={workflowInfo?.record?.current_step_number}
          workflowStatus={workflowInfo?.record?.status}
          tasksStatusCount={tasksStatusCount}
        />

        <EmptyBox if={!!workflowInfo?.associated_other_stage_workflows}>
          <AssociatedWorkflows
            workflowId={workflowInfo?.workflow_id}
            associatedWorkflows={workflowInfo?.associated_other_stage_workflows}
          />
        </EmptyBox>

        <EmptyBox if={!!workflowInfo?.record_history_list}>
          <WorkflowHistorySteps
            recordHistoryList={workflowInfo?.record_history_list}
          />
        </EmptyBox>
      </WorkflowStepsStyleWrapper>
    </LazyLoadComponent>
  );
};

export default WorkflowRecordInfo;
