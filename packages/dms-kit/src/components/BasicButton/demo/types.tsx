import React from 'react';
import { BasicButton, ConfigProvider } from '@actiontech/dms-kit';

const ButtonTypesDemo = () => {
  return (
    <ConfigProvider>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <BasicButton>默认按钮</BasicButton>
        <BasicButton type="primary">主要按钮</BasicButton>
        <BasicButton type="dashed">虚线按钮</BasicButton>
        <BasicButton type="text">文本按钮</BasicButton>
        <BasicButton type="link">链接按钮</BasicButton>
        <BasicButton danger>危险按钮</BasicButton>
      </div>
    </ConfigProvider>
  );
};

export default ButtonTypesDemo;
