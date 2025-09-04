import React from 'react';
import { BasicInputNumber, ConfigProvider } from '@actiontech/dms-kit';

const DisabledDemo = () => {
  return (
    <ConfigProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <BasicInputNumber placeholder="禁用的数字输入框" disabled />
        <BasicInputNumber
          placeholder="禁用的数字输入框（带值）"
          disabled
          defaultValue={100}
        />
        <BasicInputNumber
          placeholder="禁用的数字输入框（带范围）"
          disabled
          min={0}
          max={100}
          defaultValue={50}
        />
      </div>
    </ConfigProvider>
  );
};

export default DisabledDemo;
