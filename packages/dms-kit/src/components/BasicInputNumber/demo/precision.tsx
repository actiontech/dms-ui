import React from 'react';
import { BasicInputNumber, ConfigProvider } from '@actiontech/dms-kit';

const PrecisionDemo = () => {
  return (
    <ConfigProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <BasicInputNumber placeholder="整数" precision={0} step={1} />
        <BasicInputNumber placeholder="保留1位小数" precision={1} step={0.1} />
        <BasicInputNumber placeholder="保留2位小数" precision={2} step={0.01} />
        <BasicInputNumber
          placeholder="保留3位小数"
          precision={3}
          step={0.001}
        />
      </div>
    </ConfigProvider>
  );
};

export default PrecisionDemo;
