import { useTranslation } from 'react-i18next';
import { WorkflowStepsStyleWrapper } from './style';
import WorkflowBasicInfo from './WorkflowBasicInfo';
import { formatTime } from '@actiontech/dms-kit';
import WorkflowSteps from './WorkflowSteps';
import useDataExportDetailReduxManage from '../../hooks/index.redux';
import { CloseOutlined } from '@actiontech/icons';
import {
  DataExportRelatedUnmaskingWorkflowApprovalStatusEnum,
  WorkflowRecordStatusEnum
} from '@actiontech/shared/lib/api/base/service/common.enum';
import { getRelatedUnmaskingWorkflows } from '../../utils/unmaskingWorkflow';

const WorkflowRecordInfo: React.FC = () => {
  const { t } = useTranslation();
  const {
    workflowStepOpen,
    updateWorkflowStepOpen,
    workflowInfo,
    taskStatusNumber
  } = useDataExportDetailReduxManage();
  const relatedUnmaskingWorkflows = getRelatedUnmaskingWorkflows(workflowInfo);
  const hasRelatedUnmaskingWorkflow = relatedUnmaskingWorkflows.length > 0;
  const waitingMaskingApproval = relatedUnmaskingWorkflows.some(
    (workflow) =>
      workflow.approval_status ===
      DataExportRelatedUnmaskingWorkflowApprovalStatusEnum.pending
  );
  const partialExportFailed =
    (taskStatusNumber?.success ?? 0) > 0 && (taskStatusNumber?.failed ?? 0) > 0;

  return (
    <WorkflowStepsStyleWrapper hidden={!workflowStepOpen}>
      {workflowStepOpen ? (
        <>
          <div className="workflow-record-info-header">
            <span className="workflow-record-info-header-text">
              {t('dmsDataExport.detail.record.title')}
            </span>
            <CloseOutlined
              className="custom-icon-close"
              onClick={() => {
                updateWorkflowStepOpen(false);
              }}
            />
          </div>

          <WorkflowBasicInfo
            createTime={formatTime(workflowInfo?.create_time, '-')}
            createUserName={workflowInfo?.create_user?.name ?? '-'}
            workflowStatus={workflowInfo?.workflow_record?.status}
            isPlaintextExport={hasRelatedUnmaskingWorkflow}
            waitingMaskingApproval={
              workflowInfo?.workflow_record?.status ===
                WorkflowRecordStatusEnum.wait_for_export &&
              waitingMaskingApproval
            }
            partialExportFailed={partialExportFailed}
            opsTypeName={workflowInfo?.ops_type?.name}
          />

          <WorkflowSteps
            createTime={workflowInfo?.create_time ?? ''}
            createUser={workflowInfo?.create_user?.name ?? ''}
            workflowSteps={workflowInfo?.workflow_record?.workflow_step_list}
            currentStepNumber={
              workflowInfo?.workflow_record?.current_step_number
            }
            workflowStatus={workflowInfo?.workflow_record?.status}
            taskStatusNumber={taskStatusNumber}
          />

          {/* <EmptyBox if={!!workflowInfo?.workflow_record_history}>
        <WorkflowHistorySteps
          recordHistoryList={workflowInfo?.workflow_record_history}
        />
      </EmptyBox> */}
        </>
      ) : null}
    </WorkflowStepsStyleWrapper>
  );
};

export default WorkflowRecordInfo;
