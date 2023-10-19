import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { detailsColumns } from './columns';
import AuditDetail from '~/page/Audit/common/AuditDetails';
import { useRequest } from 'ahooks';
import { getErrorMessage } from '~/utils/Common';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import auth from '@actiontech/shared/lib/api/provision/service/auth';

const AuthAuditDetail = () => {
  const params = useParams();
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();

  const { data, loading, error } = useRequest(
    () =>
      auth
        .AuditListDataPermissionTemplateEvents({
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
  return data?.length ? (
    <AuditDetail
      title={t('provisionAudit.templateAuditDetail.title')}
      dataSource={data[0]}
      columns={detailsColumns}
      loading={loading}
      error={getErrorMessage(error ?? '')}
    />
  ) : null;
};

export default AuthAuditDetail;
