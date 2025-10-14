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

const data: DataType[] = [
  {
    key: '1',
    name: '张三',
    age: 32,
    address: '北京市朝阳区'
  },
  {
    key: '2',
    name: '李四',
    age: 28,
    address: '上海市浦东新区'
  },
  {
    key: '3',
    name: '王五',
    age: 35,
    address: '广州市天河区'
  }
];

const BasicTableBasicDemo: React.FC = () => (
  <ConfigProvider>
    <BasicTable columns={columns} dataSource={data} rowKey="key" />
  </ConfigProvider>
);

export default BasicTableBasicDemo;
