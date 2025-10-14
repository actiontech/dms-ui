import React, { useState } from 'react';
import { Card, Space, Typography, Tag } from 'antd';
import { SegmentedTabs, ConfigProvider } from '@actiontech/dms-kit';
import {
  UserOutlined,
  SettingOutlined,
  BarChartOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const BasicDemo: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>('user');

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
          <Space>
            <Tag color="blue">用户列表</Tag>
            <Tag color="green">权限管理</Tag>
            <Tag color="orange">角色分配</Tag>
          </Space>
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
          <Space>
            <Tag color="blue">基础配置</Tag>
            <Tag color="green">安全设置</Tag>
            <Tag color="orange">通知配置</Tag>
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
          <Paragraph>
            这里是数据统计模块的内容。您可以在这里查看各种统计数据和报表。
          </Paragraph>
          <Space>
            <Tag color="blue">用户统计</Tag>
            <Tag color="green">访问统计</Tag>
            <Tag color="orange">性能监控</Tag>
          </Space>
        </div>
      )
    }
  ];

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>基础用法</h3>

        <Card title="分段标签页基础功能" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>
              当前选中的标签页: <strong>{activeKey}</strong>
            </p>
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
            <h4>组件特点:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>
                <strong>分段控制器</strong>: 顶部显示标签页选项，支持图标和文本
              </li>
              <li>
                <strong>内容切换</strong>: 点击标签页自动切换对应的内容区域
              </li>
              <li>
                <strong>状态管理</strong>: 支持受控模式，通过 activeKey 和
                onChange 管理状态
              </li>
              <li>
                <strong>默认选中</strong>: 通过 defaultActiveKey
                设置默认选中的标签页
              </li>
              <li>
                <strong>图标支持</strong>: 每个标签页可以配置独立的图标
              </li>
            </ul>
          </div>

          <div style={{ marginTop: '16px' }}>
            <h4>使用场景:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>数据展示页面的分类展示</li>
              <li>设置页面的分组管理</li>
              <li>仪表板的多维度信息展示</li>
              <li>复杂表单的字段分组</li>
            </ul>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default BasicDemo;
