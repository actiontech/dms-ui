import React from 'react';
import { BasicInput, ConfigProvider } from '@actiontech/dms-kit';

const BasicInputDemo = () => {
  return (
    <ConfigProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <BasicInput placeholder="请输入内容" />
        <BasicInput placeholder="请输入用户名" />
        <BasicInput placeholder="请输入邮箱" />
      </div>
    </ConfigProvider>
  );
};

export default BasicInputDemo;
