import React from 'react';
import { CustomInput, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Divider, message } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';

/**
 * 基础用法
 * - 基本输入框
 * - 带图标前缀
 * - 带文本前缀
 * - 不同尺寸
 */
const BasicDemo: React.FC = () => {
  const handlePressEnter = (value: string) => {
    message.success(`输入的值: ${value}`);
  };

  return (
    <ConfigProvider>
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* 基本输入框 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>基本输入框：</div>
        <CustomInput
          placeholder="请输入内容，按回车键确认"
          onCustomPressEnter={handlePressEnter}
          style={{ width: '300px' }}
        />

        <Divider />

        {/* 图标前缀 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>图标前缀：</div>
        <Space direction="vertical">
          <CustomInput
            prefix={<SearchOutlined />}
            placeholder="搜索"
            onCustomPressEnter={handlePressEnter}
            style={{ width: '300px' }}
          />
          <CustomInput
            prefix={<UserOutlined />}
            placeholder="用户名"
            onCustomPressEnter={handlePressEnter}
            style={{ width: '300px' }}
          />
        </Space>

        <Divider />

        {/* 文本前缀 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>文本前缀：</div>
        <Space direction="vertical">
          <CustomInput
            prefix="项目:"
            placeholder="请输入项目名称"
            onCustomPressEnter={handlePressEnter}
            style={{ width: '300px' }}
          />
          <CustomInput
            prefix="SQL:"
            placeholder="请输入SQL语句"
            onCustomPressEnter={handlePressEnter}
            style={{ width: '300px' }}
          />
        </Space>

        <Divider />

        {/* 不同尺寸 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>不同尺寸：</div>
        <Space direction="vertical">
          <CustomInput
            size="small"
            prefix={<SearchOutlined />}
            placeholder="小尺寸（默认）"
            onCustomPressEnter={handlePressEnter}
            style={{ width: '300px' }}
          />
          <CustomInput
            size="middle"
            prefix={<SearchOutlined />}
            placeholder="中尺寸"
            onCustomPressEnter={handlePressEnter}
            style={{ width: '300px' }}
          />
          <CustomInput
            size="large"
            prefix={<SearchOutlined />}
            placeholder="大尺寸"
            onCustomPressEnter={handlePressEnter}
            style={{ width: '300px' }}
          />
        </Space>
      </Space>
    </ConfigProvider>
  );
};

export default BasicDemo;
