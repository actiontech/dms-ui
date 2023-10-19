import { TableOperatorColumnName } from '~/data/common';
import { t } from '~/locale';
import { TableColumn } from '~/types/common.type';
import { formatTime } from '~/utils/Common';
import { Link } from '../../../components/Link';
import { IListDataObjectServiceEvent } from '@actiontech/shared/lib/api/provision/service/common';

export const serviceAuditTableColumns = (
  projectId: string
): TableColumn<IListDataObjectServiceEvent, 'operator'> => {
  return [
    {
      dataIndex: 'generated_time',
      title: t('provisionAudit.authAudit.columns.time'),
      width: 180,
      render: (time: string) => formatTime(time)
    },
    {
      dataIndex: 'data_object_service_name',
      title: t('provisionAudit.serviceAudit.columns.service')
    },
    {
      dataIndex: 'business',
      title: t('provisionAudit.serviceAudit.columns.business')
    },
    {
      dataIndex: 'operation',
      title: t('provisionAudit.serviceAudit.columns.statement')
    },
    {
      dataIndex: TableOperatorColumnName,
      title: t('common.operate'),
      fixed: 'right',
      width: 70,
      render(_, record) {
        return (
          <Link to={`${projectId}/audit/service/${record.event_uid}`}>
            {t('auth.columns.details')}
          </Link>
        );
      }
    }
  ];
};
