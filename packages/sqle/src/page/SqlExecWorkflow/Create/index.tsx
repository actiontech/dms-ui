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
import { useCallback, useRef } from 'react';
import AuditResultStep from './components/AuditResultStep';
import { usePrompt } from '@actiontech/shared/lib/hooks';
import { useTranslation } from 'react-i18next';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { ICreateWorkflowV2Params } from '@actiontech/shared/lib/api/sqle/service/workflow/index.d';
import useCheckTaskAuditSqlCount from './hooks/useCheckTaskAuditSqlCount';

const CreateSqlExecWorkflow: React.FC = () => {
  const { t } = useTranslation();
  const [baseInfoForm] = useForm<WorkflowBaseInfoFormFields>();
  const [sqlAuditInfoForm] = useForm<SqlAuditInfoFormFields>();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { projectName } = useCurrentProject();
  const createdWorkflowID = useRef('');
  const { updateTaskRecordCount, checkTaskCountIsEmpty } =
    useCheckTaskAuditSqlCount();

  const {
    isAtFormStep,
    isAtAuditResultStep,
    isAtCreateResultStep,
    goToAuditResultStep,
    goToCreateResultStep
  } = useCreateWorkflowSteps();

  const { isAuditing, ...sharedStepDetail } = useSharedStepDetail();

  const {
    taskInfos,
    auditWorkflowWithSameSql,
    auditWorkflowWthDifferenceSql,
    isDisableFinallySubmitButton,
    disabledOperatorWorkflowBtnTips
  } = useAuditWorkflow();

  const auditAction = useCallback(
    async (
      values: SqlAuditInfoFormFields,
      baseInfo?: WorkflowBaseInfoFormFields
    ) => {
      //虽然审核不需要 baseInfo 数据，但还是需要进行校验
      await baseInfoForm.validateFields();

      const finallyFunc = () => {
        isAuditing.set(false);
      };

      const onSuccess = () => {
        if (baseInfo) {
          baseInfoForm.setFieldsValue(baseInfo);
        } else {
          goToAuditResultStep();
        }
      };

      isAuditing.set(true);

      if (values.isSameSqlForAll) {
        auditWorkflowWithSameSql(values, onSuccess).finally(finallyFunc);
      } else {
        auditWorkflowWthDifferenceSql(
          values,
          Object.keys(sharedStepDetail.dbSourceInfoCollection.value).map(
            (key) => ({
              key,
              instanceName:
                sharedStepDetail.dbSourceInfoCollection.value[key].instanceName,
              schemaName:
                sharedStepDetail.dbSourceInfoCollection.value[key].schemaName
            })
          ),
          onSuccess
        ).finally(finallyFunc);
      }
    },
    [
      auditWorkflowWithSameSql,
      auditWorkflowWthDifferenceSql,
      baseInfoForm,
      goToAuditResultStep,
      isAuditing,
      sharedStepDetail.dbSourceInfoCollection.value
    ]
  );

  const createAction = useCallback(async () => {
    const baseInfo = await baseInfoForm.validateFields();

    if (!taskInfos?.length) {
      messageApi.error(t('execWorkflow.create.mustAuditTips'));
      return;
    }

    if (checkTaskCountIsEmpty(taskInfos)) {
      messageApi.error(t('execWorkflow.create.mustHaveAuditResultTips'));
      return;
    }

    const createWorkflowParam: ICreateWorkflowV2Params = {
      task_ids: taskInfos.map((v) => v.task_id!),
      desc: baseInfo?.desc,
      workflow_subject: baseInfo?.workflow_subject,
      project_name: projectName
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
    taskInfos
  ]);

  usePrompt(t('execWorkflow.create.auditResult.leaveTip'), isAtAuditResultStep);
  return (
    <Spin spinning={isAuditing.value}>
      {messageContextHolder}
      <div hidden={!isAtFormStep}>
        <FormStep
          baseInfoForm={baseInfoForm}
          sqlAuditInfoForm={sqlAuditInfoForm}
          isAuditing={isAuditing}
          auditAction={auditAction}
          {...sharedStepDetail}
        />
      </div>
      <div hidden={!isAtAuditResultStep}>
        <AuditResultStep
          isAuditing={isAuditing}
          baseFormValues={baseInfoForm.getFieldsValue()}
          sqlAuditInfoFormValues={sqlAuditInfoForm.getFieldsValue()}
          tasks={taskInfos}
          isDisableFinallySubmitButton={isDisableFinallySubmitButton}
          disabledOperatorOrderBtnTips={disabledOperatorWorkflowBtnTips}
          auditAction={auditAction}
          createAction={createAction}
          updateTaskRecordCount={updateTaskRecordCount}
          {...sharedStepDetail}
        />
      </div>
      <div hidden={!isAtCreateResultStep}>
        <CreateResultStep
          desc={baseInfoForm.getFieldValue('desc')}
          workflowID={createdWorkflowID.current}
        />
      </div>
    </Spin>
  );
};

export default CreateSqlExecWorkflow;
