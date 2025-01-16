import { Spin, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import {
  SqlAuditInfoFormFields,
  WorkflowBaseInfoFormFields
} from './index.type';
import useCreateWorkflowSteps from './hooks/useCreateWorkflowSteps';
import CreateResultStep from './components/CreateResultStep';
import FormStep from './components/FormStep';
import useSharedStepDetail from './hooks/useSharedStepDetail';
import useAuditWorkflow from './hooks/useAuditWorkflow';
import { useCallback, useRef, useEffect } from 'react';
import AuditResultStep from './components/AuditResultStep';
import { usePrompt } from '@actiontech/shared/lib/hooks';
import { useTranslation } from 'react-i18next';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import {
  ICreateWorkflowV2Params,
  ICreateRollbackWorkflowParams
} from '@actiontech/shared/lib/api/sqle/service/workflow/index.d';
import useCheckTaskAuditSqlCount from './hooks/useCheckTaskAuditSqlCount';
import { LazyLoadComponent } from '@actiontech/shared';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../store';
import useCreationMode from './hooks/useCreationMode';
import useCheckTaskAuditRuleExceptionStatus from './hooks/useCheckTaskAuditRuleExceptionStatus';

const CreateSqlExecWorkflow: React.FC = () => {
  const { t } = useTranslation();
  const [baseInfoForm] = useForm<WorkflowBaseInfoFormFields>();
  const [sqlAuditInfoForm] = useForm<SqlAuditInfoFormFields>();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { projectName } = useCurrentProject();
  const createdWorkflowID = useRef('');
  const { updateTaskRecordCount, checkTaskCountIsEmpty } =
    useCheckTaskAuditSqlCount();
  const { hasExceptionAuditRule, updateTaskAuditRuleExceptionStatus } =
    useCheckTaskAuditRuleExceptionStatus();

  const {
    isCloneMode,
    isAssociationVersionMode,
    versionId,
    isRollbackMode,
    rollbackWorkflowId
  } = useCreationMode();

  const sqlExecWorkflowReduxState = useSelector((state: IReduxState) => {
    return {
      clonedExecWorkflowSqlAuditInfo:
        state.sqlExecWorkflow.clonedExecWorkflowSqlAuditInfo,
      clonedExecWorkflowBaseInfo:
        state.sqlExecWorkflow.clonedExecWorkflowBaseInfo,
      workflowRollbackSqlIds: state.sqlExecWorkflow.workflowRollbackSqlIds
    };
  });

  useEffect(() => {
    if (isCloneMode || isRollbackMode) {
      baseInfoForm.setFieldsValue({
        workflow_subject:
          sqlExecWorkflowReduxState.clonedExecWorkflowBaseInfo
            ?.workflow_subject ?? '',
        desc: sqlExecWorkflowReduxState.clonedExecWorkflowBaseInfo?.desc ?? ''
      });
      if (sqlExecWorkflowReduxState.clonedExecWorkflowSqlAuditInfo) {
        Object.keys(
          sqlExecWorkflowReduxState.clonedExecWorkflowSqlAuditInfo
        ).forEach((key) => {
          sqlAuditInfoForm.setFieldsValue({
            [key]:
              sqlExecWorkflowReduxState.clonedExecWorkflowSqlAuditInfo?.[key]
          });
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    isAtFormStep,
    isAtAuditResultStep,
    isAtCreateResultStep,
    goToAuditResultStep,
    goToCreateResultStep
  } = useCreateWorkflowSteps();

  const sharedStepDetail = useSharedStepDetail();

  const {
    taskInfos,
    auditWorkflowWithSameSql,
    auditWorkflowWthDifferenceSql,
    isConfirmationRequiredForSubmission,
    submitWorkflowConfirmationMessage
  } = useAuditWorkflow();

  const auditAction = useCallback(
    async (
      values: SqlAuditInfoFormFields,
      baseInfo?: WorkflowBaseInfoFormFields
    ) => {
      const finallyFunc = () => {
        sharedStepDetail.isAuditing.set(false);
      };

      const onSuccess = () => {
        if (baseInfo) {
          baseInfoForm.setFieldsValue(baseInfo);
        } else {
          goToAuditResultStep();
        }
      };

      try {
        //虽然审核不需要 baseInfo 数据，但还是需要进行校验
        await baseInfoForm.validateFields();
        sharedStepDetail.isAuditing.set(true);

        if (values.isSameSqlForAll) {
          auditWorkflowWithSameSql(values, onSuccess).finally(finallyFunc);
        } else {
          auditWorkflowWthDifferenceSql(
            values,
            Object.keys(sharedStepDetail.dbSourceInfoCollection.value).map(
              (key) => ({
                key,
                instanceName:
                  sharedStepDetail.dbSourceInfoCollection.value[key]
                    .instanceName,
                schemaName:
                  sharedStepDetail.dbSourceInfoCollection.value[key].schemaName
              })
            ),
            onSuccess
          ).finally(finallyFunc);
        }
      } catch (error) {
        /* empty */
      }
    },
    [
      auditWorkflowWithSameSql,
      auditWorkflowWthDifferenceSql,
      baseInfoForm,
      goToAuditResultStep,
      sharedStepDetail.dbSourceInfoCollection.value,
      sharedStepDetail.isAuditing
    ]
  );

  const createAction = useCallback(async () => {
    const baseInfo = await baseInfoForm.validateFields();

    if (!taskInfos?.length || taskInfos.some((v) => !v.task_id)) {
      messageApi.error(t('execWorkflow.create.mustAuditTips'));
      return;
    }

    if (checkTaskCountIsEmpty(taskInfos)) {
      messageApi.error(t('execWorkflow.create.mustHaveAuditResultTips'));
      return;
    }

    const commonParams = {
      task_ids: taskInfos.map((v) => v.task_id!),
      desc: baseInfo?.desc,
      workflow_subject: baseInfo?.workflow_subject,
      project_name: projectName
    };

    if (isRollbackMode) {
      const params: ICreateRollbackWorkflowParams = {
        ...commonParams,
        rollback_sql_ids:
          sqlExecWorkflowReduxState.workflowRollbackSqlIds ?? [],
        workflow_id: rollbackWorkflowId ?? ''
      };
      return workflow.CreateRollbackWorkflow(params).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          goToCreateResultStep();
          createdWorkflowID.current = res.data.data?.workflow_id ?? '';
        }
      });
    }

    const createWorkflowParam: ICreateWorkflowV2Params = {
      ...commonParams,
      sql_version_id: isAssociationVersionMode ? Number(versionId) : undefined
    };
    return workflow.createWorkflowV2(createWorkflowParam).then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        goToCreateResultStep();
        createdWorkflowID.current = res.data.data?.workflow_id ?? '';
      }
    });
  }, [
    baseInfoForm,
    checkTaskCountIsEmpty,
    goToCreateResultStep,
    messageApi,
    projectName,
    t,
    taskInfos,
    isAssociationVersionMode,
    versionId,
    isRollbackMode,
    rollbackWorkflowId,
    sqlExecWorkflowReduxState
  ]);

  usePrompt(t('execWorkflow.create.auditResult.leaveTip'), isAtAuditResultStep);
  return (
    <Spin
      spinning={
        sharedStepDetail.isAuditing.value ||
        sharedStepDetail.getModifiedSQLsPending.value
      }
    >
      {messageContextHolder}
      <LazyLoadComponent open={isAtFormStep} animation={false}>
        <FormStep
          baseInfoForm={baseInfoForm}
          sqlAuditInfoForm={sqlAuditInfoForm}
          auditAction={auditAction}
          {...{ ...sharedStepDetail, isAtFormStep }}
        />
      </LazyLoadComponent>

      <LazyLoadComponent open={isAtAuditResultStep} animation={false}>
        <AuditResultStep
          hasExceptionAuditRule={hasExceptionAuditRule}
          updateTaskAuditRuleExceptionStatus={
            updateTaskAuditRuleExceptionStatus
          }
          baseFormValues={baseInfoForm.getFieldsValue()}
          sqlAuditInfoFormValues={sqlAuditInfoForm.getFieldsValue()}
          tasks={taskInfos}
          isConfirmationRequiredForSubmission={
            isConfirmationRequiredForSubmission
          }
          submitWorkflowConfirmationMessage={submitWorkflowConfirmationMessage}
          auditAction={auditAction}
          createAction={createAction}
          updateTaskRecordCount={updateTaskRecordCount}
          {...sharedStepDetail}
        />
      </LazyLoadComponent>

      <LazyLoadComponent
        open={isAtCreateResultStep}
        destroyOnClose
        animation={false}
      >
        <CreateResultStep
          desc={baseInfoForm.getFieldValue('desc')}
          workflowID={createdWorkflowID.current}
        />
      </LazyLoadComponent>
    </Spin>
  );
};

export default CreateSqlExecWorkflow;
