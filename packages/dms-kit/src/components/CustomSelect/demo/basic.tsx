import React, { useState } from 'react';
import { CustomSelect, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Divider } from 'antd';

/**
 * 基础用法
 * - 默认小尺寸选择器
 * - 支持禁用和加载状态
 * - 支持清除功能
 */
const BasicDemo: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState<string>();

  const options = [
    { label: '选项1', value: 'option1' },
    { label: '选项2', value: 'option2' },
    { label: '选项3', value: 'option3' },
    { label: '选项4', value: 'option4' },
    { label: '选项5', value: 'option5' }
  ];

  return (
    <ConfigProvider>
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* 默认 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>默认：</div>
        <CustomSelect
          placeholder="请选择一个选项"
          options={options}
          onChange={setSelectedValue}
          allowClear
          style={{ width: '300px' }}
        />

        <Divider />

        {/* 不同尺寸 */}
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ color: '#666', marginBottom: '8px' }}>不同尺寸：</div>
          <CustomSelect
            size="small"
            placeholder="小尺寸（默认）"
            options={options}
            style={{ width: '300px' }}
          />
          <CustomSelect
            size="middle"
            placeholder="中尺寸"
            options={options}
            style={{ width: '300px' }}
          />
          <CustomSelect
            size="large"
            placeholder="大尺寸"
            options={options}
            style={{ width: '300px' }}
          />
        </Space>

        <Divider />

        {/* 禁用状态 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>禁用：</div>
        <CustomSelect
          disabled
          placeholder="禁用状态"
          options={options}
          style={{ width: '300px' }}
        />

        <Divider />

        {/* 加载状态 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>加载中：</div>
        <CustomSelect
          loading
          placeholder="加载中"
          options={options}
          style={{ width: '300px' }}
        />
      </Space>
    </ConfigProvider>
  );
};

export default BasicDemo;
