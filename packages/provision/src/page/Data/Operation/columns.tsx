import { Space, Typography } from 'antd';
import { t } from '../../../locale';
import {
  ActiontechTableColumn,
  FilterCustomProps
} from '@actiontech/shared/lib/components/ActiontechTable';
import { BasicTag } from '@actiontech/shared';
import { IAuthListDataOperationSetsParams } from '@actiontech/shared/lib/api/provision/service/auth/index.d';
import { AuthListDataOperationSetsFilterByDbTypeEnum } from '@actiontech/shared/lib/api/provision/service/auth/index.enum';
import { IOperationInfo } from '@actiontech/shared/lib/api/provision/service/common';
import { MergeTableRowStyleWrapper } from './style';

/*
 *PS：
 * 没有使用PageInfoWithoutIndexAndSize<IAuthListDataOperationSetsParams>的原因：
 * IAuthListDataOperationSetsParams里的page_index 是可选项，和TablePagination类型不匹配，期望后续后端可以修改。
 */

export type IOperationData = {
  [key in keyof IOperationInfo]: Array<IOperationInfo[key]>;
} & {
  uid?: string;
  name?: string;
};

export type OperationListTableFilterParamType = Omit<
  IAuthListDataOperationSetsParams,
  'page_index' | 'page_size'
>;

/**
 * dbType筛选项因后端不提供接口，故前端暂时写成固定选项
 */
const dbTypeOptions = [
  {
    value: AuthListDataOperationSetsFilterByDbTypeEnum.MySQL,
    label: 'MySQL'
  },
  {
    value: AuthListDataOperationSetsFilterByDbTypeEnum.OceanBaseMySQL,
    label: 'OceanBaseMySQL'
  }
];

export const filterCustomProps = new Map<
  keyof IOperationData,
  FilterCustomProps
>([['db_type', { options: dbTypeOptions }]]);

export const operationTableColumns = (): ActiontechTableColumn<
  IOperationData,
  OperationListTableFilterParamType
> => {
  return [
    {
      dataIndex: 'name',
      title: () => <>{t('operation.tableColumns.name')}</>,
      width: 180,
      render: (name) => (
        <Typography.Text className="consolidated-column">
          {name}
        </Typography.Text>
      )
    },
    {
      dataIndex: 'db_type',
      title: () => <>{t('operation.tableColumns.type')}</>,
      width: 180,
      filterCustomType: 'select',
      filterKey: 'filter_by_db_type',
      className: 'custom-table-cell',
      render: (db_types: IOperationData['db_type']) => {
        return (
          <MergeTableRowStyleWrapper>
            {db_types?.map((item) => (
              <div
                className="custom-table-cell-item custom-table-cell-db-type-item"
                key={item}
              >
                {item}
              </div>
            ))}
          </MergeTableRowStyleWrapper>
        );
      }
    },
    {
      dataIndex: 'data_object_types',
      title: () => <>{t('operation.tableColumns.scope')}</>,
      width: 240,
      className: 'custom-table-cell',
      render: (types: IOperationData['data_object_types']) => {
        return (
          <MergeTableRowStyleWrapper>
            {types?.map((item, index) => (
              <Space
                className="custom-table-cell-item"
                key={index}
                size={[0, 8]}
              >
                {item?.map((type) => (
                  <BasicTag key={type}>{type}</BasicTag>
                ))}
              </Space>
            ))}
          </MergeTableRowStyleWrapper>
        );
      }
    },
    {
      dataIndex: 'data_operations',
      title: () => <>{t('operation.tableColumns.operation')}</>,
      width: 240,
      className: 'custom-table-cell',
      render: (operations: IOperationData['data_operations']) => {
        return (
          <MergeTableRowStyleWrapper>
            {operations?.map((item, index) => {
              return (
                <Space
                  className="custom-table-cell-item"
                  key={index}
                  size={[0, 8]}
                >
                  {item?.map((operation) => (
                    <BasicTag key={operation.uid}>{operation.name}</BasicTag>
                  ))}
                </Space>
              );
            })}
          </MergeTableRowStyleWrapper>
        );
      }
    }
  ];
};
