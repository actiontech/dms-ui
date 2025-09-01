import React from 'react';
import { BasicSelect, ConfigProvider } from '@actiontech/dms-kit';

const MultipleDemo = () => {
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
        <BasicSelect
          mode="multiple"
          placeholder="请选择多个选项"
          options={options}
        />
        <BasicSelect
          mode="multiple"
          placeholder="请选择多个选项（带默认值）"
          options={options}
          defaultValue={['1', '2']}
        />
        <BasicSelect
          mode="tags"
          placeholder="请输入或选择标签"
          options={options}
        />
      </div>
    </ConfigProvider>
  );
};

export default MultipleDemo;
