import { useTranslation } from 'react-i18next';
import React, { useEffect } from 'react';
import { Form, message } from 'antd';
import {
  ActionButton,
  BasicButton,
  PageHeader,
  BasicResult,
  EmptyBox
} from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import BaseInfoForm from './BaseInfoForm';
import SQLInfoForm from './SQLInfoForm';
import { BaseFormFields, SqlInfoFormFields } from '../index.type';
import sqlOptimization from '@actiontech/shared/lib/api/sqle/service/sql_optimization';
import { useBoolean } from 'ahooks';
import dayjs from 'dayjs';
import { OptimizationNameUploadTypePrefix } from '../index.data';
import { LeftArrowOutlined } from '@actiontech/icons';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { SqlAuditSegmentedKey } from '../../SqlAudit/index.type';

// todo 后续统一移除掉 context 尽量统一用 redux 来管理
export const FormSubmitStatusContext = React.createContext<boolean>(false);

const SqlOptimizationCreate = () => {
  const { t } = useTranslation();

  const { projectID, projectName } = useCurrentProject();

  const [baseForm] = Form.useForm<BaseFormFields>();

  const [sqlInfoForm] = Form.useForm<SqlInfoFormFields>();

  const uploadType = Form.useWatch('uploadType', sqlInfoForm);

  const [messageApi, messageContextHolder] = message.useMessage();

  const [
    submitLoading,
    { setTrue: setSubmitPending, setFalse: setSubmitDone }
  ] = useBoolean();

  const [
    submitSuccessStatus,
    { setTrue: setSubmitSuccessStatus, setFalse: setSubmitSuccessStatusFalse }
  ] = useBoolean();

  const onSubmit = async () => {
    const baseValue = await baseForm.validateFields();
    const sqlInfoValue = await sqlInfoForm.validateFields();
    setSubmitPending();

    sqlOptimization
      .SQLOptimizeV2({
        optimization_name: baseValue.optimizationName,
        project_name: projectName,
        instance_name: sqlInfoValue.instanceName,
        schema_name: sqlInfoValue.instanceSchema,
        sql_content: sqlInfoValue.sql,
        input_sql_file: sqlInfoValue.sqlFile?.[0],
        input_mybatis_xml_file: sqlInfoValue.mybatisFile?.[0],
        input_zip_file: sqlInfoValue.zipFile?.[0],
        git_http_url: sqlInfoValue.gitHttpUrl,
        git_user_name: sqlInfoValue.gitUserName,
        git_user_password: sqlInfoValue.gitUserPassword
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('sqlOptimization.create.successTips'));
          setSubmitSuccessStatus();
        }
      })
      .finally(() => {
        setSubmitDone();
      });
  };

  const onResetForm = () => {
    sqlInfoForm.resetFields();
    setSubmitSuccessStatusFalse();
  };

  useEffect(() => {
    baseForm.setFieldsValue({
      optimizationName: `${
        OptimizationNameUploadTypePrefix[uploadType]
      }${dayjs().format('YYYYMMDDhhmmssSSS')}`
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadType]);

  return (
    <>
      {messageContextHolder}
      <PageHeader
        fixed
        title={
          <ActionButton
            icon={<LeftArrowOutlined />}
            text={t('sqlOptimization.create.returnButton')}
            actionType="navigate-link"
            link={{
              to: ROUTE_PATHS.SQLE.SQL_AUDIT.index,
              params: { projectID },
              queries: { active: SqlAuditSegmentedKey.SqlOptimization }
            }}
          />
        }
        extra={
          <EmptyBox if={!submitSuccessStatus}>
            <BasicButton onClick={onResetForm} loading={submitLoading}>
              {t('common.reset')}
            </BasicButton>
          </EmptyBox>
        }
      />
      <EmptyBox
        if={!submitSuccessStatus}
        defaultNode={
          <BasicResult
            title={t('sqlOptimization.create.resultTips')}
            extra={[
              <BasicButton key="reset" onClick={onResetForm}>
                {t('sqlOptimization.create.resetForm')}
              </BasicButton>
            ]}
          />
        }
      >
        <FormSubmitStatusContext.Provider value={submitLoading}>
          <BaseInfoForm form={baseForm} />
          <SQLInfoForm form={sqlInfoForm} submit={onSubmit} />
        </FormSubmitStatusContext.Provider>
      </EmptyBox>
    </>
  );
};

export default SqlOptimizationCreate;
