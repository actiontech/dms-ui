import React, { useState } from 'react';
import { ActiontechTable, ConfigProvider } from '@actiontech/dms-kit';
import type { ActiontechTableColumn } from '@actiontech/dms-kit';
import { Tag } from 'antd';

// 定义数据类型
interface UserRecord {
  id: number;
  name: string;
  age: number;
  email: string;
  status: 'active' | 'inactive';
  role: string;
}

// 模拟数据
const mockData: UserRecord[] = [
  {
    id: 1,
    name: '张三',
    age: 28,
    email: 'zhangsan@example.com',
    status: 'active',
    role: '管理员'
  },
  {
    id: 2,
    name: '李四',
    age: 32,
    email: 'lisi@example.com',
    status: 'active',
    role: '开发者'
  },
  {
    id: 3,
    name: '王五',
    age: 25,
    email: 'wangwu@example.com',
    status: 'inactive',
    role: '测试员'
  },
  {
    id: 4,
    name: '赵六',
    age: 30,
    email: 'zhaoliu@example.com',
    status: 'active',
    role: '设计师'
  },
  {
    id: 5,
    name: '钱七',
    age: 27,
    email: 'qianqi@example.com',
    status: 'inactive',
    role: '产品经理'
  }
];

const BasicDemo: React.FC = () => {
  const [dataSource] = useState(mockData);

  // 定义表格列
  const columns: ActiontechTableColumn<UserRecord, Record<string, any>> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 100,
      sorter: (a, b) => a.age - b.age
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 200
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '激活' : '未激活'}
        </Tag>
      )
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: 120
    }
  ];

  return (
    <ConfigProvider>
      <ActiontechTable<UserRecord, Record<string, any>>
        rowKey="id"
        dataSource={dataSource}
        columns={columns}
      />
    </ConfigProvider>
  );
};

export default BasicDemo;
