/**
 * 错误状态展示
 * - 通过 errorMessage 展示错误信息
 * - 自动使用 Result 组件展示友好提示
 */
import React from 'react';
import { BasicTable, ConfigProvider } from '@actiontech/dms-kit';
import { ColumnsType } from 'antd/es/table';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address'
  }
];

const BasicTableErrorDemo: React.FC = () => (
  <ConfigProvider>
    <BasicTable
      columns={columns}
      dataSource={[]}
      rowKey="key"
      errorMessage="数据加载失败，请检查网络连接或联系管理员"
    />
  </ConfigProvider>
);

export default BasicTableErrorDemo;
