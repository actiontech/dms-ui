import {
  ActiontechTableColumn,
  PageInfoWithoutIndexAndSize,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable';
import {
  IListAuthorizationEvent,
  IDataPermissionTemplateReply
} from '@actiontech/shared/lib/api/provision/service/common';
import { formatTime } from '~/utils/Common';
import { t } from '~/locale';
import { IAuditListAuthorizationEventsParams } from '@actiontech/shared/lib/api/provision/service/auth/index.d';
import { Space } from 'antd5';
import { BasicTag } from '@actiontech/shared';
import { AvatarCom } from '@actiontech/shared';
import AuditActionIcon from '../components/AuditActionIcon';

export const eventType: Record<string, string> = {
  auth_created: t('provisionAudit.authAudit.type.authCreated'),
  auth_updated: t('provisionAudit.authAudit.type.authUpdated'),
  auth_deleted: t('provisionAudit.authAudit.type.authDeleted')
};

export type AuthAuditTableFilterParamType = PageInfoWithoutIndexAndSize<
  IAuditListAuthorizationEventsParams & {
    page_index: number;
    page_size: number;
  }
>;

const commonUserRender = (value: string) => {
  return (
    <Space>
      <AvatarCom size={20} name={value} noTips />
      {value}
    </Space>
  );
};

export const AuthAuditTableColumns: ActiontechTableColumn<
  IListAuthorizationEvent,
  AuthAuditTableFilterParamType
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
    dataIndex: 'permission_user_name',
    title: t('provisionAudit.authAudit.columns.permissionUser'),
    render: commonUserRender
  },
  {
    dataIndex: 'purpose',
    title: t('provisionAudit.authAudit.columns.purpose')
  },
  {
    dataIndex: 'data_permission_templates',
    title: t('provisionAudit.authAudit.columns.template'),
    render: (templates: IDataPermissionTemplateReply[]) => {
      return (
        <Space>
          {templates.map((template) => (
            <BasicTag key={template.name}>{template.name}</BasicTag>
          ))}
        </Space>
      );
    }
  },
  {
    dataIndex: 'executing_user_name',
    title: t('provisionAudit.authAudit.columns.actionUser'),
    render: commonUserRender
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

export const AuthAuditTableActions = (
  gotoDetail: (record?: IListAuthorizationEvent) => void
): ActiontechTableActionMeta<IListAuthorizationEvent>[] => [
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
