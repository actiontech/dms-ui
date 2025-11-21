import React, { useState } from 'react';
import { BasicSwitch, ConfigProvider } from '@actiontech/dms-kit';
import DemoWrapper from './DemoWrapper';

/**
 * 基础用法
 * - 简单的开关切换
 * - 支持受控模式
 */
const BasicSwitchDemo = () => {
  const [checked, setChecked] = useState(false);

  const handleChange = (val: boolean) => {
    setChecked(val);
    console.log('Switch checked:', val);
  };

  return (
    <ConfigProvider>
      <DemoWrapper>
        <div style={{ padding: '20px' }}>
          <BasicSwitch checked={checked} onChange={handleChange} />
          <div style={{ marginTop: '16px' }}>
            当前状态: {checked ? '开启' : '关闭'}
          </div>
        </div>
      </DemoWrapper>
    </ConfigProvider>
  );
};

export default BasicSwitchDemo;
