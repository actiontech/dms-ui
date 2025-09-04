import React from 'react';
import { BasicButton, ConfigProvider } from '@actiontech/dms-kit';

const ButtonStatesDemo = () => {
  return (
    <ConfigProvider>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <BasicButton>正常状态</BasicButton>
        <BasicButton disabled>禁用状态</BasicButton>
        <BasicButton loading>加载状态</BasicButton>
        <BasicButton type="primary" loading>主要按钮加载</BasicButton>
      </div>
    </ConfigProvider>
  );
};

export default ButtonStatesDemo;
