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
import useAuditExecResultPanelSetup, {
  WORKFLOW_OVERVIEW_TAB_KEY
} from './hooks/useAuditExecResultPanelSetup';
import AuditExecResultPanel from './components/AuditExecResultPanel';
import SqlRollback from './components/SqlRollback';
import { useTranslation } from 'react-i18next';
import {
  failStagePhraseI18nKey,
  ONLINE_FAIL_STAGE,
  pickTaskForFailSummary,
  resolveHeaderFailSummary
} from './utils/failDisplay';

const SqlWorkflowDetail: React.FC = () => {
  const { t } = useTranslation();
  const { username } = useCurrentUser();
  const [
    workflowStepsVisibility,
    { setFalse: closeWorkflowSteps, setTrue: showWorkflowSteps }
  ] = useBoolean(false);
  const [isAtRollbackStep, { setTrue: startRollback, setFalse: stopRollback }] =
    useBoolean();
  const {
    taskInfos,
    workflowInfo,
    refreshWorkflowInfo,
    refreshWorkflowInfoUntilUpdated,
    initLoading
  } = useInitDataWithRequest();
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

  const failSummary = useMemo(() => {
    const task = pickTaskForFailSummary(
      taskInfos,
      activeTabKey,
      WORKFLOW_OVERVIEW_TAB_KEY
    );
    const plan = resolveHeaderFailSummary({
      workflowStatus: workflowInfo?.record?.status,
      taskStatus: task?.status,
      execFailStage: task?.exec_fail_stage,
      execFailSqlCount: task?.exec_fail_sql_count,
      execFailSummary: task?.exec_fail_summary
    });
    if (!plan) {
      return null;
    }
    if (plan.mode === 'backend_summary') {
      return `${t('execWorkflow.detail.failDisplay.headerPrefix')}${
        plan.summary
      }`;
    }
    const phraseKey =
      failStagePhraseI18nKey[plan.stage] ??
      failStagePhraseI18nKey[ONLINE_FAIL_STAGE.unknown];
    const phrase = t(phraseKey);
    if (plan.mode === 'count') {
      return t('execWorkflow.detail.failDisplay.headerWithCount', {
        count: plan.count,
        phrase
      });
    }
    return `${t('execWorkflow.detail.failDisplay.headerPrefix')}${phrase}`;
  }, [activeTabKey, t, taskInfos, workflowInfo?.record?.status]);

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
            failSummary={failSummary}
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
        enableWorkflowDescEdit
        currentDesc={workflowInfo?.desc}
        modifiedTasks={modifiedTasks}
        submitWorkflowConfirmationMessage={submitWorkflowConfirmationMessage}
        isConfirmationRequiredForSubmission={
          isConfirmationRequiredForSubmission
        }
        refreshWorkflow={refreshWorkflowInfoUntilUpdated}
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
