import React from 'react';
import { BasicInputNumber, ConfigProvider } from '@actiontech/dms-kit';

const AffixDemo = () => {
  return (
    <ConfigProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <BasicInputNumber addonBefore="数量" placeholder="请输入数量" />
        <BasicInputNumber addonAfter="个" placeholder="请输入数量" />
        <BasicInputNumber
          addonBefore="价格"
          addonAfter="元"
          placeholder="请输入价格"
        />
        <BasicInputNumber
          addonBefore="重量"
          addonAfter="kg"
          placeholder="请输入重量"
        />
      </div>
    </ConfigProvider>
  );
};

export default AffixDemo;
