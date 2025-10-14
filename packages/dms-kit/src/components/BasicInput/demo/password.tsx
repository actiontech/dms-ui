import React from 'react';
import { BasicInput, ConfigProvider } from '@actiontech/dms-kit';

const PasswordDemo = () => {
  return (
    <ConfigProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <BasicInput.Password placeholder="请输入密码" />
        <BasicInput.Password
          placeholder="不显示切换按钮的密码框"
          visibilityToggle={false}
        />
        <BasicInput.Password placeholder="带前缀的密码框" prefix="🔒" />
      </div>
    </ConfigProvider>
  );
};

export default PasswordDemo;
