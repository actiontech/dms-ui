import React from 'react';
import { CustomInput, ConfigProvider } from '@actiontech/dms-kit';
import { message } from 'antd';

const BasicDemo: React.FC = () => {
  const handleCustomPressEnter = (value: string) => {
    message.success(`输入的值: ${value}`);
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>基础用法</h3>
        <div style={{ marginBottom: '16px' }}>
          <CustomInput
            placeholder="请输入内容，按回车键确认"
            onCustomPressEnter={handleCustomPressEnter}
            style={{ width: '300px' }}
          />
        </div>

        <h3>带前缀的输入框</h3>
        <div style={{ marginBottom: '16px' }}>
          <CustomInput
            prefix="🔍"
            placeholder="搜索内容"
            onCustomPressEnter={handleCustomPressEnter}
            style={{ width: '300px' }}
          />
        </div>

        <h3>带文本前缀的输入框</h3>
        <div style={{ marginBottom: '16px' }}>
          <CustomInput
            prefix="用户名:"
            placeholder="请输入用户名"
            onCustomPressEnter={handleCustomPressEnter}
            style={{ width: '300px' }}
          />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default BasicDemo;
