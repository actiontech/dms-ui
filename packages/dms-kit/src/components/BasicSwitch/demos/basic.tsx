import React, { useState } from 'react';
import { BasicSwitch, ConfigProvider } from '@actiontech/dms-kit';

const BasicSwitchDemo = () => {
  const [checked, setChecked] = useState(false);

  const handleChange = (val: boolean) => {
    setChecked(val);
    console.log('Switch checked:', val);
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <BasicSwitch checked={checked} onChange={handleChange} />
        <div style={{ marginTop: '16px' }}>
          当前状态: {checked ? '开启' : '关闭'}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default BasicSwitchDemo;
