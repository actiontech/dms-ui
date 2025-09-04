import React from 'react';
import { BasicSelect, ConfigProvider } from '@actiontech/dms-kit';

const PrefixDemo = () => {
  const options = [
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
    { label: '选项3', value: '3' }
  ];

  return (
    <ConfigProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <BasicSelect prefix="类型" placeholder="请选择类型" options={options} />
        <BasicSelect prefix="状态" placeholder="请选择状态" options={options} />
        <BasicSelect prefix="分类" placeholder="请选择分类" options={options} />
        <BasicSelect
          prefix="优先级"
          placeholder="请选择优先级"
          options={options}
          allowClear
        />
      </div>
    </ConfigProvider>
  );
};

export default PrefixDemo;
