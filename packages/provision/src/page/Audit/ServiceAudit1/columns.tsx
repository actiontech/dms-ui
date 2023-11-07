import {
  ActiontechTableColumn,
  PageInfoWithoutIndexAndSize,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IListDataObjectServiceEvent } from '@actiontech/shared/lib/api/provision/service/common';
import { formatTime } from '~/utils/Common';
import { t } from '~/locale';
import { IAuditListDataObjectServiceEventsParams } from '@actiontech/shared/lib/api/provision/service/auth/index.d';

export type ServiceAuditTableFilterParamType = PageInfoWithoutIndexAndSize<
  IAuditListDataObjectServiceEventsParams & {
    page_index: number;
  }
>;

export const ServiceAuditTableColumns: ActiontechTableColumn<
  IListDataObjectServiceEvent,
  ServiceAuditTableFilterParamType
> = [
  {
    dataIndex: 'generated_time',
    title: t('provisionAudit.authAudit.columns.time'),
    render: (time: string) => formatTime(time),
    filterCustomType: 'date-range',
    filterKey: [
      'filter_by_generated_time_start',
      'filter_by_generated_time_end'
    ]
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
  }
];

export const ServiceAuditTableActions = (
  gotoDetail: (record?: IListDataObjectServiceEvent) => void
): ActiontechTableActionMeta<IListDataObjectServiceEvent>[] => [
  {
    text: t('auth.columns.details'),
    key: 'serviceAuditDetailBtn',
    buttonProps: (record) => {
      return {
        onClick: () => {
          gotoDetail(record);
        }
      };
    }
  }
];
