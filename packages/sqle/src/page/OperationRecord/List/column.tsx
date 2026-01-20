import { formatTime, BasicTypographyEllipsis } from '@actiontech/dms-kit';
import { IOperationRecordListItem } from '@actiontech/shared/lib/api/base/service/common';
import {
  ActiontechTableColumn,
  PageInfoWithoutIndexAndSize
} from '@actiontech/dms-kit/es/components/ActiontechTable';
import { IGetOperationRecordListParams } from '@actiontech/shared/lib/api/base/service/OperationRecord/index.d';
import { t } from '../../../locale';
import OperationStatus from '../components/OperationStatus';

export type OperationRecordListFilterParamType = PageInfoWithoutIndexAndSize<
  IGetOperationRecordListParams,
  'fuzzy_search_operate_user_name'
>;

export const OperationRecordListColumn: ActiontechTableColumn<
  IOperationRecordListItem,
  OperationRecordListFilterParamType
> = [
  {
    dataIndex: 'operation_time',
    title: () => t('operationRecord.list.column.operatingTime'),
    render: (time) => {
      return formatTime(time);
    },
    filterCustomType: 'date-range',
    filterKey: ['filter_operate_time_from', 'filter_operate_time_to']
  },
  {
    dataIndex: 'operation_user',
    title: () => t('operationRecord.list.column.operator'),
    className: 'whitespace-pre',
    render: (userInfo) => {
      if (!userInfo) {
        return '-';
      }
      return `${userInfo.user_name ?? ''}  ${userInfo.ip ?? ''}`;
    }
  },
  {
    dataIndex: 'operation_type_name',
    title: () => t('operationRecord.list.column.operationType')
    // filterCustomType: 'select',
    // filterKey: 'filter_operate_type_name',
  },
  {
    dataIndex: 'operation_content',
    title: () => t('operationRecord.list.column.operationAction'),
    // filterCustomType: 'select',
    // filterKey: 'filter_operate_action',
    width: 600
  },

  {
    dataIndex: 'operation_user_agent',
    title: () => 'UserAgent',
    className: 'ellipsis-column-width',
    render: (userAgent?: string) => {
      return <BasicTypographyEllipsis textCont={userAgent ?? ''} />;
    }
  },
  {
    dataIndex: 'project_name',
    title: () => t('operationRecord.list.column.projectName'),
    render(name?: string) {
      if (!name) {
        return '-';
      }
      return name;
    },
    filterCustomType: 'select',
    filterKey: 'filter_operate_project_name'
  },
  {
    dataIndex: 'status',
    title: () => t('operationRecord.list.column.status'),
    render: (status) => {
      if (!status) {
        return '-';
      }
      return <OperationStatus status={status} />;
    }
  }
];
