import {
  IListAuthorizationEvent,
  IDataPermissionTemplateReply
} from '@actiontech/shared/lib/api/provision/service/common';
import { Tag } from 'antd';
import { t } from '~/locale';
import { eventType } from '~/page/Audit/AuthAudit/TableColumns';
import { columnType, IColumns } from '~/page/Audit/common/AuditDetails.d';
import { TableColumn } from '~/types/common.type';
import { formatTime } from '~/utils/Common';

export const databaseAccountDetailColumns: TableColumn<IListAuthorizationEvent> =
  [
    {
      dataIndex: 'db_account_name',
      title: t('provisionAudit.authAuditDetail.columns.username')
    },
    {
      dataIndex: 'db_account_hostname',
      title: t('provisionAudit.authAuditDetail.columns.hostname')
    },
    {
      dataIndex: 'db_account_explanation',
      title: t('provisionAudit.authAuditDetail.columns.explain')
    }
  ];
export const detailsColumns: IColumns<IListAuthorizationEvent>[] = [
  {
    type: columnType.action,
    key: 'generated_time',
    label: t('provisionAudit.authAuditDetail.time'),
    render: (val) => formatTime(val)
  },
  {
    type: columnType.action,
    key: 'event_type',
    label: t('provisionAudit.authAuditDetail.type'),
    render: (val) => eventType[val] ?? '--'
  },
  {
    type: columnType.object,
    key: 'permission_user_name',
    label: t('provisionAudit.authAuditDetail.authUser')
  },
  {
    type: columnType.object,
    key: 'purpose',
    label: t('provisionAudit.authAuditDetail.purpose')
  },
  {
    type: columnType.object,
    key: 'executing_user_name',
    label: t('provisionAudit.authAuditDetail.actionUser')
  },
  {
    type: columnType.object,
    key: 'data_permission_templates',
    label: t('provisionAudit.authAuditDetail.template'),
    render: (val: IDataPermissionTemplateReply[]) => {
      return val.map((item) => <Tag key={item.uid}>{item.name}</Tag>);
    }
  },
  {
    type: columnType.object,
    key: 'memo',
    label: t('provisionAudit.authAuditDetail.memo')
  },
  {
    type: columnType.table,
    key: 'db_account_name',
    label: t('provisionAudit.authAuditDetail.details'),
    render: (val, record) => {
      return [
        {
          db_account_name: record.db_account_name,
          db_account_hostname: record.db_account_hostname,
          db_account_explanation: record.db_account_explanation
        }
      ];
    },
    columns: databaseAccountDetailColumns
  }
];
