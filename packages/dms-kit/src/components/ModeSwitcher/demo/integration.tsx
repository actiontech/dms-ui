import React, { useState } from 'react';
import {
  Card,
  Space,
  Button,
  Typography,
  Divider,
  Row,
  Col,
  Table,
  Tag,
  Input,
  Select,
  DatePicker
} from 'antd';
import { ModeSwitcher, ConfigProvider } from '@actiontech/dms-kit';
import {
  AppstoreOutlined,
  BarsOutlined,
  TableOutlined,
  CalendarOutlined,
  UserOutlined,
  SettingOutlined,
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const IntegrationDemo: React.FC = () => {
  const [viewMode, setViewMode] = useState<string>('grid');
  const [userMode, setUserMode] = useState<string>('view');
  const [themeMode, setThemeMode] = useState<string>('light');
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

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
    },
    {
      id: 5,
      name: '钱七',
      email: 'qianqi@example.com',
      role: '用户',
      status: '活跃',
      createTime: '2024-02-15'
    },
    {
      id: 6,
      name: '孙八',
      email: 'sunba@example.com',
      role: '编辑',
      status: '禁用',
      createTime: '2024-02-20'
    }
  ];

  // 视图模式选项
  const viewOptions = [
    {
      label: '网格视图',
      value: 'grid',
      icon: <AppstoreOutlined />,
      colProps: { span: 8 }
    },
    {
      label: '列表视图',
      value: 'list',
      icon: <BarsOutlined />,
      colProps: { span: 8 }
    },
    {
      label: '表格视图',
      value: 'table',
      icon: <TableOutlined />,
      colProps: { span: 8 }
    }
  ];

  // 用户模式选项
  const userOptions = [
    {
      label: '查看模式',
      value: 'view',
      icon: <UserOutlined />,
      colProps: { span: 6 }
    },
    {
      label: '编辑模式',
      value: 'edit',
      icon: <EditOutlined />,
      colProps: { span: 6 }
    },
    {
      label: '管理模式',
      value: 'admin',
      icon: <SettingOutlined />,
      colProps: { span: 6 }
    },
    {
      label: '审核模式',
      value: 'review',
      icon: <EyeOutlined />,
      colProps: { span: 6 }
    }
  ];

  // 主题模式选项
  const themeOptions = [
    {
      label: '浅色主题',
      value: 'light',
      icon: (
        <div
          style={{
            width: '16px',
            height: '16px',
            backgroundColor: '#fff',
            border: '1px solid #d9d9d9',
            borderRadius: '2px'
          }}
        />
      )
    },
    {
      label: '深色主题',
      value: 'dark',
      icon: (
        <div
          style={{
            width: '16px',
            height: '16px',
            backgroundColor: '#001529',
            border: '1px solid #d9d9d9',
            borderRadius: '2px'
          }}
        />
      )
    },
    {
      label: '跟随系统',
      value: 'auto',
      icon: (
        <div
          style={{
            width: '16px',
            height: '16px',
            background: 'linear-gradient(45deg, #fff 50%, #001529 50%)',
            border: '1px solid #d9d9d9',
            borderRadius: '2px'
          }}
        />
      )
    }
  ];

  // 过滤后的数据
  const filteredData = userData.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) &&
      (filterStatus === 'all' || user.status === filterStatus)
  );

  // 表格列定义
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
      render: (status: string) => (
        <Tag color={status === '活跃' ? 'green' : 'red'}>{status}</Tag>
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
          {userMode === 'edit' && (
            <Button type="link" icon={<EditOutlined />} size="small">
              编辑
            </Button>
          )}
          {userMode === 'admin' && (
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
              删除
            </Button>
          )}
        </Space>
      )
    }
  ];

  // 渲染网格视图
  const renderGridView = () => (
    <Row gutter={[16, 16]}>
      {filteredData.map((user) => (
        <Col span={8} key={user.id}>
          <Card size="small" hoverable>
            <div style={{ textAlign: 'center' }}>
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
                  fontSize: '20px',
                  margin: '0 auto 12px'
                }}
              >
                {user.name.charAt(0)}
              </div>
              <Title level={5} style={{ margin: '0 0 8px' }}>
                {user.name}
              </Title>
              <Text type="secondary">{user.email}</Text>
              <div style={{ marginTop: '8px' }}>
                <Tag
                  color={
                    user.role === '管理员'
                      ? 'red'
                      : user.role === '编辑'
                      ? 'blue'
                      : 'green'
                  }
                >
                  {user.role}
                </Tag>
                <Tag color={user.status === '活跃' ? 'green' : 'red'}>
                  {user.status}
                </Tag>
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );

  // 渲染列表视图
  const renderListView = () => (
    <div>
      {filteredData.map((user) => (
        <Card
          key={user.id}
          size="small"
          style={{ marginBottom: '8px' }}
          bodyStyle={{ padding: '12px 16px' }}
        >
          <Row align="middle">
            <Col span={2}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#1890ff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px'
                }}
              >
                {user.name.charAt(0)}
              </div>
            </Col>
            <Col span={4}>
              <Text strong>{user.name}</Text>
            </Col>
            <Col span={6}>
              <Text type="secondary">{user.email}</Text>
            </Col>
            <Col span={3}>
              <Tag
                color={
                  user.role === '管理员'
                    ? 'red'
                    : user.role === '编辑'
                    ? 'blue'
                    : 'green'
                }
              >
                {user.role}
              </Tag>
            </Col>
            <Col span={3}>
              <Tag color={user.status === '活跃' ? 'green' : 'red'}>
                {user.status}
              </Tag>
            </Col>
            <Col span={3}>
              <Text type="secondary">{user.createTime}</Text>
            </Col>
            <Col span={3}>
              <Space>
                <Button type="link" icon={<EyeOutlined />} size="small">
                  查看
                </Button>
                {userMode === 'edit' && (
                  <Button type="link" icon={<EditOutlined />} size="small">
                    编辑
                  </Button>
                )}
                {userMode === 'admin' && (
                  <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                  >
                    删除
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        </Card>
      ))}
    </div>
  );

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>集成使用</h3>

        <Card title="用户管理系统" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>ModeSwitcher 组件在实际业务系统中的完整集成使用：</p>
          </div>

          {/* 主题模式切换 */}
          <div style={{ marginBottom: '20px' }}>
            <Text strong>主题设置: </Text>
            <ModeSwitcher
              options={themeOptions}
              value={themeMode}
              onChange={setThemeMode}
              defaultValue="light"
            />
          </div>

          {/* 用户模式切换 */}
          <div style={{ marginBottom: '20px' }}>
            <Text strong>用户模式: </Text>
            <ModeSwitcher
              options={userOptions}
              value={userMode}
              onChange={setUserMode}
              defaultValue="view"
            />
          </div>

          {/* 视图模式切换 */}
          <div style={{ marginBottom: '20px' }}>
            <Text strong>视图模式: </Text>
            <ModeSwitcher
              options={viewOptions}
              value={viewMode}
              onChange={setViewMode}
              defaultValue="grid"
            />
          </div>
        </Card>

        <Card title="搜索和筛选" style={{ marginBottom: '20px' }}>
          <Row gutter={16} align="middle">
            <Col span={8}>
              <Search
                placeholder="搜索用户名"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col span={6}>
              <Select
                value={filterStatus}
                onChange={setFilterStatus}
                placeholder="筛选状态"
                style={{ width: '100%' }}
              >
                <Option value="all">全部状态</Option>
                <Option value="活跃">活跃</Option>
                <Option value="禁用">禁用</Option>
              </Select>
            </Col>
            <Col span={6}>
              <DatePicker placeholder="创建时间" style={{ width: '100%' }} />
            </Col>
            <Col span={4}>
              <Button type="primary" icon={<PlusOutlined />} block>
                添加用户
              </Button>
            </Col>
          </Row>
        </Card>

        <Card title="数据展示">
          <div style={{ marginBottom: '16px' }}>
            <Text type="secondary">
              当前模式: {userMode} | 视图: {viewMode} | 主题: {themeMode} |
              数据量: {filteredData.length} 条
            </Text>
          </div>

          {viewMode === 'grid' && renderGridView()}
          {viewMode === 'list' && renderListView()}
          {viewMode === 'table' && (
            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey="id"
              size="middle"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
              }}
            />
          )}
        </Card>

        <Card title="集成说明">
          <div style={{ marginBottom: '16px' }}>
            <h4>集成特点:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>
                <strong>多模式切换</strong>:
                支持主题、用户权限、视图等多种模式切换
              </li>
              <li>
                <strong>自定义布局</strong>: 支持不同列宽和布局配置
              </li>
              <li>
                <strong>状态联动</strong>:
                不同模式之间相互影响，形成完整的交互系统
              </li>
              <li>
                <strong>业务集成</strong>: 与搜索、筛选、表格等业务组件无缝集成
              </li>
            </ul>
          </div>

          <Divider />

          <div style={{ marginBottom: '16px' }}>
            <h4>使用场景:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>管理系统的多视图切换</li>
              <li>用户权限模式控制</li>
              <li>主题和界面定制</li>
              <li>数据展示方式选择</li>
            </ul>
          </div>

          <div style={{ marginTop: '16px' }}>
            <h4>最佳实践:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>将相关的模式切换器组合使用</li>
              <li>考虑不同模式之间的依赖关系</li>
              <li>为用户提供清晰的模式说明</li>
              <li>保存用户的模式偏好设置</li>
            </ul>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default IntegrationDemo;
