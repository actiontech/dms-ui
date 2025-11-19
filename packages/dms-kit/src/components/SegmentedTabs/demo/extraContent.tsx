import React, { useState } from 'react';
import { Space, Typography, Input, Select, Badge } from 'antd';
import { BasicSelect, BasicButton } from '@actiontech/dms-kit';
import { SegmentedTabs, ConfigProvider } from '@actiontech/dms-kit';
import {
  UserOutlined,
  SettingOutlined,
  BarChartOutlined,
  PlusOutlined,
  FilterOutlined
} from '@ant-design/icons';

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
          <Typography.Title level={4}>用户管理</Typography.Title>
          <Typography.Paragraph>
            这里是用户管理模块的内容。您可以在这里管理用户信息、权限设置等。
          </Typography.Paragraph>
        </div>
      )
    },
    {
      label: '系统设置',
      value: 'setting',
      icon: <SettingOutlined />,
      children: (
        <div style={{ padding: '20px' }}>
          <Typography.Title level={4}>系统设置</Typography.Title>
          <Typography.Paragraph>
            这里是系统设置模块的内容。您可以在这里配置系统参数、环境设置等。
          </Typography.Paragraph>
        </div>
      )
    },
    {
      label: '数据统计',
      value: 'stats',
      icon: <BarChartOutlined />,
      children: (
        <div style={{ padding: '20px' }}>
          <Typography.Title level={4}>数据统计</Typography.Title>
          <Typography.Paragraph>
            这里是数据统计模块的内容。您可以在这里查看各种统计数据和报表。
          </Typography.Paragraph>
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
        segmentedRowExtraContent={
          <Space style={{ marginLeft: '12px' }}>
            <Input.Search
              placeholder="搜索内容"
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <BasicSelect
              value={filterType}
              onChange={setFilterType}
              style={{ width: 120 }}
              placeholder="筛选类型"
              options={[
                { label: '全部', value: 'all' },
                { label: '活跃', value: 'active' },
                { label: '非活跃', value: 'inactive' }
              ]}
            />
            <BasicButton icon={<PlusOutlined />} type="primary">
              新建
            </BasicButton>
            <Badge count={5} size="small">
              <BasicButton icon={<FilterOutlined />}>筛选</BasicButton>
            </Badge>
          </Space>
        }
      />
    </ConfigProvider>
  );
};

export default ExtraContentDemo;
