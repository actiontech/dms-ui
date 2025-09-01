import React from 'react';
import { BasicSelect, ConfigProvider } from '@actiontech/dms-kit';

const DisabledDemo = () => {
  const options = [
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
    { label: '选项3', value: '3' },
  ];

  return (
    <ConfigProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <BasicSelect 
          placeholder="禁用的选择器" 
          disabled
        />
        <BasicSelect 
          placeholder="禁用的选择器（带选项）" 
          options={options}
          disabled
        />
        <BasicSelect 
          placeholder="禁用的选择器（带默认值）" 
          options={options}
          defaultValue="1"
          disabled
        />
        <BasicSelect 
          placeholder="正常状态的选择器" 
          options={options}
        />
      </div>
    </ConfigProvider>
  );
};

export default DisabledDemo;
