import React, { useState } from 'react';
import {
  ActiontechTable,
  TableToolbar,
  ConfigProvider
} from '@actiontech/dms-kit';
import type { ActiontechTableColumn } from '@actiontech/dms-kit';
import { Space, Tag, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

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

const ToolbarDemo: React.FC = () => {
  const [dataSource, setDataSource] = useState(mockData);
  const [loading, setLoading] = useState(false);

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

  // 处理刷新操作
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setDataSource([...mockData]);
      setLoading(false);
      message.success('刷新成功');
    }, 1000);
  };

  // 处理新增操作
  const handleAdd = () => {
    message.info('点击了新增按钮');
  };

  return (
    <ConfigProvider>
      <>
        {/* 
          使用独立的 TableToolbar 组件
          注意：在 demo 环境中，组件外层有容器包裹，需要手动设置 width: '100%' 
          在实际项目中使用时，如果也遇到宽度不足的问题，请添加相同的 style
        */}
        <TableToolbar
          refreshButton={{
            refresh: handleRefresh
          }}
          actions={[
            {
              key: 'add',
              text: '新增用户',
              buttonProps: {
                type: 'primary',
                icon: <PlusOutlined />,
                onClick: handleAdd
              }
            }
          ]}
          loading={loading}
          style={{ width: '100%' }}
        />

        <ActiontechTable<UserRecord, Record<string, any>>
          rowKey="id"
          dataSource={dataSource}
          columns={columns}
          loading={loading}
        />
      </>
    </ConfigProvider>
  );
};

export default ToolbarDemo;
