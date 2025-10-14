import React from 'react';
import { BasicSelect, ConfigProvider } from '@actiontech/dms-kit';

const BasicSelectDemo = () => {
  const options = [
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
    { label: '选项3', value: '3' },
    { label: '选项4', value: '4' },
    { label: '选项5', value: '5' }
  ];

  return (
    <ConfigProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <BasicSelect placeholder="请选择一个选项" options={options} />
        <BasicSelect
          placeholder="请选择一个选项（带默认值）"
          options={options}
          defaultValue="1"
        />
        <BasicSelect
          placeholder="请选择一个选项（允许清除）"
          options={options}
          allowClear
        />
      </div>
    </ConfigProvider>
  );
};

export default BasicSelectDemo;
