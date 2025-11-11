import {
  AuditTaskResV1SqlSourceEnum,
  CreateAuditTasksGroupReqV1ExecModeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import SqlStatementFormController from '../../../Common/SqlStatementFormController';
import { ModifySqlStatementProps } from './index.type';
import { Form, Spin, message } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  SqlAuditInfoFormFields,
  SqlStatementFields,
  CreateWorkflowDatabaseInfo
} from '../../../Create/index.type';
import { useEffect, useMemo } from 'react';
import { useBoolean } from 'ahooks';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { isSupportLanguage, ResponseCode } from '@actiontech/dms-kit';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/dms-kit';
import { BasicButton, EmptyBox, PageHeader } from '@actiontech/dms-kit';
import { usePrompt } from '@actiontech/shared/lib/hooks';
import {
  FormAreaBlockStyleWrapper,
  FormAreaLineStyleWrapper
} from '@actiontech/dms-kit/es/components/CustomForm/style';
import { FormItemBigTitle } from '@actiontech/dms-kit';
import useSharedStepDetail from '../../../Create/hooks/useSharedStepDetail';
import { SAME_SQL_MODE_DEFAULT_FIELD_KEY } from '../../../Common/SqlStatementFormController/SqlStatementFormItem/index.data';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import AuditResultList from '../../../Common/AuditResultList';
import SubmitWorkflowButton from '../../../Common/SubmitWorkflowButton';
import { ModifySqlStatementFormStyleWrapper } from './style';
import useCheckTaskAuditSqlCount from '../../../Create/hooks/useCheckTaskAuditSqlCount';
import { WORKFLOW_OVERVIEW_TAB_KEY } from '../../hooks/useAuditExecResultPanelSetup';
import { BriefcaseFilled, LeftArrowOutlined } from '@actiontech/icons';
import Icon from '@ant-design/icons';
import useInstance from '../../../../../hooks/useInstance';
import useCheckTaskAuditRuleExceptionStatus from '../../../Create/hooks/useCheckTaskAuditRuleExceptionStatus';
import instance from '@actiontech/shared/lib/api/sqle/service/instance';

const ModifySqlStatement: React.FC<ModifySqlStatementProps> = ({
  currentTasks,
  modifiedTasks,
  isSameSqlForAll,
  executeMode,
  auditAction,
  backToDetail,
  isAtRejectStep,
  submitWorkflowConfirmationMessage,
  isConfirmationRequiredForSubmission,
  workflowId,
  refreshWorkflow,
  refreshOverviewAction,
  auditExecPanelTabChangeEvent,
  backToDetailText
}) => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const { updateInstanceList, instanceList } = useInstance();
  const { hasExceptionAuditRule, updateTaskAuditRuleExceptionStatus } =
    useCheckTaskAuditRuleExceptionStatus();
  const [form] = Form.useForm<{ [key in string]: SqlStatementFields }>();
  const { updateTaskRecordCount, checkTaskCountIsEmpty } =
    useCheckTaskAuditSqlCount();
  const [messageApi, messageContextHolder] = message.useMessage();
  const {
    isAuditing,
    sqlStatementTabActiveKey,
    resetAllSharedData,
    dbSourceInfoCollection
  } = useSharedStepDetail();
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const [
    getAllSqlStatementLoading,
    { setTrue: startGetAllSqlStatement, setFalse: finishGetAllSqlStatement }
  ] = useBoolean(false);
  const modifySqlSubmit = async () => {
    if (!modifiedTasks?.length) {
      return;
    }
    if (checkTaskCountIsEmpty(modifiedTasks)) {
      messageApi.error(
        t('execWorkflow.detail.operator.updateEmptyWorkflowTips')
      );
      return;
    }
    startSubmit();
    workflow
      .updateWorkflowV2({
        project_name: projectName,
        task_ids: modifiedTasks.map((v) => v.task_id!),
        workflow_id: workflowId
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          refreshWorkflow?.();
          refreshOverviewAction?.();
          backToDetail();
          auditExecPanelTabChangeEvent?.(WORKFLOW_OVERVIEW_TAB_KEY);
        }
      })
      .finally(() => {
        submitFinish();
      });
  };
  const databaseInfo = useMemo<CreateWorkflowDatabaseInfo>(() => {
    return (currentTasks ?? [])
      .map((item, index) => {
        const instanceInfo = instanceList.find(
          (i) => i.instance_name === item.instance_name
        );
        return {
          key: isSameSqlForAll ? `${index}` : item.task_id?.toString() ?? '',
          instanceName: item.instance_name,
          schemaName: item.instance_schema,
          enableBackup: item.enable_backup,
          backupMaxRows: item.backup_max_rows,
          allowBackup: !!instanceInfo?.supported_backup_strategy?.length
        };
      })
      .filter((v) => !!v.instanceName);
  }, [currentTasks, instanceList, isSameSqlForAll]);

  useEffect(() => {
    if (databaseInfo.length) {
      const taskList = isSameSqlForAll ? [databaseInfo[0]] : databaseInfo;
      taskList.forEach((i) => {
        instance
          .getInstanceV2({
            project_name: projectName,
            instance_name: i.instanceName ?? ''
          })
          .then(async (res) => {
            if (res.data.code === ResponseCode.SUCCESS) {
              const dbType = res.data.data?.db_type ?? '';
              dbSourceInfoCollection.set(i.key, {
                dbType,
                ruleTemplate: res.data.data?.rule_template,
                isSupportFormatSql: isSupportLanguage(dbType)
              });
            }
          });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [databaseInfo]);

  const innerAuditAction = async (values: SqlAuditInfoFormFields) => {
    isAuditing.set(true);
    try {
      await auditAction(
        {
          ...values,
          isSameSqlForAll: isSameSqlForAll,
          executeMode:
            executeMode as unknown as CreateAuditTasksGroupReqV1ExecModeEnum,
          databaseInfo: databaseInfo.map((v) => ({
            instanceName: v.instanceName,
            instanceSchema: v.schemaName
          }))
        },
        databaseInfo
      );
    } finally {
      isAuditing.set(false);
    }
  };
  const innerBackToDetail = () => {
    backToDetail();
    form.resetFields();
    resetAllSharedData();
  };
  useEffect(() => {
    const getAllSqlStatement = () => {
      const request = (taskId: string) => {
        return task
          .getAuditTaskSQLContentV1({
            task_id: taskId
          })
          .then((res) => {
            if (res.data.code === ResponseCode.SUCCESS) {
              return {
                taskId,
                sql: res.data.data?.sql ?? ''
              };
            }
          });
      };
      const formDataTasks = (currentTasks ?? []).filter(
        (v) => v.sql_source === AuditTaskResV1SqlSourceEnum.form_data
      );
      if (formDataTasks.length > 0) {
        startGetAllSqlStatement();
        Promise.all(
          formDataTasks.map((v) => request(v.task_id?.toString() ?? ''))
        )
          .then((res) => {
            res.forEach((v) => {
              if (v) {
                form.setFieldValue(
                  [
                    isSameSqlForAll
                      ? SAME_SQL_MODE_DEFAULT_FIELD_KEY
                      : v.taskId,
                    'form_data'
                  ],
                  v.sql
                );
              }
            });
          })
          .finally(() => {
            finishGetAllSqlStatement();
          });
      }
    };
    if (isAtRejectStep) {
      getAllSqlStatement();
      if (isSameSqlForAll) {
        form.setFieldValue(SAME_SQL_MODE_DEFAULT_FIELD_KEY, {
          currentUploadType: currentTasks?.[0]?.sql_source,
          exec_mode: currentTasks?.[0]?.exec_mode,
          file_sort_method: currentTasks?.[0]?.file_order_method,
          backup: currentTasks?.[0]?.enable_backup,
          backupMaxRows: currentTasks?.[0]?.backup_max_rows
        });
      } else {
        sqlStatementTabActiveKey.set(
          currentTasks?.[0]?.task_id?.toString() ?? ''
        );
        currentTasks?.forEach((item) => {
          form.setFieldValue(item.task_id?.toString() ?? '', {
            currentUploadType: item.sql_source,
            exec_mode: item.exec_mode,
            file_sort_method: item.file_order_method,
            backup: item.enable_backup,
            backupMaxRows: item.backup_max_rows
          });
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentTasks,
    finishGetAllSqlStatement,
    form,
    isAtRejectStep,
    isSameSqlForAll,
    resetAllSharedData,
    startGetAllSqlStatement
  ]);

  // #if [ee]
  useEffect(() => {
    if (isAtRejectStep) {
      updateInstanceList({
        project_name: projectName
      });
    }
  }, [updateInstanceList, projectName, isAtRejectStep]);
  // #endif

  usePrompt(
    t('execWorkflow.create.auditResult.leaveTip'),
    isAtRejectStep && !!modifiedTasks?.length
  );
  return isAtRejectStep ? (
    <Spin
      spinning={getAllSqlStatementLoading || isAuditing.value || submitLoading}
    >
      {messageContextHolder}
      <PageLayoutHasFixedHeaderStyleWrapper>
        <PageHeader
          fixed
          title={
            <BasicButton
              icon={<LeftArrowOutlined />}
              onClick={innerBackToDetail}
            >
              {backToDetailText ||
                t('execWorkflow.detail.operator.backToDetail')}
            </BasicButton>
          }
          extra={
            <EmptyBox if={!!modifiedTasks?.length}>
              <SubmitWorkflowButton
                hasExceptionAuditRule={hasExceptionAuditRule}
                isConfirmationRequiredForSubmission={
                  isConfirmationRequiredForSubmission
                }
                loading={submitLoading}
                submitWorkflowConfirmationMessage={
                  submitWorkflowConfirmationMessage
                }
                onClick={modifySqlSubmit}
              />
            </EmptyBox>
          }
        />
        <ModifySqlStatementFormStyleWrapper
          form={form}
          className="hasTopHeader clearPaddingBottom"
          colon={false}
          labelAlign="left"
        >
          <FormAreaLineStyleWrapper className="has-border">
            <FormAreaBlockStyleWrapper>
              <FormItemBigTitle>
                <Icon component={BriefcaseFilled} className="title-icon" />
                <span>{t('execWorkflow.detail.operator.modifySql')}</span>
              </FormItemBigTitle>

              <SqlStatementFormController
                isAuditing={isAuditing}
                isSameSqlForAll={isSameSqlForAll}
                activeKey={sqlStatementTabActiveKey.value}
                onChange={sqlStatementTabActiveKey.set}
                databaseInfo={databaseInfo}
                clearSqlContentFormWhenChangeUploadType={false}
                auditAction={innerAuditAction}
                disabledUploadType
                isAtRejectStep
                dbSourceInfoCollection={dbSourceInfoCollection}
              />
            </FormAreaBlockStyleWrapper>
          </FormAreaLineStyleWrapper>
        </ModifySqlStatementFormStyleWrapper>

        <EmptyBox if={!!modifiedTasks?.length}>
          <AuditResultList
            tasks={modifiedTasks!}
            updateTaskRecordCount={updateTaskRecordCount}
            updateTaskAuditRuleExceptionStatus={
              updateTaskAuditRuleExceptionStatus
            }
          />
        </EmptyBox>
      </PageLayoutHasFixedHeaderStyleWrapper>
    </Spin>
  ) : null;
};
export default ModifySqlStatement;
