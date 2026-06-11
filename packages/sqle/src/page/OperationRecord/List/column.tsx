import { formatTime } from '@actiontech/shared/lib/utils/Common';
import {
  ActiontechTableColumn,
  PageInfoWithoutIndexAndSize
} from '@actiontech/shared/lib/components/ActiontechTable';
import { t } from '../../../locale';
import OperationStatus from '../components/OperationStatus';
import { IGetOperationRecordListParams } from '@actiontech/shared/lib/api/base/service/OperationRecord/index.d';
import { IOperationRecordListItem } from '@actiontech/shared/lib/api/base/service/common';
import { BasicTypographyEllipsis } from '@actiontech/shared';
import { OperationRecordListItemStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

export type OperationRecordListFilterParamType = PageInfoWithoutIndexAndSize<
  IGetOperationRecordListParams,
  'fuzzy_search_operate_user_name' | 'fuzzy_search_operate_content'
>;

export const createOperationRecordListColumns = (
  operationTypeDescMap: Record<string, string>,
  showProjectColumn: boolean
): ActiontechTableColumn<
  IOperationRecordListItem,
  OperationRecordListFilterParamType
> => {
  const columns: ActiontechTableColumn<
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
      render: (userInfo) => {
        if (!userInfo) {
          return '-';
        }
        return `${userInfo.user_name ?? ''}  ${userInfo.ip ?? ''}`;
      },
      filterCustomType: 'select',
      filterKey: 'filter_fuzzy_operate_user_name'
    },
    {
      dataIndex: 'operation_type_name',
      title: () => t('operationRecord.list.column.operationType'),
      render: (typeName?: string) => {
        if (!typeName) {
          return '-';
        }
        return operationTypeDescMap[typeName] ?? typeName;
      },
      filterCustomType: 'select',
      filterKey: 'filter_operate_type_names'
    },
    {
      dataIndex: 'operation_content',
      title: () => t('operationRecord.list.column.operationAction'),
      filterCustomType: 'select',
      filterKey: 'filter_operate_actions'
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
      },
      filterCustomType: 'select',
      filterKey: 'filter_operate_status'
    }
  ];

  if (!showProjectColumn) {
    return columns.filter((column) => column.dataIndex !== 'project_name');
  }
  return columns;
};

export const OperationRecordListColumn = createOperationRecordListColumns(
  {},
  true
);

export const operationRecordStatusFilterOptions = [
  {
    label: t('common.success'),
    value: OperationRecordListItemStatusEnum.succeeded
  },
  {
    label: t('common.fail'),
    value: OperationRecordListItemStatusEnum.failed
  }
];
