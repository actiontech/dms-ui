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
import { useCurrentProject } from '@actiontech/shared/lib/global';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { BasicButton, EmptyBox, PageHeader } from '@actiontech/shared';
import { usePrompt } from '@actiontech/shared/lib/hooks';
import {
  FormAreaBlockStyleWrapper,
  FormAreaLineStyleWrapper
} from '@actiontech/shared/lib/components/FormCom/style';
import { FormItemBigTitle } from '@actiontech/shared/lib/components/FormCom';
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

const ModifySqlStatement: React.FC<ModifySqlStatementProps> = ({
  currentTasks,
  modifiedTasks,
  isSameSqlForAll,
  executeMode,
  auditAction,
  backToDetail,
  isAtRejectStep,
  disabledOperatorWorkflowBtnTips,
  isDisableFinallySubmitButton,
  workflowId,
  refreshWorkflow,
  refreshOverviewAction,
  auditExecPanelTabChangeEvent
}) => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const [form] = Form.useForm<{ [key in string]: SqlStatementFields }>();

  const { updateTaskRecordCount, checkTaskCountIsEmpty } =
    useCheckTaskAuditSqlCount();

  const [messageApi, messageContextHolder] = message.useMessage();

  const { isAuditing, sqlStatementTabActiveKey, resetAllSharedData } =
    useSharedStepDetail();

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
          refreshWorkflow();
          refreshOverviewAction();
          backToDetail();
          auditExecPanelTabChangeEvent(WORKFLOW_OVERVIEW_TAB_KEY);
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  const databaseInfo = useMemo<CreateWorkflowDatabaseInfo>(() => {
    return (currentTasks ?? [])
      .map((item) => {
        return {
          key: item.task_id?.toString() ?? '',
          instanceName: item.instance_name,
          schemaName: item.instance_schema
        };
      })
      .filter((v) => !!v.instanceName);
  }, [currentTasks]);

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
        form.setFieldValue(
          [SAME_SQL_MODE_DEFAULT_FIELD_KEY, 'currentUploadType'],
          currentTasks?.[0]?.sql_source
        );
      } else {
        sqlStatementTabActiveKey.set(
          currentTasks?.[0].task_id?.toString() ?? ''
        );
        currentTasks?.forEach((item) => {
          form.setFieldValue(
            [item.task_id?.toString() ?? '', 'currentUploadType'],
            item.sql_source
          );
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
              {t('execWorkflow.detail.operator.backToDetail')}
            </BasicButton>
          }
          extra={
            <EmptyBox if={!!modifiedTasks?.length}>
              <SubmitWorkflowButton
                disabled={isDisableFinallySubmitButton}
                loading={submitLoading}
                disabledTips={disabledOperatorWorkflowBtnTips}
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
              />
            </FormAreaBlockStyleWrapper>
          </FormAreaLineStyleWrapper>
        </ModifySqlStatementFormStyleWrapper>

        <EmptyBox if={!!modifiedTasks?.length}>
          <AuditResultList
            tasks={modifiedTasks!}
            updateTaskRecordCount={updateTaskRecordCount}
          />
        </EmptyBox>
      </PageLayoutHasFixedHeaderStyleWrapper>
    </Spin>
  ) : null;
};

export default ModifySqlStatement;
