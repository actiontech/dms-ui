import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import { Spin } from 'antd';
import { PageHeader } from '@actiontech/dms-kit';
import { ActionButton, useTypedParams } from '@actiontech/shared';
import BasicInfoWrapper from './BasicInfoWrapper';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import sql_audit_record from '@actiontech/shared/lib/api/sqle/service/sql_audit_record';
import { useMemo } from 'react';
import AuditResultList from '../../SqlExecWorkflow/Common/AuditResultList';
import { LeftArrowOutlined } from '@actiontech/icons';
import { SqlAuditPageHeaderActions } from '../List/actions';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
const SqlAuditDetail = () => {
  const { t } = useTranslation();
  const { sql_audit_record_id } =
    useTypedParams<typeof ROUTE_PATHS.SQLE.SQL_AUDIT.detail>();
  const { projectID, projectName } = useCurrentProject();

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
  const pageHeaderActions = SqlAuditPageHeaderActions(projectID);
  return (
    <>
      <Spin spinning={dataLoading}>
        <PageHeader
          fixed
          title={
            <ActionButton
              icon={<LeftArrowOutlined />}
              text={t('sqlAudit.common.goBackList')}
              actionType="navigate-link"
              link={{
                to: ROUTE_PATHS.SQLE.SQL_AUDIT.index,
                params: {
                  projectID
                }
              }}
            />
          }
          extra={pageHeaderActions['create-audit']}
        />
        <div
          className="hasTopHeader clearPaddingBottom"
          style={{
            height: '60px'
          }}
        />
        <BasicInfoWrapper {...basicInfoData} />
        <AuditResultList tasks={auditResultData} showTaskTab={false} />
      </Spin>
    </>
  );
};
export default SqlAuditDetail;
