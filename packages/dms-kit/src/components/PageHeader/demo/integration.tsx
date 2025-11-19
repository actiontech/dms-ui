import { Space, Typography } from 'antd';
import { PageHeader, ConfigProvider } from '@actiontech/dms-kit';
import {
  PlusOutlined,
  DownloadOutlined,
  ReloadOutlined,
  SettingOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { BasicButton, BasicTable, BasicTag } from '@actiontech/dms-kit';

const IntegrationDemo: React.FC = () => {
  // 模拟用户数据
  const userData = [
    {
      id: 1,
      name: '张三',
      email: 'zhangsan@example.com',
      role: '管理员',
      status: '活跃',
      createTime: '2024-01-15'
    },
    {
      id: 2,
      name: '李四',
      email: 'lisi@example.com',
      role: '用户',
      status: '活跃',
      createTime: '2024-01-20'
    },
    {
      id: 3,
      name: '王五',
      email: 'wangwu@example.com',
      role: '用户',
      status: '禁用',
      createTime: '2024-02-01'
    },
    {
      id: 4,
      name: '赵六',
      email: 'zhaoliu@example.com',
      role: '编辑',
      status: '活跃',
      createTime: '2024-02-10'
    }
  ];

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '姓名', dataIndex: 'name', key: 'name', width: 120 },
    { title: '邮箱', dataIndex: 'email', key: 'email', width: 200 },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role: string) => {
        return role;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (val: string) => (
        <BasicTag color={val === '活跃' ? 'green' : 'red'}>{val}</BasicTag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 120
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: any) => (
        <Space>
          <BasicButton icon={<EyeOutlined />} size="small">
            查看
          </BasicButton>
          <BasicButton icon={<EditOutlined />} size="small">
            编辑
          </BasicButton>
          <BasicButton icon={<DeleteOutlined />} size="small" danger>
            删除
          </BasicButton>
        </Space>
      )
    }
  ];

  return (
    <ConfigProvider>
      {/* 页面头部 */}
      <PageHeader
        title={
          <Space>
            用户管理系统
            <Typography.Text type="secondary">
              管理平台用户、权限和角色配置
            </Typography.Text>
          </Space>
        }
        extra={
          <Space>
            <BasicButton icon={<PlusOutlined />} type="primary">
              添加用户
            </BasicButton>
            <BasicButton icon={<DownloadOutlined />}>导出数据</BasicButton>
            <BasicButton icon={<ReloadOutlined />}>刷新</BasicButton>
            <BasicButton icon={<SettingOutlined />}>系统设置</BasicButton>
          </Space>
        }
        style={{
          backgroundColor: '#fafafa',
          border: '1px solid #d9d9d9',
          borderRadius: '8px',
          marginBottom: '20px'
        }}
      />

      {/* 主要内容区域 */}
      <BasicTable
        columns={columns}
        dataSource={userData}
        rowKey="id"
        pagination={{
          total: userData.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
        }}
        size="middle"
      />
    </ConfigProvider>
  );
};

export default IntegrationDemo;
