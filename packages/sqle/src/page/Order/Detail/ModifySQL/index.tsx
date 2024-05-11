import { useBoolean } from 'ahooks';
import { Space, Spin, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  BasicButton,
  BasicToolTips,
  EmptyBox,
  PageHeader
} from '@actiontech/shared';
import {
  WorkflowResV2ModeEnum,
  AuditTaskResV1SqlSourceEnum,
  CreateAuditTasksGroupReqV1ExecModeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import { SQLInputType, SQLStatementFields } from '../../SQLStatementForm';
import { SQLStatementFormTabsRefType } from '../../SQLStatementForm';
import {
  DatabaseInfoFields,
  InstanceInfoType
} from '../../Create/SQLInfoForm/index.type';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import SQLStatementForm from '../../SQLStatementForm/SQLStatementForm';
import SQLStatementFormTabs from '../../SQLStatementForm/SQLStatementFormTabs';
import { IconTipGray } from '@actiontech/shared/lib/Icon';
import { ModifySQLProps } from './index.type';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { IconLeftArrow } from '@actiontech/shared/lib/Icon/common';
import {
  FormAreaBlockStyleWrapper,
  FormAreaLineStyleWrapper,
  FormStyleWrapper
} from '@actiontech/shared/lib/components/FormCom/style';
import { FormItemBigTitle } from '@actiontech/shared/lib/components/FormCom';
import { IconOrderCreateTitleStyleWrapper } from '../../Create/BaseInfoForm/style';
import AuditResultList from '../../Common/AuditResultList';
import { cloneDeep } from 'lodash';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import {
  FormatLanguageSupport,
  formatterSQL
} from '@actiontech/shared/lib/utils/FormatterSQL';
import { defaultUploadTypeOptions } from '../../SQLStatementForm/index.data';
import eventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { SQLInputTypeMapType } from '../../Create/index.type';

const ModifySQL: React.FC<ModifySQLProps> = ({
  currentOrderTasks = [],
  modifiedOrderTasks,
  sqlMode,
  executeMode,
  audit,
  cancel,
  open,
  projectName,
  projectID,
  disabledOperatorOrderBtnTips,
  isDisableFinallySubmitButton,
  workflowID,
  refreshOrder,
  refreshOverviewAction
}) => {
  const { t } = useTranslation();
  const [form] = useForm<{ [key in string]: SQLStatementFields }>();
  const sqlStatementFormTabsRef = useRef<SQLStatementFormTabsRefType>(null);
  const [taskSqlNum, setTaskSqlNum] = useState<Map<string, number>>(new Map());
  const [messageApi, contextHolder] = message.useMessage();
  useState<Map<number, string>>(new Map());
  const updateTaskRecordTotalNum = (taskId: string, sqlNumber: number) => {
    setTaskSqlNum((v) => {
      const cloneValue = cloneDeep(v);
      cloneValue?.set(taskId, sqlNumber);
      return cloneValue;
    });
  };

  const [auditLoading, { setTrue: startAudit, setFalse: auditedFinish }] =
    useBoolean();
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const [
    getAllSqlStatementLoading,
    { setTrue: startGetAllSqlStatement, setFalse: finishGetAllSqlStatement }
  ] = useBoolean(false);
  const [sqlStatementValue, setSqlStatementValue] =
    useState<Record<string, string>>();

  const SQLStatementInfo = useMemo(() => {
    return currentOrderTasks.map((v) => {
      return {
        key: v.task_id?.toString() ?? '',
        instanceName: v.instance_name ?? '',
        sql: sqlStatementValue?.[v.task_id?.toString() ?? ''],
        instanceSchemaName: v.instance_schema ?? ''
      };
    });
  }, [currentOrderTasks, sqlStatementValue]);

  const modifySqlSubmit = useCallback(async () => {
    if (!modifiedOrderTasks?.length) {
      return;
    }
    if (Array.from(taskSqlNum).some(([_, len]) => len === 0)) {
      messageApi.error(t('order.modifySql.updateEmptyOrderTips'));
      return;
    }
    startSubmit();
    workflow
      .updateWorkflowV2({
        project_name: projectName,
        task_ids: modifiedOrderTasks.map((v) => v.task_id!),
        workflow_id: workflowID
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          refreshOrder();
          refreshOverviewAction();

          cancel();

          /**
           * 驳回成功后 task 更新，需要同步更新外层 active 的key
           */
          eventEmitter.emit(EmitterKey.Reset_Tasks_Result_Active_Key);
        }
      })
      .finally(() => {
        submitFinish();
      });
  }, [
    cancel,
    messageApi,
    modifiedOrderTasks,
    projectName,
    refreshOrder,
    refreshOverviewAction,
    startSubmit,
    submitFinish,
    t,
    taskSqlNum,
    workflowID
  ]);

  const auditSql = async () => {
    startAudit();
    try {
      const values = await form.validateFields();
      const dataBaseInfo: Array<DatabaseInfoFields> =
        currentOrderTasks.map((v) => ({
          instanceName: v.instance_name ?? '',
          instanceSchema: v.instance_schema ?? ''
        })) ?? [];
      const instanceInfo: InstanceInfoType = new Map();
      if (sqlMode === WorkflowResV2ModeEnum.different_sqls) {
        SQLStatementInfo.forEach((v) => {
          instanceInfo.set(v.key, {
            instanceName: v.instanceName,
            instanceSchemaName: v.instanceSchemaName
          });
        });
      }
      await audit(
        {
          ...values,
          dataBaseInfo,
          isSameSqlOrder: sqlMode === WorkflowResV2ModeEnum.same_sqls,
          executeMode:
            executeMode as unknown as CreateAuditTasksGroupReqV1ExecModeEnum
        },
        instanceInfo
      );
    } finally {
      auditedFinish();
    }
  };

  const formatSql = async () => {
    const params = await form.getFieldsValue();
    if (sqlMode === WorkflowResV2ModeEnum.same_sqls) {
      const SQLStatementValue = params['0'] as SQLStatementFields;
      if (SQLStatementValue?.sqlInputType !== SQLInputType.manualInput) {
        return;
      }
      form.setFields([
        {
          name: ['0', 'sql'],
          value: formatterSQL(
            SQLStatementValue.sql,
            currentOrderTasks?.[0].instance_db_type
          )
        }
      ]);
    } else {
      const SQLStatementValue = params[
        sqlStatementFormTabsRef.current?.activeKey ?? ''
      ] as SQLStatementFields;

      if (SQLStatementValue?.sqlInputType !== SQLInputType.manualInput) {
        return;
      }
      form.setFields([
        {
          name: [sqlStatementFormTabsRef.current?.activeKey ?? '', 'sql'],
          value: formatterSQL(
            SQLStatementValue.sql,
            currentOrderTasks[sqlStatementFormTabsRef.current?.activeIndex ?? 0]
              ?.instance_db_type
          )
        }
      ]);
    }
  };

  const [sqlInputTypeMap, setSqlInputTypeMap] = useState<SQLInputTypeMapType>(
    new Map([['0', SQLInputType.manualInput]])
  );
  const [differentModeActiveKey, setDifferentModeActiveKey] =
    useState<string>('');

  const currentSQLInputType = useMemo(() => {
    return sqlInputTypeMap.get(differentModeActiveKey || '0');
  }, [differentModeActiveKey, sqlInputTypeMap]);

  const uploadTypeOptions = useMemo(() => {
    const sqlSource =
      sqlMode === WorkflowResV2ModeEnum.same_sqls
        ? currentOrderTasks[0]?.sql_source
        : currentOrderTasks.find(
            (v) => v.task_id?.toString() === differentModeActiveKey
          )?.sql_source;
    return defaultUploadTypeOptions.filter((item) => {
      if (!sqlSource) {
        return true;
      }

      if (sqlSource === AuditTaskResV1SqlSourceEnum.form_data) {
        return item.value === SQLInputType.manualInput;
      }

      if (sqlSource === AuditTaskResV1SqlSourceEnum.sql_file) {
        return item.value === SQLInputType.uploadFile;
      }

      if (sqlSource === AuditTaskResV1SqlSourceEnum.zip_file) {
        return item.value === SQLInputType.zipFile;
      }
      return true;
    });
  }, [currentOrderTasks, differentModeActiveKey, sqlMode]);

  const sqlStatementFormTabsChangeHandle = useCallback((activeKey: string) => {
    setDifferentModeActiveKey(activeKey);
  }, []);

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

      const formDataTasks = currentOrderTasks.filter(
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
                setSqlStatementValue((sql) => ({ ...sql, [v.taskId]: v.sql }));
              }
            });
          })
          .finally(() => {
            finishGetAllSqlStatement();
          });
      }
    };
    if (open) {
      getAllSqlStatement();
      if (sqlMode === WorkflowResV2ModeEnum.different_sqls) {
        sqlStatementFormTabsRef.current?.tabsChangeHandle(
          currentOrderTasks[0].task_id?.toString() ?? ''
        );
      }
    } else {
      setSqlStatementValue(undefined);
    }
  }, [
    currentOrderTasks,
    open,
    sqlMode,
    startGetAllSqlStatement,
    finishGetAllSqlStatement
  ]);

  return (
    <Spin spinning={getAllSqlStatementLoading} delay={400}>
      {contextHolder}
      <PageLayoutHasFixedHeaderStyleWrapper hidden={!open}>
        <PageHeader
          fixed
          title={
            <BasicButton icon={<IconLeftArrow />} onClick={cancel}>
              {t('order.operator.backToOrderDetail')}
            </BasicButton>
          }
          extra={
            <Space hidden={!modifiedOrderTasks?.length}>
              <BasicToolTips
                title={
                  isDisableFinallySubmitButton
                    ? disabledOperatorOrderBtnTips
                    : ''
                }
                overlayClassName="whitespace-pre-line"
              >
                <BasicButton
                  disabled={isDisableFinallySubmitButton || submitLoading}
                  type="primary"
                  onClick={modifySqlSubmit}
                >
                  {t('order.createOrder.submit')}
                </BasicButton>
              </BasicToolTips>
            </Space>
          }
        />
        <FormStyleWrapper
          form={form}
          className="hasTopHeader clearPaddingBottom"
          colon={false}
          layout="vertical"
          labelAlign="left"
        >
          <FormAreaLineStyleWrapper className="has-border">
            <FormAreaBlockStyleWrapper>
              <FormItemBigTitle>
                <IconOrderCreateTitleStyleWrapper />
                <span>{t('order.operator.modifySql')}</span>
              </FormItemBigTitle>
              <EmptyBox
                if={sqlMode === WorkflowResV2ModeEnum.different_sqls}
                defaultNode={
                  <SQLStatementForm
                    form={form}
                    sqlStatement={
                      sqlStatementValue?.[currentOrderTasks[0]?.task_id ?? '']
                    }
                    uploadTypeOptions={uploadTypeOptions}
                    sqlInputTypeMap={sqlInputTypeMap}
                    setSqlInputTypeMap={setSqlInputTypeMap}
                    autoSetDefaultSqlInput
                  />
                }
              >
                <SQLStatementFormTabs
                  ref={sqlStatementFormTabsRef}
                  form={form}
                  SQLStatementInfo={SQLStatementInfo}
                  uploadTypeOptions={uploadTypeOptions}
                  autoNavigateToLastTab={false}
                  tabsChangeHandle={sqlStatementFormTabsChangeHandle}
                  sqlInputTypeMap={sqlInputTypeMap}
                  setSqlInputTypeMap={setSqlInputTypeMap}
                  activeKey={differentModeActiveKey}
                  autoSetDefaultSqlInput
                />
              </EmptyBox>

              <Space>
                <BasicButton
                  type="primary"
                  onClick={auditSql}
                  loading={auditLoading || submitLoading}
                >
                  {t('order.sqlInfo.audit')}
                </BasicButton>
                <BasicButton
                  hidden={currentSQLInputType !== SQLInputType.manualInput}
                  onClick={formatSql}
                  loading={auditLoading || submitLoading}
                >
                  {t('order.sqlInfo.format')}
                </BasicButton>

                {currentSQLInputType === SQLInputType.manualInput && (
                  <BasicToolTips
                    prefixIcon={<IconTipGray />}
                    title={t('order.sqlInfo.formatTips', {
                      supportType: Object.keys(FormatLanguageSupport).join('、')
                    })}
                  />
                )}
              </Space>
            </FormAreaBlockStyleWrapper>
          </FormAreaLineStyleWrapper>
        </FormStyleWrapper>

        <EmptyBox if={!!modifiedOrderTasks?.length}>
          <AuditResultList
            tasks={modifiedOrderTasks!}
            projectID={projectID}
            updateTaskRecordTotalNum={updateTaskRecordTotalNum}
          />
        </EmptyBox>
      </PageLayoutHasFixedHeaderStyleWrapper>
    </Spin>
  );
};

export default ModifySQL;
