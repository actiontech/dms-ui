import React, { useState } from 'react';
import { CustomSelect, ConfigProvider } from '@actiontech/dms-kit';
import { message, Space, Card } from 'antd';

const BasicDemo: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState<string>();

  const basicOptions = [
    { label: '选项1', value: 'option1' },
    { label: '选项2', value: 'option2' },
    { label: '选项3', value: 'option3' },
    { label: '选项4', value: 'option4' },
    { label: '选项5', value: 'option5' }
  ];

  const handleChange = (value: string) => {
    setSelectedValue(value);
    message.success(`选择了: ${value}`);
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>基础用法</h3>
        
        <Card title="基础选择器" style={{ marginBottom: '16px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <CustomSelect
              placeholder="请选择一个选项"
              options={basicOptions}
              onChange={handleChange}
              style={{ width: '300px' }}
            />
            <div style={{ fontSize: '14px', color: '#666' }}>
              当前选择: {selectedValue || '未选择'}
            </div>
          </Space>
        </Card>

        <Card title="不同尺寸" style={{ marginBottom: '16px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <CustomSelect
              size="small"
              placeholder="小尺寸选择器"
              options={basicOptions}
              onChange={handleChange}
              style={{ width: '300px' }}
            />
            <CustomSelect
              size="middle"
              placeholder="中尺寸选择器"
              options={basicOptions}
              onChange={handleChange}
              style={{ width: '300px' }}
            />
            <CustomSelect
              size="large"
              placeholder="大尺寸选择器"
              options={basicOptions}
              onChange={handleChange}
              style={{ width: '300px' }}
            />
          </Space>
        </Card>

        <Card title="禁用状态" style={{ marginBottom: '16px' }}>
          <CustomSelect
            disabled
            placeholder="禁用的选择器"
            options={basicOptions}
            style={{ width: '300px' }}
          />
        </Card>

        <Card title="加载状态" style={{ marginBottom: '16px' }}>
          <CustomSelect
            loading
            placeholder="加载中的选择器"
            options={basicOptions}
            style={{ width: '300px' }}
          />
        </Card>

        <Card title="清除功能" style={{ marginBottom: '16px' }}>
          <CustomSelect
            allowClear
            placeholder="支持清除的选择器"
            options={basicOptions}
            onChange={handleChange}
            style={{ width: '300px' }}
          />
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default BasicDemo;
