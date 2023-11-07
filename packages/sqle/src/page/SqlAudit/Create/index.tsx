import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { BasicButton, PageHeader } from '@actiontech/shared';
import { IconLeftArrow } from '@actiontech/shared/lib/Icon/common';
import { useForm } from 'antd5/es/form/Form';
import BaseInfoForm from './BaseInfoForm';
import SQLInfoForm from './SQLInfoForm';

import { useCurrentProject } from '@actiontech/shared/lib/global';
import sql_audit_record from '@actiontech/shared/lib/api/sqle/service/sql_audit_record';
import { SqlAuditBaseInfoFormFields } from './BaseInfoForm/index.type';
import { SQLInfoFormFields, SQLInfoFormProps } from './SQLInfoForm/index.type';
import { ICreateSQLAuditRecordV1Params } from '@actiontech/shared/lib/api/sqle/service/sql_audit_record/index.d';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { message } from 'antd5';
import { ISQLAuditRecordResData } from '@actiontech/shared/lib/api/sqle/service/common';
import { useEffect, useState } from 'react';

const SqlAuditCreate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectID, projectName } = useCurrentProject();
  const [messageApi, messageContextHolder] = message.useMessage();

  const [baseForm] = useForm<SqlAuditBaseInfoFormFields>();
  const [sqlInfoForm] = useForm<SQLInfoFormFields>();
  // sql_audit_record_id
  const [auditId, setAuditId] = useState<string>('');

  const auditSQL: SQLInfoFormProps['submit'] = async (values) => {
    const baseValues = await baseForm.validateFields();
    const params: ICreateSQLAuditRecordV1Params = {
      project_name: projectName,
      sqls: values.sql,
      input_sql_file: values.sqlFile?.[0],
      input_mybatis_xml_file: values.mybatisFile?.[0],
      input_zip_file: values.zipFile?.[0],
      instance_name: values.instanceName,
      instance_schema: values.instanceSchema,
      db_type: values.dbType,
      git_http_url: values.gitHttpUrl,
      git_user_name: values.gitUserName,
      git_user_password: values.gitUserPassword
    };

    return sql_audit_record.CreateSQLAuditRecordV1(params).then((res) => {
      if (res.data.code === ResponseCode.SUCCESS && res.data.data) {
        if ((baseValues.tags?.length ?? 0) > 0) {
          return updateTags(res.data.data, baseValues);
        } else {
          setAuditId(res.data.data.sql_audit_record_id ?? '');
          messageApi.success(t('sqlAudit.create.successTips'));
        }
      }
    });
  };

  const updateTags = async (
    record: ISQLAuditRecordResData,
    values: SqlAuditBaseInfoFormFields
  ) => {
    return sql_audit_record
      .updateSQLAuditRecordV1({
        tags: values.tags,
        sql_audit_record_id: record.sql_audit_record_id ?? '',
        project_name: projectName
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setAuditId(record.sql_audit_record_id ?? '');
          messageApi.success(t('sqlAudit.create.successTips'));
        }
      });
  };

  const onResetForm = () => {
    baseForm.resetFields();
    sqlInfoForm.resetFields();
  };

  useEffect(() => {
    auditId &&
      navigate(`/sqle/project/${projectID}/sqlAudit/detail/${auditId}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auditId]);

  return (
    <>
      {messageContextHolder}
      <PageHeader
        fixed
        title={
          <Link to={`/sqle/project/${projectID}/sqlAudit`}>
            <BasicButton icon={<IconLeftArrow />}>
              {t('sqlAudit.common.goBackList')}
            </BasicButton>
          </Link>
        }
        extra={
          <BasicButton onClick={onResetForm}>{t('common.reset')}</BasicButton>
        }
      />
      <BaseInfoForm form={baseForm} />
      <SQLInfoForm form={sqlInfoForm} submit={auditSQL} />
    </>
  );
};

export default SqlAuditCreate;
