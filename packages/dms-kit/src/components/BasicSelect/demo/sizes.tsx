import React from 'react';
import { BasicSelect, ConfigProvider } from '@actiontech/dms-kit';

const SizesDemo = () => {
  const options = [
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
    { label: '选项3', value: '3' }
  ];

  return (
    <ConfigProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <BasicSelect
          size="large"
          placeholder="大尺寸选择器"
          options={options}
        />
        <BasicSelect
          size="middle"
          placeholder="默认尺寸选择器"
          options={options}
        />
        <BasicSelect
          size="small"
          placeholder="小尺寸选择器"
          options={options}
        />
      </div>
    </ConfigProvider>
  );
};

export default SizesDemo;
