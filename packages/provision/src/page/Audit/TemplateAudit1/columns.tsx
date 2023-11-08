import {
  ActiontechTableColumn,
  PageInfoWithoutIndexAndSize,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IListDataPermissionTemplateEvent } from '@actiontech/shared/lib/api/provision/service/common';
import { formatTime } from '~/utils/Common';
import { t } from '~/locale';
import { IAuditListDataPermissionTemplateEventsParams } from '@actiontech/shared/lib/api/provision/service/auth/index.d';
import { Space } from 'antd5';
import { AvatarCom, EmptyBox, BasicToolTips } from '@actiontech/shared';
import AuditActionIcon from '../components/AuditActionIcon';
import { uniqBy } from 'lodash';

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

export type TemplateAuditTableFilterParamType = PageInfoWithoutIndexAndSize<
  IAuditListDataPermissionTemplateEventsParams & {
    page_index: number;
  }
>;

export const TemplateAuditTableColumns: ActiontechTableColumn<
  IListDataPermissionTemplateEvent,
  TemplateAuditTableFilterParamType
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
          <BasicToolTips
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
          </BasicToolTips>
        </EmptyBox>
      );
    },
    filterCustomType: 'select',
    filterKey: 'filter_by_data_object_service_name'
  },
  {
    dataIndex: 'executing_user_name',
    title: t('provisionAudit.authAudit.columns.actionUser'),
    render: (value: string) => {
      return <AvatarCom name={value} />;
    },
    filterCustomType: 'select',
    filterKey: 'filter_by_create_user'
  },
  {
    dataIndex: 'event_type',
    title: t('provisionAudit.authAudit.columns.actionType'),
    render: (val) => {
      return (
        <Space>
          <AuditActionIcon value={val} />
          {eventType[val] ?? '--'}
        </Space>
      );
    },
    filterCustomType: 'select',
    filterKey: 'filter_by_event_type'
  }
];

export const TemplateAuditTableActions = (
  gotoDetail: (record?: IListDataPermissionTemplateEvent) => void
): ActiontechTableActionMeta<IListDataPermissionTemplateEvent>[] => [
  {
    text: t('auth.columns.details'),
    key: 'authAuditDetailBtn',
    buttonProps: (record) => {
      return {
        onClick: () => {
          gotoDetail(record);
        }
      };
    }
  }
];
