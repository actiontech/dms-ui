import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useRequest } from 'ahooks';

import { Spin } from 'antd5';
import { BasicButton, PageHeader } from '@actiontech/shared';
import { IconLeftArrow } from '@actiontech/shared/lib/Icon/common';
import BasicInfoWrapper from './BasicInfoWrapper';

import { useCurrentProject } from '@actiontech/shared/lib/global';
import sql_audit_record from '@actiontech/shared/lib/api/sqle/service/sql_audit_record';
import { useMemo } from 'react';
import AuditDetail from '../../Order/AuditDetail';

const SqlAuditDetail = () => {
  const { t } = useTranslation();

  const { sql_audit_record_id } = useParams<{ sql_audit_record_id: string }>();
  const { projectID, projectName } = useCurrentProject();

  // api
  const { data: auditRecord, loading: dataLoading } = useRequest(() =>
    sql_audit_record
      .getSQLAuditRecordV1({
        project_name: projectName,
        sql_audit_record_id: sql_audit_record_id ?? ''
      })
      .then((res) => res.data.data)
  );

  const basicInfoData = useMemo(() => {
    return {
      id: auditRecord?.sql_audit_record_id ?? '',
      tags: auditRecord?.tags ?? [],
      status: auditRecord?.sql_audit_status,
      task: auditRecord?.task
    };
  }, [auditRecord]);

  const auditResultData = useMemo(() => {
    return auditRecord?.task;
  }, [auditRecord]);

  return (
    <>
      <Spin spinning={dataLoading}>
        <PageHeader
          title={
            <Link to={`/sqle/project/${projectID}/sqlAudit`}>
              <BasicButton icon={<IconLeftArrow />}>
                {t('sqlAudit.common.goBackList')}
              </BasicButton>
            </Link>
          }
        />
        <BasicInfoWrapper {...basicInfoData} />
        <AuditDetail
          mode="auditRecordDetail"
          projectName={projectName}
          taskId={
            auditRecord?.task?.task_id
              ? `${auditRecord?.task?.task_id}`
              : undefined
          }
          taskInfos={auditResultData ? [auditResultData] : undefined}
        />
      </Spin>
    </>
  );
};

export default SqlAuditDetail;
