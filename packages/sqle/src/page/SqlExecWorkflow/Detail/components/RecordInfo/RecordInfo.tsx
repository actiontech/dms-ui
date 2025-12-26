import { useTranslation } from 'react-i18next';
import { WorkflowStepsStyleWrapper } from './style';
import WorkflowBasicInfo from './components/WorkflowBasicInfo';
import { formatTime } from '@actiontech/dms-kit';
import WorkflowSteps from './components/WorkflowSteps';
import { EmptyBox } from '@actiontech/dms-kit';
import WorkflowHistorySteps from './components/WorkflowHistorySteps';
import { CloseOutlined } from '@actiontech/icons';
import AssociatedWorkflows from './components/AssociatedWorkflows';
import AssociatedRollbackWorkflows from './components/AssociatedRollbackWorkflows';
import { WorkflowRecordInfoContentProps } from './index.type';
import { useMedia } from '@actiontech/shared';
import classNames from 'classnames';

const WorkflowRecordInfo: React.FC<WorkflowRecordInfoContentProps> = (
  props
) => {
  const { isMobile } = useMedia();
  const { workflowInfo, tasksStatusCount, onClose } = props;
  const { t } = useTranslation();
  return (
    <WorkflowStepsStyleWrapper
      className={classNames({
        'mobile-workflow-record-info-style-wrapper': isMobile
      })}
    >
      <EmptyBox if={!isMobile}>
        <div className="workflow-record-info-header">
          <span className="workflow-record-info-header-text">
            {t('execWorkflow.detail.operator.title')}
          </span>
          <CloseOutlined className="custom-icon-close" onClick={onClose} />
        </div>
      </EmptyBox>

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

      <EmptyBox
        if={
          !!workflowInfo?.associated_stage_workflows &&
          workflowInfo?.associated_stage_workflows?.length > 1
        }
      >
        <AssociatedWorkflows
          workflowId={workflowInfo?.workflow_id}
          associatedWorkflows={workflowInfo?.associated_stage_workflows}
        />
      </EmptyBox>
      {/* #if [ee] */}
      <EmptyBox if={!!workflowInfo?.associated_rollback_workflows?.length}>
        <AssociatedRollbackWorkflows
          associatedWorkflows={workflowInfo?.associated_rollback_workflows}
        />
      </EmptyBox>
      {/* #endif */}
      <EmptyBox if={!!workflowInfo?.record_history_list}>
        <WorkflowHistorySteps
          recordHistoryList={workflowInfo?.record_history_list}
        />
      </EmptyBox>
    </WorkflowStepsStyleWrapper>
  );
};
export default WorkflowRecordInfo;
