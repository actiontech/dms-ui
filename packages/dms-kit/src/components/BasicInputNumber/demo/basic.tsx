import React from 'react';
import { BasicInputNumber, ConfigProvider } from '@actiontech/dms-kit';

const BasicInputNumberDemo = () => {
  return (
    <ConfigProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <BasicInputNumber placeholder="请输入数字" />
        <BasicInputNumber placeholder="请输入金额" />
        <BasicInputNumber placeholder="请输入数量" />
      </div>
    </ConfigProvider>
  );
};

export default BasicInputNumberDemo;
