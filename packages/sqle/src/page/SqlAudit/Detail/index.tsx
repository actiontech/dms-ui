import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useRequest } from 'ahooks';
import { Spin } from 'antd';
import { BasicButton, PageHeader } from '@actiontech/shared';
import BasicInfoWrapper from './BasicInfoWrapper';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import sql_audit_record from '@actiontech/shared/lib/api/sqle/service/sql_audit_record';
import { useMemo } from 'react';
import AuditResultList from '../../SqlExecWorkflow/Common/AuditResultList';
import { PlusOutlined, LeftArrowOutlined } from '@actiontech/icons';

const SqlAuditDetail = () => {
  const { t } = useTranslation();

  const { sql_audit_record_id } = useParams<{ sql_audit_record_id: string }>();
  const { projectID, projectName, projectArchive } = useCurrentProject();

  // api
  const { data: pluginAuditRecord, loading: dataLoading } = useRequest(() =>
    sql_audit_record
      .getSQLAuditRecordV1({
        project_name: projectName,
        sql_audit_record_id: sql_audit_record_id ?? ''
      })
      .then((res) => res.data.data)
  );

  const basicInfoData = useMemo(() => {
    return {
      id: pluginAuditRecord?.sql_audit_record_id ?? '',
      tags: pluginAuditRecord?.tags ?? [],
      status: pluginAuditRecord?.sql_audit_status,
      task: pluginAuditRecord?.task
    };
  }, [pluginAuditRecord]);

  const auditResultData = useMemo(() => {
    return pluginAuditRecord?.task ? [pluginAuditRecord?.task] : [];
  }, [pluginAuditRecord]);

  return (
    <>
      <Spin spinning={dataLoading}>
        <PageHeader
          fixed
          title={
            <Link to={`/sqle/project/${projectID}/sql-audit`}>
              <BasicButton icon={<LeftArrowOutlined />}>
                {t('sqlAudit.common.goBackList')}
              </BasicButton>
            </Link>
          }
          extra={
            !projectArchive ? (
              <Link to={`/sqle/project/${projectID}/sql-audit/create`}>
                <BasicButton
                  type="primary"
                  icon={
                    <PlusOutlined color="currentColor" width={10} height={10} />
                  }
                >
                  {t('sqlAudit.list.action.create')}
                </BasicButton>
              </Link>
            ) : null
          }
        />
        <div
          className="hasTopHeader clearPaddingBottom"
          style={{ height: '60px' }}
        />
        <BasicInfoWrapper {...basicInfoData} />
        <AuditResultList tasks={auditResultData} showTaskTab={false} />
      </Spin>
    </>
  );
};

export default SqlAuditDetail;
