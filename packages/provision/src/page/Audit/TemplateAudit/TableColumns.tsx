import { EmptyBox } from '@actiontech/shared';
import { Tooltip } from 'antd';
import { uniqBy } from 'lodash';
import { TableOperatorColumnName } from '~/data/common';
import { t } from '~/locale';
import { TableColumn } from '~/types/common.type';
import { formatTime } from '~/utils/Common';
import { Link } from '../../../components/Link';
import { IListDataPermissionTemplateEvent } from '@actiontech/shared/lib/api/provision/service/common';

export const templateAuditTableColumns = (
  projectId: string
): TableColumn<IListDataPermissionTemplateEvent, 'operator'> => {
  return [
    {
      dataIndex: 'generated_time',
      title: t('provisionAudit.authAudit.columns.time'),
      width: 180,
      render: (time: string) => formatTime(time)
    },
    {
      dataIndex: 'data_permission_template_name',
      title: t('provisionAudit.templateAudit.columns.template')
    },
    {
      dataIndex: 'data_permissions',
      title: t('auth.columns.dataObjectService'),
      render: (
        permissions?: IListDataPermissionTemplateEvent['data_permissions']
      ) => {
        permissions = uniqBy(permissions, 'data_object_service_name');
        return (
          <EmptyBox if={!!permissions && permissions.length !== 0}>
            <Tooltip
              title={
                permissions?.length &&
                permissions.length > 1 && (
                  <>
                    {permissions?.map((item) => (
                      <span key={item.data_object_service_name}>
                        {item.data_object_service_name}
                        <br />
                      </span>
                    ))}
                  </>
                )
              }
            >
              {permissions?.[0].data_object_service_name}
              {permissions?.length && permissions.length > 1 ? '...' : ''}
            </Tooltip>
          </EmptyBox>
        );
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
          <Link to={`${projectId}/audit/template/${record.event_uid}`}>
            {t('auth.columns.details')}
          </Link>
        );
      }
    }
  ];
};

export const eventType: Record<string, string> = {
  data_permission_template_created: t(
    'provisionAudit.templateAudit.type.templateCreated'
  ),
  data_permission_template_updated: t(
    'provisionAudit.templateAudit.type.templateUpdated'
  ),
  data_permission_template_deleted: t(
    'provisionAudit.templateAudit.type.templateDeleted'
  )
};
