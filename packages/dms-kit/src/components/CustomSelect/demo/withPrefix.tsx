import React, { useState } from 'react';
import { CustomSelect, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Divider } from 'antd';
import {
  UserOutlined,
  DatabaseOutlined,
  TeamOutlined
} from '@ant-design/icons';

/**
 * 带前缀的选择器
 * - 支持图标前缀
 * - 支持文本前缀
 * - 支持自定义值前缀
 */
const WithPrefixDemo: React.FC = () => {
  const userOptions = [
    { label: '张三', value: 'zhangsan' },
    { label: '李四', value: 'lisi' },
    { label: '王五', value: 'wangwu' },
    { label: '赵六', value: 'zhaoliu' }
  ];

  const databaseOptions = [
    { label: 'MySQL', value: 'mysql' },
    { label: 'PostgreSQL', value: 'postgresql' },
    { label: 'Oracle', value: 'oracle' },
    { label: 'SQL Server', value: 'sqlserver' }
  ];

  return (
    <ConfigProvider>
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* 图标前缀 */}
        <div style={{ color: '#666' }}>图标前缀：</div>
        <CustomSelect
          prefix={<UserOutlined />}
          placeholder="选择用户"
          options={userOptions}
          style={{ width: '300px' }}
        />
        <CustomSelect
          prefix={<DatabaseOutlined />}
          placeholder="选择数据库"
          options={databaseOptions}
          style={{ width: '300px' }}
        />

        <Divider />

        {/* 文本前缀 */}
        <div style={{ color: '#666' }}>文本前缀：</div>
        <CustomSelect
          prefix="用户:"
          placeholder="选择用户"
          options={userOptions}
          style={{ width: '300px' }}
        />
        <CustomSelect
          prefix="数据库:"
          placeholder="选择数据库"
          options={databaseOptions}
          style={{ width: '300px' }}
        />

        <Divider />

        {/* 自定义值前缀 */}
        <div style={{ color: '#666' }}>
          自定义值前缀（下拉选项中的前缀不同）：
        </div>
        <CustomSelect
          prefix={<UserOutlined />}
          valuePrefix={<TeamOutlined />}
          placeholder="选择用户"
          options={userOptions}
          style={{ width: '300px' }}
        />
      </Space>
    </ConfigProvider>
  );
};

export default WithPrefixDemo;
