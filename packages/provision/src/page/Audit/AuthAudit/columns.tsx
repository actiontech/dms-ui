import {
  ActiontechTableColumn,
  PageInfoWithoutIndexAndSize,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IListAuthorizationEvent } from '@actiontech/shared/lib/api/provision/service/common';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { t } from '~/locale';
import { IAuditListAuthorizationEventsParams } from '@actiontech/shared/lib/api/provision/service/auth/index.d';
import { Space } from 'antd';
import { BasicTag, CustomAvatar } from '@actiontech/shared';
import AuditActionIcon from '../components/AuditActionIcon';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { AuthAuditEventTypeEnum, AuthAuditEventDictionary } from './index.type';

export type AuthAuditTableFilterParamType = PageInfoWithoutIndexAndSize<
  IAuditListAuthorizationEventsParams & {
    page_index: number;
    page_size: number;
  }
>;

const commonUserRender = (value?: string) => {
  return <CustomAvatar name={value} />;
};

export const AuthAuditTableColumns: ActiontechTableColumn<
  IListAuthorizationEvent,
  AuthAuditTableFilterParamType
> = [
  {
    dataIndex: 'generated_time',
    title: t('provisionAudit.authAudit.columns.time'),
    render: (time) => formatTime(time, '-'),
    filterCustomType: 'date-range',
    filterKey: [
      'filter_by_generated_time_start',
      'filter_by_generated_time_end'
    ],
    width: 300
  },
  {
    dataIndex: 'permission_user_name',
    title: t('provisionAudit.authAudit.columns.permissionUser'),
    render: commonUserRender,
    filterCustomType: 'select',
    filterKey: 'filter_by_permission_user'
  },
  {
    dataIndex: 'purpose',
    title: t('provisionAudit.authAudit.columns.purpose')
  },
  {
    dataIndex: 'data_permission_templates',
    title: t('provisionAudit.authAudit.columns.template'),
    render: (templates = []) => {
      return (
        <Space>
          {templates.map((template) => (
            <BasicTag key={template.uid}>{template.name}</BasicTag>
          ))}
        </Space>
      );
    }
  },
  {
    dataIndex: 'executing_user_name',
    title: t('provisionAudit.authAudit.columns.actionUser'),
    render: commonUserRender,
    filterCustomType: 'select',
    filterKey: 'filter_by_create_user'
  },
  {
    dataIndex: 'event_type',
    title: t('provisionAudit.authAudit.columns.actionType'),
    render: (val) => {
      const key = val as AuthAuditEventTypeEnum;
      return (
        <TableColumnWithIconStyleWrapper>
          <AuditActionIcon value={AuthAuditEventTypeEnum[key]} />
          <span>{t(AuthAuditEventDictionary[key]) ?? '-'}</span>
        </TableColumnWithIconStyleWrapper>
      );
    },
    filterCustomType: 'select',
    filterKey: 'filter_by_event_type',
    width: 200
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
