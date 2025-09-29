import React from 'react';
import { CustomInput, ConfigProvider } from '@actiontech/dms-kit';
import { message, Space, Card } from 'antd';

const SizesDemo: React.FC = () => {
  const handleCustomPressEnter = (value: string) => {
    message.success(`输入的值: ${value}`);
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>不同尺寸的输入框</h3>
        
        <Card title="小尺寸 (small) - 默认" style={{ marginBottom: '16px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <CustomInput
              size="small"
              prefix="🔍"
              placeholder="小尺寸输入框"
              onCustomPressEnter={handleCustomPressEnter}
              style={{ width: '300px' }}
            />
            <div style={{ fontSize: '12px', color: '#666' }}>
              适合紧凑的布局，节省空间
            </div>
          </Space>
        </Card>

        <Card title="中尺寸 (middle)" style={{ marginBottom: '16px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <CustomInput
              size="middle"
              prefix="📝"
              placeholder="中尺寸输入框"
              onCustomPressEnter={handleCustomPressEnter}
              style={{ width: '300px' }}
            />
            <div style={{ fontSize: '12px', color: '#666' }}>
              标准尺寸，适合大多数场景
            </div>
          </Space>
        </Card>

        <Card title="大尺寸 (large)" style={{ marginBottom: '16px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <CustomInput
              size="large"
              prefix="✏️"
              placeholder="大尺寸输入框"
              onCustomPressEnter={handleCustomPressEnter}
              style={{ width: '300px' }}
            />
            <div style={{ fontSize: '12px', color: '#666' }}>
              适合需要突出显示的输入框
            </div>
          </Space>
        </Card>

        <Card title="尺寸对比" style={{ marginBottom: '16px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <CustomInput
              size="small"
              prefix="S"
              placeholder="小尺寸"
              onCustomPressEnter={handleCustomPressEnter}
              style={{ width: '300px' }}
            />
            <CustomInput
              size="middle"
              prefix="M"
              placeholder="中尺寸"
              onCustomPressEnter={handleCustomPressEnter}
              style={{ width: '300px' }}
            />
            <CustomInput
              size="large"
              prefix="L"
              placeholder="大尺寸"
              onCustomPressEnter={handleCustomPressEnter}
              style={{ width: '300px' }}
            />
          </Space>
        </Card>

        <Card title="响应式布局" style={{ marginBottom: '16px' }}>
          <Space wrap>
            <CustomInput
              size="small"
              prefix="🔍"
              placeholder="搜索"
              onCustomPressEnter={handleCustomPressEnter}
              style={{ width: '200px' }}
            />
            <CustomInput
              size="middle"
              prefix="📧"
              placeholder="邮箱"
              onCustomPressEnter={handleCustomPressEnter}
              style={{ width: '250px' }}
            />
            <CustomInput
              size="large"
              prefix="💬"
              placeholder="评论"
              onCustomPressEnter={handleCustomPressEnter}
              style={{ width: '300px' }}
            />
          </Space>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default SizesDemo;
