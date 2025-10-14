import React, { useState } from 'react';
import { BasicInput, ConfigProvider } from '@actiontech/dms-kit';

const AllowClearDemo = () => {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');

  return (
    <ConfigProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <BasicInput
          placeholder="带清除按钮的输入框"
          allowClear
          value={value1}
          onChange={(e) => setValue1(e.target.value)}
        />
        <BasicInput
          placeholder="带清除按钮的文本域"
          allowClear
          value={value2}
          onChange={(e) => setValue2(e.target.value)}
        />
        <BasicInput placeholder="默认不带清除按钮" />
      </div>
    </ConfigProvider>
  );
};

export default AllowClearDemo;
