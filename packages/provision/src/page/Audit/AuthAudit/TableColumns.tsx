import { Tag } from 'antd';
import { TableOperatorColumnName } from '~/data/common';
import { t } from '~/locale';
import { TableColumn } from '~/types/common.type';
import { formatTime } from '~/utils/Common';
import { Link } from '../../../components/Link';
import {
  IListAuthorizationEvent,
  IDataPermissionTemplateReply
} from '@actiontech/shared/lib/api/provision/service/common';

export const authAuditTableColumns = (
  projectID: string
): TableColumn<IListAuthorizationEvent, 'operator'> => {
  return [
    {
      dataIndex: 'generated_time',
      title: t('provisionAudit.authAudit.columns.time'),
      width: 180,
      render: (time: string) => formatTime(time)
    },
    {
      dataIndex: 'permission_user_name',
      title: t('provisionAudit.authAudit.columns.permissionUser')
    },
    {
      dataIndex: 'purpose',
      title: t('provisionAudit.authAudit.columns.purpose')
    },
    {
      dataIndex: 'data_permission_templates',
      title: t('provisionAudit.authAudit.columns.template'),
      render: (templates: IDataPermissionTemplateReply[]) => {
        return templates.map((template) => (
          <Tag style={{ margin: 5 }} key={template.name}>
            {template.name}
          </Tag>
        ));
      }
    },
    {
      dataIndex: 'executing_user_name',
      title: t('provisionAudit.authAudit.columns.actionUser')
    },
    {
      dataIndex: 'event_type',
      title: t('provisionAudit.authAudit.columns.actionType'),
      render: (val) => eventType[val] ?? '--'
    },
    {
      dataIndex: TableOperatorColumnName,
      title: t('common.operate'),
      fixed: 'right',
      width: 70,
      render(_, record) {
        return (
          <Link to={`${projectID}/audit/auth/${record.event_uid}`}>
            {t('auth.columns.details')}
          </Link>
        );
      }
    }
  ];
};

export const eventType: Record<string, string> = {
  auth_created: t('provisionAudit.authAudit.type.authCreated'),
  auth_updated: t('provisionAudit.authAudit.type.authUpdated'),
  auth_deleted: t('provisionAudit.authAudit.type.authDeleted')
};
