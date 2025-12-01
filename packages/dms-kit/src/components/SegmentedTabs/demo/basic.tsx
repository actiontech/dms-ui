import React, { useState } from 'react';
import { Space, Typography, Tag } from 'antd';
import { SegmentedTabs, ConfigProvider } from '@actiontech/dms-kit';

const { Title, Paragraph } = Typography;

const BasicDemo: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>('user');

  const items = [
    {
      label: '用户管理',
      value: 'user',
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
      <SegmentedTabs
        items={items}
        activeKey={activeKey}
        onChange={setActiveKey}
        defaultActiveKey="user"
      />
    </ConfigProvider>
  );
};

export default BasicDemo;
