import React from 'react';
import { BasicSelect, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Typography } from 'antd';
import {
  SearchOutlined,
  CheckCircleOutlined,
  LockOutlined
} from '@actiontech/icons';

const { Text } = Typography;

/**
 * 前缀图标
 * - 在选择器左侧添加图标前缀
 * - 使用图标可避免文字长度不一的问题
 * - 让选择器含义更清晰直观
 */
const PrefixDemo = () => {
  const typeOptions = [
    { label: 'MySQL', value: 'mysql' },
    { label: 'PostgreSQL', value: 'postgres' },
    { label: 'Oracle', value: 'oracle' }
  ];

  const statusOptions = [
    { label: '启用', value: 'enabled' },
    { label: '禁用', value: 'disabled' },
    { label: '维护中', value: 'maintenance' }
  ];

  const priorityOptions = [
    { label: '高', value: 'high' },
    { label: '中', value: 'medium' },
    { label: '低', value: 'low' }
  ];

  return (
    <ConfigProvider>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <Text>数据库类型：</Text>
          <BasicSelect
            prefix={<SearchOutlined />}
            placeholder="请选择数据库类型"
            options={typeOptions}
            style={{ width: 300, marginLeft: 8 }}
          />
        </div>

        <div>
          <Text>状态：</Text>
          <BasicSelect
            prefix={<CheckCircleOutlined />}
            placeholder="请选择状态"
            options={statusOptions}
            defaultValue="enabled"
            style={{ width: 300, marginLeft: 8 }}
          />
        </div>

        <div>
          <Text>权限：</Text>
          <BasicSelect
            prefix={<LockOutlined />}
            placeholder="请选择权限"
            options={priorityOptions}
            allowClear
            style={{ width: 300, marginLeft: 8 }}
          />
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default PrefixDemo;
