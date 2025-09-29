import { useCurrentUser } from '@actiontech/shared/lib/features';
import { useBoolean } from 'ahooks';
import useInitDataWithRequest from './hooks/useInitDataWithRequest';
import { Spin } from 'antd';
import { WorkflowDetailStyleWrapper } from './style';
import { EmptyBox, PageHeader } from '@actiontech/dms-kit';
import BackToList from '../Common/BackToList';
import WorkflowDetailPageHeaderExtra from './components/PageHeaderExtra';
import useGenerateWorkflowStepsProps from './hooks/useGenerateWorkflowStepsProps';
import BasicInfoWrapper from '../Common/BasicInfoWrapper';
import {
  WorkflowRecordResV2StatusEnum,
  WorkflowResV2ModeEnum,
  WorkflowStepResV2StateEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useMemo } from 'react';
import RejectReason from './components/RejectReason';
import useModifySql from './hooks/useModifySql';
import WorkflowRecordInfo from './components/RecordInfo';
import ModifySqlStatement from './components/ModifySqlStatement';
import useAuditExecResultPanelSetup from './hooks/useAuditExecResultPanelSetup';
import AuditExecResultPanel from './components/AuditExecResultPanel';
import SqlRollback from './components/SqlRollback';
const SqlWorkflowDetail: React.FC = () => {
  const { username } = useCurrentUser();
  const [
    workflowStepsVisibility,
    { setFalse: closeWorkflowSteps, setTrue: showWorkflowSteps }
  ] = useBoolean(false);
  const [isAtRollbackStep, { setTrue: startRollback, setFalse: stopRollback }] =
    useBoolean();
  const { taskInfos, workflowInfo, refreshWorkflowInfo, initLoading } =
    useInitDataWithRequest();
  const {
    maintenanceTimeInfo,
    canRejectWorkflow,
    tasksStatusCount,
    activeTabKey,
    changeActiveTabKey,
    refreshOverviewAction,
    overviewList,
    getOverviewLoading,
    requestErrorMessage: overviewTableErrorMessage
  } = useAuditExecResultPanelSetup();
  const {
    taskInfos: modifiedTasks,
    isAtModifySqlStatementStep,
    showModifySqlStatementStep,
    resetAllState,
    submitWorkflowConfirmationMessage,
    isConfirmationRequiredForSubmission,
    modifySqlAudit
  } = useModifySql(workflowInfo?.mode === WorkflowResV2ModeEnum.same_sqls);
  const {
    passAction,
    executingAction,
    rejectAction,
    completeAction,
    terminateAction,
    messageContextHolder,
    executeInOtherInstanceAction
  } = useGenerateWorkflowStepsProps({
    workflowId: workflowInfo?.workflow_id ?? '',
    refreshWorkflowInfo,
    refreshOverviewAction,
    taskInfos,
    workflowInfo
  });
  const currentRejectedStep = useMemo(() => {
    return workflowInfo?.record?.workflow_step_list?.find(
      (v) => v.state === WorkflowStepResV2StateEnum.rejected
    );
  }, [workflowInfo?.record?.workflow_step_list]);
  return (
    <Spin spinning={initLoading} delay={400}>
      {messageContextHolder}
      <WorkflowDetailStyleWrapper
        workflowStepsVisibility={workflowStepsVisibility}
        hidden={isAtModifySqlStatementStep || isAtRollbackStep}
      >
        <div className="workflow-detail-content">
          <PageHeader
            title={<BackToList />}
            extra={
              <WorkflowDetailPageHeaderExtra
                workflowInfo={workflowInfo}
                refreshWorkflow={() => {
                  refreshWorkflowInfo();
                  refreshOverviewAction();
                }}
                passAction={passAction}
                rejectAction={rejectAction}
                canRejectWorkflow={canRejectWorkflow}
                executingAction={executingAction}
                completeAction={completeAction}
                terminateAction={terminateAction}
                maintenanceTimeInfo={maintenanceTimeInfo}
                workflowStepsVisibility={workflowStepsVisibility}
                showWorkflowSteps={showWorkflowSteps}
                executeInOtherInstanceAction={executeInOtherInstanceAction}
                startRollback={startRollback}
                showModifySqlStatementStep={showModifySqlStatementStep}
              />
            }
          />
          <BasicInfoWrapper
            title={workflowInfo?.workflow_name ?? ''}
            desc={workflowInfo?.desc}
            status={workflowInfo?.record?.status}
            className="clearPaddingTop"
            gap={24}
            sqlVersion={workflowInfo?.sql_version}
          />

          <EmptyBox
            if={
              workflowInfo?.record?.status ===
                WorkflowRecordResV2StatusEnum.rejected && !!currentRejectedStep
            }
          >
            <RejectReason
              stepInfo={currentRejectedStep!}
              currentUsername={username}
              showModifySqlStatementStep={showModifySqlStatementStep}
              createWorkflowUserName={workflowInfo?.create_user_name ?? ''}
            />
          </EmptyBox>

          <AuditExecResultPanel
            activeTabKey={activeTabKey}
            activeTabChangeEvent={changeActiveTabKey}
            taskInfos={taskInfos}
            workflowInfo={workflowInfo}
            refreshWorkflow={refreshWorkflowInfo}
            overviewList={overviewList}
            refreshOverviewAction={refreshOverviewAction}
            getOverviewLoading={getOverviewLoading}
            overviewTableErrorMessage={overviewTableErrorMessage}
          />
        </div>
        <WorkflowRecordInfo
          onClose={closeWorkflowSteps}
          visibility={workflowStepsVisibility}
          workflowInfo={workflowInfo}
          tasksStatusCount={tasksStatusCount}
        />
      </WorkflowDetailStyleWrapper>

      <ModifySqlStatement
        isAtRejectStep={isAtModifySqlStatementStep}
        backToDetail={resetAllState}
        auditAction={modifySqlAudit}
        currentTasks={taskInfos}
        isSameSqlForAll={workflowInfo?.mode === WorkflowResV2ModeEnum.same_sqls}
        executeMode={workflowInfo?.exec_mode}
        workflowId={workflowInfo?.workflow_id ?? ''}
        modifiedTasks={modifiedTasks}
        submitWorkflowConfirmationMessage={submitWorkflowConfirmationMessage}
        isConfirmationRequiredForSubmission={
          isConfirmationRequiredForSubmission
        }
        refreshWorkflow={refreshWorkflowInfo}
        refreshOverviewAction={refreshOverviewAction}
        auditExecPanelTabChangeEvent={changeActiveTabKey}
      />
      {/* #if [ee] */}
      <SqlRollback
        isAtRollbackStep={isAtRollbackStep}
        backToWorkflowDetail={stopRollback}
        workflowInfo={workflowInfo}
        taskInfos={taskInfos}
      />
      {/* #endif */}
    </Spin>
  );
};
export default SqlWorkflowDetail;
