import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useRequest } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { detailsColumns } from '~/page/Audit/AuthAuditDetail/TableColumns';
import AuditDetail from '~/page/Audit/common/AuditDetails';
import { getErrorMessage } from '~/utils/Common';

const AuthAuditDetail = () => {
  const params = useParams();
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();

  const { data, loading, error } = useRequest(
    () =>
      auth
        .AuditListAuthorizationEvents({
          page_index: 1,
          page_size: 999,
          filter_by_event_uid: params.id,
          filter_by_namespace_uid: projectID
        })
        .then((res) => res.data.data),
    {
      ready: !!params.id,
      refreshDeps: [projectID]
    }
  );

  return (
    <AuditDetail
      title={t('provisionAudit.authAuditDetail.title')}
      dataSource={data?.[0]}
      columns={detailsColumns}
      loading={loading}
      error={getErrorMessage(error ?? '')}
    />
  );
};

export default AuthAuditDetail;
