import React, { useState } from 'react';
import {
  Card,
  Space,
  Button,
  Typography,
  Input,
  Select,
  DatePicker,
  Tag
} from 'antd';
import { PageHeader, ConfigProvider } from '@actiontech/dms-kit';
import {
  PlusOutlined,
  DownloadOutlined,
  ReloadOutlined,
  FilterOutlined,
  SearchOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const ExtraContentDemo: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<any>(null);

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>额外内容区域</h3>

        <Card title="基础操作按钮" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>在页面头部右侧显示常用的操作按钮：</p>
          </div>

          <PageHeader
            title="用户管理"
            extra={
              <Space>
                <Button icon={<PlusOutlined />} type="primary">
                  添加用户
                </Button>
                <Button icon={<DownloadOutlined />}>导出数据</Button>
                <Button icon={<ReloadOutlined />}>刷新</Button>
              </Space>
            }
          />

          <div
            style={{
              padding: '20px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              marginTop: '20px'
            }}
          >
            <Paragraph>
              操作按钮放置在页面头部右侧，方便用户快速访问常用功能。
            </Paragraph>
          </div>
        </Card>

        <Card title="搜索和筛选" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>在页面头部集成搜索和筛选功能：</p>
          </div>

          <PageHeader
            title="订单管理"
            extra={
              <Space>
                <Search
                  placeholder="搜索订单号或客户名称"
                  allowClear
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 250 }}
                />
                <Select
                  value={status}
                  onChange={setStatus}
                  style={{ width: 120 }}
                  placeholder="订单状态"
                >
                  <Option value="all">全部状态</Option>
                  <Option value="pending">待处理</Option>
                  <Option value="processing">处理中</Option>
                  <Option value="completed">已完成</Option>
                  <Option value="cancelled">已取消</Option>
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
            }
          />

          <div
            style={{
              padding: '20px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              marginTop: '20px'
            }}
          >
            <Paragraph>
              集成了搜索框、状态选择器、日期范围选择器和筛选按钮，提供完整的查询功能。
            </Paragraph>
          </div>
        </Card>

        <Card title="复杂操作组合" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>组合多种操作元素，创建功能丰富的页面头部：</p>
          </div>

          <PageHeader
            title={
              <div>
                <Title level={3} style={{ margin: 0 }}>
                  数据报表
                </Title>
                <Text type="secondary">实时数据统计和分析</Text>
              </div>
            }
            extra={
              <Space>
                <div style={{ textAlign: 'right' }}>
                  <div>
                    最后更新: <Text strong>2分钟前</Text>
                  </div>
                  <div>
                    数据状态: <Tag color="green">正常</Tag>
                  </div>
                </div>
                <Button icon={<ReloadOutlined />}>刷新数据</Button>
                <Button icon={<DownloadOutlined />}>导出报表</Button>
                <Button icon={<SettingOutlined />} type="primary">
                  配置
                </Button>
              </Space>
            }
          />

          <div
            style={{
              padding: '20px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              marginTop: '20px'
            }}
          >
            <Paragraph>
              复杂的页面头部包含多行标题、状态信息和多种操作按钮，适合数据展示页面。
            </Paragraph>
          </div>
        </Card>

        <Card title="功能说明">
          <div style={{ marginBottom: '16px' }}>
            <h4>额外内容区域特点:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>
                <strong>操作按钮</strong>:
                放置常用的操作按钮，如添加、编辑、删除等
              </li>
              <li>
                <strong>搜索功能</strong>: 集成搜索框，支持快速查找内容
              </li>
              <li>
                <strong>筛选控件</strong>: 包含下拉选择、日期选择等筛选组件
              </li>
              <li>
                <strong>状态信息</strong>: 显示页面相关的状态信息和标签
              </li>
              <li>
                <strong>灵活布局</strong>: 支持任意 React 组件的组合排列
              </li>
            </ul>
          </div>

          <div style={{ marginTop: '16px' }}>
            <h4>使用建议:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>将最常用的操作放在右侧，提升用户体验</li>
              <li>搜索和筛选功能适合数据列表页面</li>
              <li>状态信息可以帮助用户了解当前页面状态</li>
              <li>避免放置过多的操作元素，保持界面简洁</li>
              <li>考虑响应式设计，在小屏幕上适当调整布局</li>
            </ul>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default ExtraContentDemo;
