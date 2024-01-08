import { BasicButton, EmptyBox, PageHeader } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
import BaseInfoForm from './BaseInfoForm';
import { useForm } from 'antd/es/form/Form';
import { OrderBaseInfoFormFields } from './BaseInfoForm/index.type';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import SQLInfoForm from './SQLInfoForm';
import { SQLInfoFormFields } from './SQLInfoForm/index.type';
import useAuditOrder from '../hooks/useAuditOrder';
import { useCallback, useState } from 'react';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import moment from 'moment';
import { useBoolean } from 'ahooks';
import { Spin, message } from 'antd';
import AuditResultForCreateOrder from './AuditResult';
import { IconLeftArrow } from '@actiontech/shared/lib/Icon/common';
import EditSQLInfoDrawer from './EditSQLInfoDrawer';
import useCreateOrderFormState from './hooks/useCreateOrderFormState';
import { AuditTaskResV1SqlSourceEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { ICreateWorkflowV2Params } from '@actiontech/shared/lib/api/sqle/service/workflow/index.d';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { cloneDeep } from 'lodash';
import CreatedResult from './CreatedResult';
import OrderPageHeaderExtra from './PageHeaderExtra';
import useCreateOrderSteps from './hooks/useCreateOrderSteps';

const Create: React.FC = () => {
  const { t } = useTranslation();
  const { username } = useCurrentUser();
  const { projectID, projectName } = useCurrentProject();
  const [baseForm] = useForm<OrderBaseInfoFormFields>();
  const [sqlInfoForm] = useForm<SQLInfoFormFields>();
  const [messageApi, contextHolder] = message.useMessage();
  const [createdOrderId, setCreatedOrderId] = useState('');

  const [
    editSQLInfoDrawerOpen,
    { setFalse: closeEditSQLInfoDrawer, setTrue: openEditSQLInfoDrawer }
  ] = useBoolean(false);
  const [createLoading, { setTrue: startCreate, setFalse: createFinish }] =
    useBoolean();

  const { showForm, showResult, showResultAction, showTasks, showTasksAction } =
    useCreateOrderSteps();

  const {
    taskInfos,
    auditOrderWithSameSql,
    auditOrderWthDifferenceSql,
    isDisableFinallySubmitButton,
    disabledOperatorOrderBtnTips
  } = useAuditOrder();

  const {
    instanceInfo,
    setInstanceInfo,
    auditLoading,
    finishAudit,
    startAudit,
    ...otherStates
  } = useCreateOrderFormState();

  const instanceNameChange = async (name: string) => {
    const orderName = baseForm.getFieldValue('workflow_subject');
    if (!orderName) {
      baseForm.setFieldsValue({
        workflow_subject: `${name}_${moment().format('YYYYMMDDhhmmss')}`
      });
    }
  };

  const [taskSqlNum, setTaskSqlNum] = useState<Map<string, number>>(new Map());
  useState<Map<number, string>>(new Map());
  const updateTaskRecordTotalNum = (taskId: string, sqlNumber: number) => {
    setTaskSqlNum((v) => {
      const cloneValue = cloneDeep(v);
      cloneValue?.set(taskId, sqlNumber);
      return cloneValue;
    });
  };

  const auditSql = useCallback(
    async (values: SQLInfoFormFields, baseInfo?: OrderBaseInfoFormFields) => {
      const finallyFn = () => {
        if (baseInfo) {
          baseForm.setFieldsValue(baseInfo);
        } else {
          showTasksAction();
        }
        if (editSQLInfoDrawerOpen) {
          closeEditSQLInfoDrawer();
        }
        finishAudit();
      };
      startAudit();

      if (values.isSameSqlOrder) {
        auditOrderWithSameSql(values).finally(finallyFn);
      } else {
        auditOrderWthDifferenceSql(values, instanceInfo).finally(finallyFn);
      }
    },
    [
      auditOrderWithSameSql,
      auditOrderWthDifferenceSql,
      baseForm,
      closeEditSQLInfoDrawer,
      editSQLInfoDrawerOpen,
      finishAudit,
      instanceInfo,
      showTasksAction,
      startAudit
    ]
  );

  const create = async () => {
    const baseInfo = await baseForm.validateFields();
    // if (
    //   taskInfos?.some(
    //     (v) => v.sql_source === AuditTaskResV1SqlSourceEnum.mybatis_xml_file
    //   )
    // ) {
    //   messageApi.error(t('order.createOrder.unsupportMybatisTips'));
    //   return;
    // }
    if (!taskInfos?.length) {
      messageApi.error(t('order.createOrder.mustAuditTips'));
      return;
    }
    if (
      Array.from(taskSqlNum).some(([task, len]) => {
        return (
          taskInfos.some((v) => v.task_id?.toString() === task) && len === 0
        );
      })
    ) {
      messageApi.error(t('order.createOrder.mustHaveAuditResultTips'));
      return;
    }
    startCreate();
    const createWorkflowParam: ICreateWorkflowV2Params = {
      task_ids: taskInfos.map((v) => v.task_id!),
      desc: baseInfo?.desc,
      workflow_subject: baseInfo?.workflow_subject,
      project_name: projectName
    };
    workflow
      .createWorkflowV2(createWorkflowParam)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          showResultAction();
          setCreatedOrderId(res.data.data?.workflow_id ?? '');
        }
      })
      .finally(() => {
        createFinish();
      });
  };

  const resetAllForm = useCallback(() => {
    baseForm.resetFields();
    sqlInfoForm.resetFields();
    EventEmitter.emit(EmitterKey.Reset_Create_Order_Form);
  }, [baseForm, sqlInfoForm]);

  return (
    <Spin spinning={auditLoading}>
      {contextHolder}
      <PageLayoutHasFixedHeaderStyleWrapper>
        <PageHeader
          fixed={showForm}
          title={
            <Link to={`/sqle/project/${projectID}/order`}>
              <BasicButton icon={<IconLeftArrow />} disabled={auditLoading}>
                {t('order.createOrder.backToList')}
              </BasicButton>
            </Link>
          }
          extra={
            <OrderPageHeaderExtra
              showCreateOrderForm={showForm}
              createdResultVisibility={showResult}
              create={create}
              openEditSQLInfoDrawer={openEditSQLInfoDrawer}
              isDisableFinallySubmitButton={isDisableFinallySubmitButton}
              disabledOperatorOrderBtnTips={disabledOperatorOrderBtnTips}
              auditLoading={auditLoading}
              createLoading={createLoading}
              resetAllForm={resetAllForm}
            />
          }
        />

        <div hidden={!showForm}>
          <BaseInfoForm form={baseForm} />
          <SQLInfoForm
            form={sqlInfoForm}
            submit={auditSql}
            instanceNameChange={instanceNameChange}
            projectName={projectName}
            projectID={projectID}
            instanceInfo={instanceInfo}
            setInstanceInfo={setInstanceInfo}
            auditLoading={auditLoading}
            {...otherStates}
          />
        </div>
        <EmptyBox if={showTasks}>
          <AuditResultForCreateOrder
            tasks={taskInfos}
            baseInfo={baseForm.getFieldsValue()}
            projectID={projectID}
            updateTaskRecordTotalNum={updateTaskRecordTotalNum}
          />
        </EmptyBox>
      </PageLayoutHasFixedHeaderStyleWrapper>

      <EditSQLInfoDrawer
        username={username}
        open={editSQLInfoDrawerOpen}
        onClose={closeEditSQLInfoDrawer}
        baseFormValues={baseForm.getFieldsValue()}
        sqlInfoFormValues={sqlInfoForm.getFieldsValue()}
        submit={auditSql}
        instanceNameChange={instanceNameChange}
        projectName={projectName}
        projectID={projectID}
        instanceInfo={instanceInfo}
        setInstanceInfo={setInstanceInfo}
        auditLoading={auditLoading}
        {...otherStates}
      />

      <CreatedResult
        createdOrderId={createdOrderId}
        desc={baseForm.getFieldsValue()?.desc ?? ''}
        hidden={!showResult}
        projectID={projectID}
      />
    </Spin>
  );
};

export default Create;
