import React from 'react';
import { BasicInput, ConfigProvider } from '@actiontech/dms-kit';

const TypesDemo = () => {
  return (
    <ConfigProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <BasicInput type="text" placeholder="文本输入框" />
        <BasicInput type="password" placeholder="密码输入框" />
        <BasicInput type="number" placeholder="数字输入框" />
        <BasicInput type="email" placeholder="邮箱输入框" />
        <BasicInput type="url" placeholder="URL输入框" />
        <BasicInput type="tel" placeholder="电话输入框" />
      </div>
    </ConfigProvider>
  );
};

export default TypesDemo;
