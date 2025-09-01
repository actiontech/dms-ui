import React, { useState } from 'react';
import { Card, Space, Typography, Button, Input, Table, Tag } from 'antd';
import { SegmentedTabs, ConfigProvider } from '@actiontech/dms-kit';
import {
  UserOutlined,
  SettingOutlined,
  BarChartOutlined,
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { Search } = Input;

const DynamicContentDemo: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>('user');
  const [userData, setUserData] = useState([
    { id: 1, name: '张三', role: '管理员', status: '活跃' },
    { id: 2, name: '李四', role: '用户', status: '活跃' },
    { id: 3, name: '王五', role: '用户', status: '禁用' }
  ]);

  const [searchText, setSearchText] = useState('');

  const userColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '角色', dataIndex: 'role', key: 'role' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === '活跃' ? 'green' : 'red'}>{status}</Tag>
      )
    }
  ];

  const addUser = () => {
    const newUser = {
      id: userData.length + 1,
      name: `用户${userData.length + 1}`,
      role: '用户',
      status: '活跃'
    };
    setUserData([...userData, newUser]);
  };

  const items = [
    {
      label: '用户管理',
      value: 'user',
      icon: <UserOutlined />,
      children: (
        <div style={{ padding: '20px' }}>
          <div
            style={{
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Title level={4}>用户管理</Title>
            <Button type="primary" icon={<PlusOutlined />} onClick={addUser}>
              添加用户
            </Button>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <Search
              placeholder="搜索用户"
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
          </div>

          <Table
            columns={userColumns}
            dataSource={userData.filter((user) =>
              user.name.toLowerCase().includes(searchText.toLowerCase())
            )}
            rowKey="id"
            pagination={false}
          />
        </div>
      )
    },
    {
      label: '系统设置',
      value: 'setting',
      icon: <SettingOutlined />,
      children: (
        <div style={{ padding: '20px' }}>
          <Title level={4}>系统设置</Title>
          <Paragraph>这里是系统设置模块，包含各种配置选项。</Paragraph>

          <Space direction="vertical" style={{ width: '100%' }}>
            <Card title="基础配置" size="small">
              <Space>
                <span>系统名称:</span>
                <Input defaultValue="DMS 系统" style={{ width: 200 }} />
              </Space>
            </Card>

            <Card title="安全设置" size="small">
              <Space>
                <span>密码策略:</span>
                <Input
                  defaultValue="8位以上，包含字母数字"
                  style={{ width: 300 }}
                />
              </Space>
            </Card>

            <Card title="通知配置" size="small">
              <Space>
                <span>邮件通知:</span>
                <Button type="primary" size="small">
                  启用
                </Button>
                <Button size="small">禁用</Button>
              </Space>
            </Card>
          </Space>
        </div>
      )
    },
    {
      label: '数据统计',
      value: 'stats',
      icon: <BarChartOutlined />,
      children: (
        <div style={{ padding: '20px' }}>
          <Title level={4}>数据统计</Title>
          <Paragraph>这里是数据统计模块，展示各种统计信息。</Paragraph>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '16px'
            }}
          >
            <Card title="用户统计" size="small">
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

            <Card title="活跃用户" size="small">
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
                <div>活跃用户数</div>
              </div>
            </Card>

            <Card title="管理员" size="small">
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
                <div>管理员数</div>
              </div>
            </Card>
          </div>
        </div>
      )
    }
  ];

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>动态内容切换</h3>

        <Card title="动态内容管理" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>
              当前选中的标签页: <strong>{activeKey}</strong>
            </p>
            <p>每个标签页都有独立的内容和状态，支持动态更新和交互操作。</p>
          </div>

          <SegmentedTabs
            items={items}
            activeKey={activeKey}
            onChange={setActiveKey}
            defaultActiveKey="user"
          />
        </Card>

        <Card title="功能说明">
          <div style={{ marginBottom: '16px' }}>
            <h4>动态内容特性:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>
                <strong>独立状态</strong>: 每个标签页维护独立的状态和数据
              </li>
              <li>
                <strong>交互操作</strong>: 支持按钮点击、输入框编辑等交互
              </li>
              <li>
                <strong>数据更新</strong>:
                内容可以动态更新，如添加用户、搜索过滤
              </li>
              <li>
                <strong>复杂组件</strong>: 支持表格、表单、卡片等复杂组件
              </li>
              <li>
                <strong>实时反馈</strong>: 操作结果实时反映在界面上
              </li>
            </ul>
          </div>

          <div style={{ marginTop: '16px' }}>
            <h4>使用场景:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>管理后台的多功能页面</li>
              <li>数据展示和编辑的集成界面</li>
              <li>配置管理和实时预览</li>
              <li>统计信息和操作面板</li>
            </ul>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default DynamicContentDemo;
