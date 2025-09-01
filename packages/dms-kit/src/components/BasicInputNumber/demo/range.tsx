import React from 'react';
import { BasicInputNumber, ConfigProvider } from '@actiontech/dms-kit';

const RangeDemo = () => {
  return (
    <ConfigProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <BasicInputNumber placeholder="0-100之间的数字" min={0} max={100} />
        <BasicInputNumber placeholder="-50到50之间的数字" min={-50} max={50} />
        <BasicInputNumber placeholder="正整数" min={1} />
        <BasicInputNumber placeholder="非负数" min={0} />
      </div>
    </ConfigProvider>
  );
};

export default RangeDemo;
