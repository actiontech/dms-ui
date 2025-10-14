import React from 'react';
import { BasicInput, ConfigProvider } from '@actiontech/dms-kit';

const SizesDemo = () => {
  return (
    <ConfigProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <BasicInput size="large" placeholder="大尺寸输入框" />
        <BasicInput size="middle" placeholder="默认尺寸输入框" />
        <BasicInput size="small" placeholder="小尺寸输入框" />
      </div>
    </ConfigProvider>
  );
};

export default SizesDemo;
