import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { Form, message } from 'antd';
import { BasicButton, PageHeader } from '@actiontech/shared';
import { IconLeftArrow } from '@actiontech/shared/lib/Icon/common';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import BaseInfoForm from './BaseInfoForm';
import SQLInfoForm from './SQLInfoForm';
import { BaseFormFields, SqlInfoFormFields } from '../index.type';
import sqlOptimization from '@actiontech/shared/lib/api/sqle/service/sql_optimization';
import { useBoolean } from 'ahooks';
import dayjs from 'dayjs';
import { OptimizationNameUploadTypePrefix } from '../index.data';

export const FormSubmitStatusContext = React.createContext<boolean>(false);

const SqlOptimizationCreate = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { projectID, projectName } = useCurrentProject();

  const [baseForm] = Form.useForm<BaseFormFields>();

  const [sqlInfoForm] = Form.useForm<SqlInfoFormFields>();

  const uploadType = Form.useWatch('uploadType', sqlInfoForm);

  const [messageApi, messageContextHolder] = message.useMessage();

  const [
    submitLoading,
    { setTrue: setSubmitPending, setFalse: setSubmitDone }
  ] = useBoolean();

  const onSubmit = async () => {
    const baseValue = await baseForm.validateFields();
    const sqlInfoValue = await sqlInfoForm.validateFields();
    setSubmitPending();

    sqlOptimization
      .OptimizeSQLReq({
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
          navigate(
            `/sqle/project/${projectID}/sql-optimization/overview/${res.data.data?.sql_optimization_record_id}`
          );
        }
      })
      .finally(() => {
        setSubmitDone();
      });
  };

  const onResetForm = () => {
    sqlInfoForm.resetFields();
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
          <Link to={`/sqle/project/${projectID}/sql-optimization`}>
            <BasicButton icon={<IconLeftArrow />}>
              {t('sqlOptimization.create.returnButton')}
            </BasicButton>
          </Link>
        }
        extra={
          <BasicButton onClick={onResetForm} loading={submitLoading}>
            {t('common.reset')}
          </BasicButton>
        }
      />
      <FormSubmitStatusContext.Provider value={submitLoading}>
        <BaseInfoForm form={baseForm} />
        <SQLInfoForm form={sqlInfoForm} submit={onSubmit} />
      </FormSubmitStatusContext.Provider>
    </>
  );
};

export default SqlOptimizationCreate;
