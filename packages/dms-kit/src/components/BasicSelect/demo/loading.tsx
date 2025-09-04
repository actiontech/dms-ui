import React from 'react';
import { BasicSelect, ConfigProvider } from '@actiontech/dms-kit';

const LoadingDemo = () => {
  const options = [
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
    { label: '选项3', value: '3' },
  ];

  return (
    <ConfigProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <BasicSelect 
          placeholder="加载中的选择器" 
          loading
        />
        <BasicSelect 
          placeholder="加载中的选择器（带选项）" 
          options={options}
          loading
        />
        <BasicSelect 
          placeholder="正常状态的选择器" 
          options={options}
        />
      </div>
    </ConfigProvider>
  );
};

export default LoadingDemo;
