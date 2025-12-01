import React, { useState } from 'react';
import { ActiontechTable, ConfigProvider } from '@actiontech/dms-kit';
import type { ActiontechTableColumn } from '@actiontech/dms-kit';
import { Tag, message } from 'antd';

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
  }
];

const ActionsDemo: React.FC = () => {
  const [dataSource, setDataSource] = useState(mockData);

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
      width: 100
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

  // 处理编辑操作
  const handleEdit = (record: UserRecord) => {
    message.info(`编辑用户: ${record.name}`);
  };

  // 处理删除操作
  const handleDelete = (record: UserRecord) => {
    setDataSource((prev) => prev.filter((item) => item.id !== record.id));
    message.success(`已删除用户: ${record.name}`);
  };

  return (
    <ConfigProvider>
      <ActiontechTable<UserRecord, Record<string, any>>
        rowKey="id"
        dataSource={dataSource}
        columns={columns}
        actions={{
          title: '操作',
          width: 200,
          buttons: [
            {
              key: 'edit',
              text: '编辑',
              buttonProps: (record) => ({
                onClick: () => handleEdit(record!)
              })
            },
            {
              key: 'delete',
              text: '删除',
              buttonProps: () => ({
                danger: true
              }),
              confirm: (record) => ({
                title: `确定要删除用户 "${record?.name}" 吗？`,
                onConfirm: () => handleDelete(record!)
              })
            }
          ]
        }}
      />
    </ConfigProvider>
  );
};

export default ActionsDemo;
