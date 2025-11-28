import React, { useState } from 'react';
import { ActiontechTable, ConfigProvider } from '@actiontech/dms-kit';
import type { ActiontechTableColumn } from '@actiontech/dms-kit';
import { Space, Tag, Avatar, Progress, message } from 'antd';
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
  MailOutlined
} from '@ant-design/icons';

// 定义数据类型
interface UserRecord {
  id: number;
  username: string;
  realName: string;
  email: string;
  role: string;
  status: 'active' | 'locked' | 'pending';
  loginCount: number;
  score: number;
  avatar?: string;
}

// 模拟数据
const mockData: UserRecord[] = [
  {
    id: 1,
    username: 'zhangsan',
    realName: '张三',
    email: 'zhangsan@example.com',
    role: '管理员',
    status: 'active',
    loginCount: 125,
    score: 95
  },
  {
    id: 2,
    username: 'lisi',
    realName: '李四',
    email: 'lisi@example.com',
    role: '开发者',
    status: 'active',
    loginCount: 89,
    score: 88
  },
  {
    id: 3,
    username: 'wangwu',
    realName: '王五',
    email: 'wangwu@example.com',
    role: '测试员',
    status: 'locked',
    loginCount: 45,
    score: 76
  },
  {
    id: 4,
    username: 'zhaoliu',
    realName: '赵六',
    email: 'zhaoliu@example.com',
    role: '设计师',
    status: 'pending',
    loginCount: 12,
    score: 62
  }
];

const MoreActionsDemo: React.FC = () => {
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
      title: '用户信息',
      dataIndex: 'username',
      width: 220,
      render: (username, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} src={record.avatar} />
          <div>
            <div style={{ fontWeight: 500 }}>{record.realName}</div>
            <div style={{ fontSize: 12, color: '#999' }}>@{username}</div>
          </div>
        </Space>
      )
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 200
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: 120,
      render: (role) => {
        const colorMap: Record<string, string> = {
          管理员: 'red',
          开发者: 'blue',
          测试员: 'green',
          设计师: 'purple'
        };
        return <Tag color={colorMap[role] || 'default'}>{role}</Tag>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status) => {
        const statusConfig = {
          active: { text: '正常', color: 'success' },
          locked: { text: '锁定', color: 'error' },
          pending: { text: '待激活', color: 'warning' }
        };
        const config = statusConfig[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '登录次数',
      dataIndex: 'loginCount',
      width: 120,
      sorter: (a, b) => a.loginCount - b.loginCount
    },
    {
      title: '评分',
      dataIndex: 'score',
      width: 150,
      render: (score) => (
        <Progress
          percent={score}
          size="small"
          status={
            score >= 80 ? 'success' : score >= 60 ? 'normal' : 'exception'
          }
        />
      )
    }
  ];

  // 处理刷新
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setDataSource([...mockData]);
      setLoading(false);
      message.success('刷新成功');
    }, 1000);
  };

  // 处理编辑
  const handleEdit = (record: UserRecord) => {
    message.info(`编辑用户: ${record.realName}`);
  };

  // 处理删除
  const handleDelete = (record: UserRecord) => {
    setDataSource((prev) => prev.filter((item) => item.id !== record.id));
    message.success(`已删除用户: ${record.realName}`);
  };

  // 处理锁定/解锁
  const handleToggleLock = (record: UserRecord) => {
    setDataSource((prev) =>
      prev.map((item) =>
        item.id === record.id
          ? {
              ...item,
              status: item.status === 'locked' ? 'active' : 'locked'
            }
          : item
      )
    );
    message.success(
      record.status === 'locked'
        ? `已解锁用户: ${record.realName}`
        : `已锁定用户: ${record.realName}`
    );
  };

  // 处理发送邮件
  const handleSendEmail = (record: UserRecord) => {
    message.success(`已向 ${record.email} 发送邮件`);
  };

  // 处理重置密码
  const handleResetPassword = (record: UserRecord) => {
    message.success(`已重置用户 ${record.realName} 的密码`);
  };

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <h3>更多操作按钮（下拉菜单）</h3>
          <p style={{ color: '#666', marginBottom: 16 }}>
            当操作按钮较多时，可以使用 moreButtons 将部分按钮放入下拉菜单中
          </p>
          <ActiontechTable<UserRecord, Record<string, any>>
            rowKey="id"
            dataSource={dataSource}
            columns={columns}
            loading={loading}
            toolbar={{
              refreshButton: {
                refresh: handleRefresh
              },
              loading
            }}
            actions={{
              title: '操作',
              width: 200,
              fixed: 'right',
              buttons: [
                {
                  key: 'edit',
                  text: '编辑',
                  buttonProps: (record) => ({
                    onClick: () => handleEdit(record!)
                  })
                }
              ],
              moreButtons: (record) => [
                {
                  key: 'lock',
                  text: record.status === 'locked' ? '解锁' : '锁定',
                  icon:
                    record.status === 'locked' ? (
                      <UnlockOutlined />
                    ) : (
                      <LockOutlined />
                    ),
                  onClick: () => handleToggleLock(record),
                  disabled: record.status === 'pending'
                },
                {
                  key: 'email',
                  text: '发送邮件',
                  icon: <MailOutlined />,
                  onClick: () => handleSendEmail(record)
                },
                {
                  key: 'reset',
                  text: '重置密码',
                  onClick: () => handleResetPassword(record),
                  permissions: () => record.role !== '管理员'
                },
                {
                  key: 'delete',
                  text: '删除',
                  icon: <DeleteOutlined />,
                  confirm: () => ({
                    title: `确定要删除用户 "${record.realName}" 吗？`,
                    description: '删除后无法恢复，请谨慎操作',
                    onConfirm: () => handleDelete(record)
                  }),
                  permissions: () => record.role !== '管理员'
                }
              ]
            }}
          />
        </div>

        <div>
          <h3>按钮权限控制</h3>
          <p style={{ color: '#666', marginBottom: 16 }}>
            使用 permissions
            属性控制按钮的显示，这里管理员用户不显示删除和重置密码按钮
          </p>
          <ActiontechTable<UserRecord, Record<string, any>>
            rowKey="id"
            dataSource={dataSource}
            columns={columns}
            loading={loading}
            toolbar={{
              refreshButton: {
                refresh: handleRefresh
              },
              loading
            }}
            actions={{
              title: '操作',
              width: 250,
              buttons: [
                {
                  key: 'edit',
                  text: '编辑',
                  buttonProps: (record) => ({
                    icon: <EditOutlined />,
                    onClick: () => handleEdit(record!)
                  })
                },
                {
                  key: 'delete',
                  text: '删除',
                  buttonProps: (record) => ({
                    danger: true,
                    icon: <DeleteOutlined />
                  }),
                  confirm: (record) => ({
                    title: `确定要删除用户 "${record?.realName}" 吗？`,
                    onConfirm: () => handleDelete(record!)
                  }),
                  permissions: (record) => record?.role !== '管理员'
                }
              ]
            }}
          />
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default MoreActionsDemo;
