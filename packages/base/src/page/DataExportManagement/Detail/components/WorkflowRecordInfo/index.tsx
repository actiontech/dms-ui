import { useTranslation } from 'react-i18next';
import { WorkflowStepsStyleWrapper } from './style';
import { IconClose } from '@actiontech/shared/lib/Icon';
import WorkflowBasicInfo from './WorkflowBasicInfo';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import WorkflowSteps from './WorkflowSteps';
import useDataExportDetailReduxManage from '../../hooks/index.redux';

const WorkflowRecordInfo: React.FC = () => {
  const { t } = useTranslation();
  const {
    workflowStepOpen,
    updateWorkflowStepOpen,
    workflowInfo,
    taskStatusNumber
  } = useDataExportDetailReduxManage();

  return (
    <WorkflowStepsStyleWrapper hidden={!workflowStepOpen}>
      <div className="workflow-record-info-header">
        <span className="workflow-record-info-header-text">
          {t('dmsDataExport.detail.record.title')}
        </span>
        <IconClose
          onClick={() => {
            updateWorkflowStepOpen(false);
          }}
        />
      </div>

      <WorkflowBasicInfo
        createTime={formatTime(workflowInfo?.create_time, '-')}
        createUserName={workflowInfo?.create_user?.name ?? '-'}
        workflowStatus={workflowInfo?.workflow_record?.status}
      />

      <WorkflowSteps
        createTime={workflowInfo?.create_time ?? ''}
        createUser={workflowInfo?.create_user?.name ?? ''}
        workflowSteps={workflowInfo?.workflow_record?.workflow_step_list}
        currentStepNumber={workflowInfo?.workflow_record?.current_step_number}
        workflowStatus={workflowInfo?.workflow_record?.status}
        taskStatusNumber={taskStatusNumber}
      />

      {/* <EmptyBox if={!!workflowInfo?.workflow_record_history}>
        <WorkflowHistorySteps
          recordHistoryList={workflowInfo?.workflow_record_history}
        />
      </EmptyBox> */}
    </WorkflowStepsStyleWrapper>
  );
};

export default WorkflowRecordInfo;
