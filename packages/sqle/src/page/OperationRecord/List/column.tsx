import { formatTime } from '@actiontech/dms-kit';
import { IOperationRecordList } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  ActiontechTableColumn,
  PageInfoWithoutIndexAndSize
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IGetOperationRecordListV1Params } from '@actiontech/shared/lib/api/sqle/service/OperationRecord/index.d';
import { t } from '../../../locale';
import OperationStatus from '../components/OperationStatus';

export type OperationRecordListFilterParamType = PageInfoWithoutIndexAndSize<
  IGetOperationRecordListV1Params,
  'filter_operate_project_name' | 'fuzzy_search_operate_user_name'
>;

export const OperationRecordListColumn: ActiontechTableColumn<
  IOperationRecordList,
  OperationRecordListFilterParamType
> = [
  {
    dataIndex: 'operation_time',
    title: () => t('operationRecord.list.column.operatingTime'),
    render: (time) => {
      return formatTime(time);
    },
    filterCustomType: 'date-range',
    filterKey: ['filter_operate_time_from', 'filter_operate_time_to'],
    width: 300
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
    width: 300
  },
  {
    dataIndex: 'operation_type_name',
    title: () => t('operationRecord.list.column.operationType'),
    filterCustomType: 'select',
    filterKey: 'filter_operate_type_name',
    width: 300
  },
  {
    dataIndex: 'operation_content',
    title: () => t('operationRecord.list.column.operationAction'),
    filterCustomType: 'select',
    filterKey: 'filter_operate_action',
    width: 600
  },
  // todo: 后期可能会迁移，目前在sqle里先隐藏
  // {
  //   dataIndex: 'project_name',
  //   title: () => t('operationRecord.list.column.projectName'),
  //   render(name?: string) {
  //     if (!name) {
  //       return '--';
  //     }
  //     return name;
  //   }
  // },
  {
    dataIndex: 'status',
    title: () => t('operationRecord.list.column.status'),
    render: (status) => {
      if (!status) {
        return '-';
      }
      return <OperationStatus status={status} />;
    },
    width: 180
  }
];
