import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { Form, message } from 'antd';
import {
  BasicButton,
  PageHeader,
  BasicResult,
  EmptyBox
} from '@actiontech/dms-kit';
import { ActionButton } from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { ResponseCode } from '@actiontech/dms-kit';
import BaseInfoForm from './BaseInfoForm';
import SQLInfoForm from './SQLInfoForm';
import {
  BaseFormFields,
  OptimizationTypeEnum,
  SqlInfoFormFields,
  UploadTypeEnum
} from '../index.type';
import sqlOptimization from '@actiontech/shared/lib/api/sqle/service/sql_optimization';
import { useBoolean } from 'ahooks';
import dayjs from 'dayjs';
import { OptimizationNameUploadTypePrefix } from '../index.data';
import { LeftArrowOutlined } from '@actiontech/icons';
import { ROUTE_PATHS, isSupportLanguage } from '@actiontech/dms-kit';
import { SqlAuditSegmentedKey } from '../../SqlAudit/index.type';
import { useDispatch, useSelector } from 'react-redux';
import { updateSubmitLoading } from '../../../store/sqlOptimization';
import { IReduxState } from '../../../store';

const SqlOptimizationCreate = () => {
  const { t } = useTranslation();

  const { projectID, projectName } = useCurrentProject();
  const [baseForm] = Form.useForm<BaseFormFields>();
  const [sqlInfoForm] = Form.useForm<SqlInfoFormFields>();
  const uploadType = Form.useWatch('uploadType', sqlInfoForm);
  const [messageApi, messageContextHolder] = message.useMessage();

  const dispatch = useDispatch();

  const submitLoading = useSelector(
    (state: IReduxState) => state.sqlOptimization.submitLoading
  );

  const [
    submitSuccessStatus,
    { setTrue: setSubmitSuccessStatus, setFalse: setSubmitSuccessStatusFalse }
  ] = useBoolean();
  const onSubmit = async () => {
    const baseValue = await baseForm.validateFields();
    const sqlInfoValue = await sqlInfoForm.validateFields();
    dispatch(updateSubmitLoading({ loading: true }));
    const formattedSql =
      sqlInfoValue.optimizationType === OptimizationTypeEnum.online
        ? sqlInfoValue.sql
        : sqlInfoValue.offlineSql;
    const sql = isSupportLanguage(sqlInfoValue.dbType)
      ? formattedSql
      : sqlInfoValue.originSql;
    sqlOptimization
      .SQLOptimizeV2({
        optimization_name: baseValue.optimizationName,
        project_name: projectName,
        instance_name: sqlInfoValue.instanceName,
        schema_name: sqlInfoValue.instanceSchema,
        db_type: sqlInfoValue.dbType,
        sql_content: sql,
        metadata: sqlInfoValue.tableStructure,
        explain_info: sqlInfoValue.executionPlan,
        input_sql_file: sqlInfoValue.sqlFile?.[0],
        input_mybatis_xml_file: sqlInfoValue.mybatisFile?.[0],
        input_zip_file: sqlInfoValue.zipFile?.[0],
        git_http_url: sqlInfoValue.gitHttpUrl,
        git_user_name: sqlInfoValue.gitUserName,
        git_user_password: sqlInfoValue.gitUserPassword,
        enable_high_analysis: sqlInfoValue.enableHighAnalysis
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('sqlOptimization.create.successTips'));
          setSubmitSuccessStatus();
        }
      })
      .finally(() => {
        dispatch(updateSubmitLoading({ loading: false }));
      });
  };
  const onResetForm = () => {
    sqlInfoForm.resetFields();
    setSubmitSuccessStatusFalse();
  };
  useEffect(() => {
    baseForm.setFieldsValue({
      optimizationName: `${
        OptimizationNameUploadTypePrefix[uploadType ?? UploadTypeEnum.sql]
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
        <BaseInfoForm form={baseForm} />
        <SQLInfoForm form={sqlInfoForm} submit={onSubmit} />
      </EmptyBox>
    </>
  );
};
export default SqlOptimizationCreate;
