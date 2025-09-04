import React, { useState } from 'react';
import {
  Card,
  Space,
  Button,
  Typography,
  Table,
  Tag,
  Input,
  Select,
  DatePicker,
  Tabs
} from 'antd';
import { PageHeader, ConfigProvider } from '@actiontech/dms-kit';
import {
  PlusOutlined,
  DownloadOutlined,
  ReloadOutlined,
  SettingOutlined,
  SearchOutlined,
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const IntegrationDemo: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<any>(null);

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
        const colorMap: { [key: string]: string } = {
          管理员: 'red',
          编辑: 'blue',
          用户: 'green'
        };
        return <Tag color={colorMap[role]}>{role}</Tag>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (val: string) => (
        <Tag color={val === '活跃' ? 'green' : 'red'}>{val}</Tag>
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
          <Button type="link" icon={<EyeOutlined />} size="small">
            查看
          </Button>
          <Button type="link" icon={<EditOutlined />} size="small">
            编辑
          </Button>
          <Button type="link" icon={<DeleteOutlined />} size="small" danger>
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>集成使用</h3>

        <Card title="完整页面布局" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>PageHeader 组件在实际页面中的完整集成使用：</p>
          </div>

          {/* 页面头部 */}
          <PageHeader
            title={
              <div>
                <Title level={3} style={{ margin: 0 }}>
                  用户管理系统
                </Title>
                <Text type="secondary">管理平台用户、权限和角色配置</Text>
              </div>
            }
            extra={
              <Space>
                <Button icon={<PlusOutlined />} type="primary">
                  添加用户
                </Button>
                <Button icon={<DownloadOutlined />}>导出数据</Button>
                <Button icon={<ReloadOutlined />}>刷新</Button>
                <Button icon={<SettingOutlined />}>系统设置</Button>
              </Space>
            }
            style={{
              backgroundColor: '#fafafa',
              border: '1px solid #d9d9d9',
              borderRadius: '8px',
              marginBottom: '20px'
            }}
          />

          {/* 搜索和筛选区域 */}
          <Card size="small" style={{ marginBottom: '20px' }}>
            <Space>
              <Search
                placeholder="搜索用户名或邮箱"
                allowClear
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
              />
              <Select
                value={status}
                onChange={setStatus}
                style={{ width: 120 }}
                placeholder="用户状态"
              >
                <Option value="all">全部状态</Option>
                <Option value="active">活跃</Option>
                <Option value="inactive">禁用</Option>
              </Select>
              <DatePicker.RangePicker
                value={dateRange}
                onChange={setDateRange}
                placeholder={['开始日期', '结束日期']}
              />
              <Button icon={<FilterOutlined />} type="primary">
                筛选
              </Button>
            </Space>
          </Card>

          {/* 主要内容区域 */}
          <Card>
            <Tabs defaultActiveKey="list">
              <TabPane tab="用户列表" key="list">
                <Table
                  columns={columns}
                  dataSource={userData.filter(
                    (user) =>
                      user.name
                        .toLowerCase()
                        .includes(searchText.toLowerCase()) &&
                      (status === 'all' ||
                        user.status === (status === 'active' ? '活跃' : '禁用'))
                  )}
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
              </TabPane>

              <TabPane tab="角色管理" key="role">
                <div
                  style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#999'
                  }}
                >
                  <Title level={4}>角色管理模块</Title>
                  <Paragraph>这里可以管理用户角色和权限配置</Paragraph>
                </div>
              </TabPane>

              <TabPane tab="权限配置" key="permission">
                <div
                  style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#999'
                  }}
                >
                  <Title level={4}>权限配置模块</Title>
                  <Paragraph>这里可以配置系统权限和访问控制</Paragraph>
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </Card>

        <Card title="数据统计页面" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>在数据统计页面中使用 PageHeader：</p>
          </div>

          <PageHeader
            title={
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#1890ff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '24px'
                  }}
                >
                  📊
                </div>
                <div>
                  <Title level={3} style={{ margin: 0 }}>
                    数据统计中心
                  </Title>
                  <Text type="secondary">实时监控系统运行状态和用户行为</Text>
                </div>
              </div>
            }
            extra={
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
              >
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    最后更新
                  </div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#52c41a'
                    }}
                  >
                    2分钟前
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    系统状态
                  </div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#1890ff'
                    }}
                  >
                    正常
                  </div>
                </div>
                <Button icon={<ReloadOutlined />}>刷新数据</Button>
                <Button icon={<DownloadOutlined />} type="primary">
                  导出报表
                </Button>
              </div>
            }
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              marginBottom: '20px'
            }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              marginBottom: '20px'
            }}
          >
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#1890ff'
                  }}
                >
                  {userData.length}
                </div>
                <div>总用户数</div>
              </div>
            </Card>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#52c41a'
                  }}
                >
                  {userData.filter((u) => u.status === '活跃').length}
                </div>
                <div>活跃用户</div>
              </div>
            </Card>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#fa8c16'
                  }}
                >
                  {userData.filter((u) => u.role === '管理员').length}
                </div>
                <div>管理员</div>
              </div>
            </Card>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#722ed1'
                  }}
                >
                  99.9%
                </div>
                <div>系统可用性</div>
              </div>
            </Card>
          </div>
        </Card>

        <Card title="集成使用说明">
          <div style={{ marginBottom: '16px' }}>
            <h4>集成特性:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>
                <strong>页面布局</strong>: 作为页面的主要导航和操作区域
              </li>
              <li>
                <strong>功能集成</strong>: 与搜索、筛选、表格等组件协同工作
              </li>
              <li>
                <strong>状态展示</strong>: 显示页面相关的状态信息和统计数据
              </li>
              <li>
                <strong>操作入口</strong>: 提供页面主要功能的快捷访问
              </li>
            </ul>
          </div>

          <div style={{ marginTop: '16px' }}>
            <h4>最佳实践:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>在页面顶部使用 PageHeader 提供主要导航</li>
              <li>将最常用的操作按钮放在 extra 区域</li>
              <li>使用图标和颜色增强视觉层次</li>
              <li>保持页面头部与内容区域的视觉一致性</li>
              <li>考虑响应式设计，在小屏幕上适当调整布局</li>
            </ul>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default IntegrationDemo;
