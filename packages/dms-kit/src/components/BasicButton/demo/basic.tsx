import React from 'react';
import { BasicButton, ConfigProvider } from '@actiontech/dms-kit';

const BasicButtonDemo = () => {
  return (
    <ConfigProvider>
      <BasicButton type="primary" onClick={() => alert('Clicked!')}>
        Primary Button
      </BasicButton>
      <BasicButton style={{ marginLeft: 8 }}>Default Button</BasicButton>
    </ConfigProvider>
  );
};
export default BasicButtonDemo;
