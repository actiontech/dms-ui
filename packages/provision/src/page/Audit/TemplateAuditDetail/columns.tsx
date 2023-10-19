import {
  IListDataPermissionInTemplate,
  IListDataPermissionTemplateEvent
} from '@actiontech/shared/lib/api/provision/service/common';
import { Tag } from 'antd';
import _ from 'lodash';
import { t } from '~/locale';
import { columnType, IColumns } from '~/page/Audit/common/AuditDetails.d';
import { eventType } from '~/page/Audit/TemplateAudit/TableColumns';
import { TableColumn } from '~/types/common.type';
import { formatTime } from '~/utils/Common';

const serviceTableColumns: TableColumn<{ serviceName: string }> = [
  {
    dataIndex: 'serviceName',
    title: t('auth.columns.dataObjectService')
  }
];

const templateTableColumns: TableColumn<IListDataPermissionInTemplate> = [
  {
    title: t('auth.addAuth.baseForm.baseFormTable.service'),
    dataIndex: 'data_object_service_name',
    fixed: true
  },
  {
    title: t('auth.addAuth.baseForm.baseFormTable.objects'),
    dataIndex: 'data_objects',
    render: (objects: string[]) =>
      objects?.map((item) => (
        <Tag style={{ margin: 5 }} key={item}>
          {item}
        </Tag>
      ))
  },
  {
    title: t('auth.addAuth.baseForm.baseFormTable.operation'),
    dataIndex: 'data_operations',
    render: (operations: string[]) =>
      operations?.map((operation) => (
        <Tag style={{ margin: 5 }} key={operation}>
          {operation}
        </Tag>
      ))
  }
];
export const detailsColumns: IColumns<IListDataPermissionTemplateEvent>[] = [
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
    key: 'data_permission_template_name',
    label: t('provisionAudit.templateAudit.columns.template')
  },
  {
    type: columnType.object,
    key: 'executing_user_name',
    label: t('provisionAudit.authAudit.columns.actionUser')
  },
  {
    type: columnType.table,
    key: 'data_permissions',
    label: t('auth.columns.dataObjectService'),
    columns: serviceTableColumns,
    tableSpan: 6,
    render: (val: IListDataPermissionInTemplate[]) => {
      const services = val
        .filter((item) => !!item.data_object_service_name)
        .map((item) => ({ serviceName: item.data_object_service_name }));
      return _.uniqBy(services, 'serviceName');
    }
  },
  {
    type: columnType.table,
    key: 'data_permissions',
    label: t('provisionAudit.templateAuditDetail.templateDetail'),
    columns: templateTableColumns
  }
];
