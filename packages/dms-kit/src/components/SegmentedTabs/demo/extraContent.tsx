import React, { useState } from 'react';
import { Card, Space, Typography, Button, Input, Select, Badge } from 'antd';
import { SegmentedTabs, ConfigProvider } from '@actiontech/dms-kit';
import {
  UserOutlined,
  SettingOutlined,
  BarChartOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const ExtraContentDemo: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>('user');
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const items = [
    {
      label: '用户管理',
      value: 'user',
      icon: <UserOutlined />,
      children: (
        <div style={{ padding: '20px' }}>
          <Title level={4}>用户管理</Title>
          <Paragraph>
            这里是用户管理模块的内容。您可以在这里管理用户信息、权限设置等。
          </Paragraph>
          <div
            style={{
              backgroundColor: '#f0f0f0',
              padding: '20px',
              borderRadius: '8px'
            }}
          >
            <Text strong>当前筛选:</Text>{' '}
            {filterType === 'all' ? '全部用户' : filterType}
          </div>
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
          <Paragraph>
            这里是系统设置模块的内容。您可以在这里配置系统参数、环境设置等。
          </Paragraph>
          <div
            style={{
              backgroundColor: '#f0f0f0',
              padding: '20px',
              borderRadius: '8px'
            }}
          >
            <Text strong>搜索内容:</Text> {searchText || '无'}
          </div>
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
          <Paragraph>
            这里是数据统计模块的内容。您可以在这里查看各种统计数据和报表。
          </Paragraph>
          <div
            style={{
              backgroundColor: '#f0f0f0',
              padding: '20px',
              borderRadius: '8px'
            }}
          >
            <Text strong>当前状态:</Text> 数据正常，统计完成
          </div>
        </div>
      )
    }
  ];

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>额外内容区域</h3>

        <Card title="分段控制器额外内容" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>在分段控制器右侧显示额外的操作内容和状态信息：</p>
          </div>

          <SegmentedTabs
            items={items}
            activeKey={activeKey}
            onChange={setActiveKey}
            defaultActiveKey="user"
            segmentedRowExtraContent={
              <Space>
                <Search
                  placeholder="搜索内容"
                  allowClear
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 200 }}
                />
                <Select
                  value={filterType}
                  onChange={setFilterType}
                  style={{ width: 120 }}
                  placeholder="筛选类型"
                >
                  <Option value="all">全部</Option>
                  <Option value="active">活跃</Option>
                  <Option value="inactive">非活跃</Option>
                </Select>
                <Button icon={<PlusOutlined />} type="primary" size="small">
                  新建
                </Button>
                <Badge count={5} size="small">
                  <Button icon={<FilterOutlined />} size="small">
                    筛选
                  </Button>
                </Badge>
              </Space>
            }
          />
        </Card>

        <Card title="状态信息展示" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>在分段控制器右侧显示状态信息和快捷操作：</p>
          </div>

          <SegmentedTabs
            items={items}
            activeKey={activeKey}
            onChange={setActiveKey}
            defaultActiveKey="user"
            segmentedRowExtraContent={
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
              >
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    在线用户
                  </div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#52c41a'
                    }}
                  >
                    128
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
                <Button size="small" type="link">
                  刷新
                </Button>
                <Button size="small" type="link">
                  设置
                </Button>
              </div>
            }
          />
        </Card>

        <Card title="功能说明">
          <div style={{ marginBottom: '16px' }}>
            <h4>额外内容区域特点:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>
                <strong>搜索功能</strong>: 在分段控制器右侧集成搜索框
              </li>
              <li>
                <strong>筛选控件</strong>: 包含下拉选择、按钮等筛选组件
              </li>
              <li>
                <strong>状态信息</strong>: 显示系统状态、用户数量等实时信息
              </li>
              <li>
                <strong>快捷操作</strong>: 放置常用的操作按钮和链接
              </li>
              <li>
                <strong>灵活布局</strong>: 支持任意 React 组件的组合排列
              </li>
            </ul>
          </div>

          <div style={{ marginTop: '16px' }}>
            <h4>使用场景:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>数据管理页面的搜索和筛选功能</li>
              <li>系统监控页面的状态信息展示</li>
              <li>配置页面的快捷操作按钮</li>
              <li>仪表板页面的实时数据展示</li>
            </ul>
          </div>

          <div style={{ marginTop: '16px' }}>
            <h4>设计建议:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>保持额外内容区域的宽度合理，不影响分段控制器的显示</li>
              <li>使用图标和颜色来增强信息的可读性</li>
              <li>考虑响应式设计，在小屏幕上适当调整布局</li>
              <li>避免放置过多的元素，保持界面简洁清晰</li>
            </ul>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default ExtraContentDemo;
