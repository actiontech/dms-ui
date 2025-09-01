import React from 'react';
import { BasicButton, ConfigProvider } from '@actiontech/dms-kit';

const ButtonSizesDemo = () => {
  return (
    <ConfigProvider>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <BasicButton size="large">大尺寸</BasicButton>
        <BasicButton>默认尺寸</BasicButton>
        <BasicButton size="small">小尺寸</BasicButton>
      </div>
    </ConfigProvider>
  );
};

export default ButtonSizesDemo;
