import { uniqBy } from 'lodash';
import {
  ActiontechTableColumn,
  PageInfoWithoutIndexAndSize,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IListDataPermissionTemplateEvent } from '@actiontech/shared/lib/api/provision/service/common';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { t } from '~/locale';
import { IAuditListDataPermissionTemplateEventsParams } from '@actiontech/shared/lib/api/provision/service/auth/index.d';
import { CustomAvatar, EmptyBox, BasicToolTip } from '@actiontech/shared';
import EventType, { EventTypeEnum } from './components/EventType';

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
    render: (time) => {
      return formatTime(time, '-');
    },
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
          <BasicToolTip
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
          </BasicToolTip>
        </EmptyBox>
      );
    },
    filterCustomType: 'select',
    filterKey: 'filter_by_data_object_service_name'
  },
  {
    dataIndex: 'executing_user_name',
    title: t('provisionAudit.authAudit.columns.actionUser'),
    render: (value) => {
      return <CustomAvatar name={value} />;
    },
    filterCustomType: 'select',
    filterKey: 'filter_by_create_user'
  },
  {
    dataIndex: 'event_type',
    title: t('provisionAudit.authAudit.columns.actionType'),
    render: (val: IListDataPermissionTemplateEvent['event_type']) => {
      return <EventType val={val as EventTypeEnum} />;
    }
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
