import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import { BasicButton, PageHeader } from '@actiontech/shared';
import { IconLeftArrow } from '@actiontech/shared/lib/Icon/common';
import { useForm } from 'antd5/es/form/Form';
import BaseInfoForm from './BaseInfoForm';

import { useCurrentProject } from '@actiontech/shared/lib/global';
import sql_audit_record from '@actiontech/shared/lib/api/sqle/service/sql_audit_record';
import { SqlAuditBaseInfoFormFields } from './BaseInfoForm/index.type';

const SqlAuditCreate = () => {
  const { t } = useTranslation();
  const { projectID, projectName } = useCurrentProject();

  const [baseForm] = useForm<SqlAuditBaseInfoFormFields>();

  const onResetForm = () => {
    //
  };

  return (
    <>
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
      SqlAuditCreate
    </>
  );
};

export default SqlAuditCreate;
