import { Tag } from 'antd';
import i18n from 'i18next';
import { IOperationData } from '.';
import { TableColumn } from '~/types/common.type';

export const operationTableColumns = (): TableColumn<IOperationData> => {
  return [
    {
      dataIndex: 'name',
      title: () => <>{i18n.t('operation.tableColumns.name')}</>,
      width: 120,
      onCell: (record) => ({
        rowSpan: record.rowSpan
      }),
      sorter: true
    },
    {
      dataIndex: 'db_type',
      title: () => <>{i18n.t('operation.tableColumns.type')}</>,
      width: 180
    },
    {
      dataIndex: 'data_object_types',
      title: () => <>{i18n.t('operation.tableColumns.scope')}</>,
      render: (types: IOperationData['data_object_types']) =>
        types?.map((type) => (
          <Tag style={{ margin: 5 }} key={type}>
            {type}
          </Tag>
        ))
    },
    {
      dataIndex: 'data_operations',
      title: () => <>{i18n.t('operation.tableColumns.operation')}</>,
      render: (operations: IOperationData['data_operations']) =>
        operations?.map((operation) => (
          <Tag style={{ margin: 5 }} key={operation.uid}>
            {operation.name}
          </Tag>
        ))
    }
  ];
};
