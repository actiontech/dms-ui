import { IListDataObjectServiceEvent } from '@actiontech/shared/lib/api/provision/service/common';
import { t } from '~/locale';
import { columnType, IColumns } from '~/page/Audit/common/AuditDetails.d';
import { formatTime } from '~/utils/Common';

export const detailsColumns: IColumns<IListDataObjectServiceEvent>[] = [
  {
    type: columnType.action,
    key: 'generated_time',
    label: t('provisionAudit.authAuditDetail.time'),
    render: (val) => formatTime(val)
  },
  {
    type: columnType.object,
    key: 'data_object_service_name',
    label: t('provisionAudit.serviceAudit.columns.service')
  },
  {
    type: columnType.object,
    key: 'business',
    label: t('provisionAudit.serviceAudit.columns.business')
  },
  {
    type: columnType.object,
    key: 'operation',
    label: t('common.operate')
  },
  {
    type: columnType.object,
    key: 'operation',
    label: t('provisionAudit.serviceAuditDetail.operateResult'),
    render: () => 'success'
  }
];
