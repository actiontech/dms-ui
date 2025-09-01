import React from 'react';
import { BasicInputNumber, ConfigProvider } from '@actiontech/dms-kit';

const SizesDemo = () => {
  return (
    <ConfigProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <BasicInputNumber size="large" placeholder="大尺寸数字输入框" />
        <BasicInputNumber size="middle" placeholder="默认尺寸数字输入框" />
        <BasicInputNumber size="small" placeholder="小尺寸数字输入框" />
      </div>
    </ConfigProvider>
  );
};

export default SizesDemo;
