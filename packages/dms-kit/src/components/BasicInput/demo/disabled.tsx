import React from 'react';
import { BasicInput, ConfigProvider } from '@actiontech/dms-kit';

const DisabledDemo = () => {
  return (
    <ConfigProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <BasicInput placeholder="禁用的输入框" disabled />
        <BasicInput.TextArea placeholder="禁用的文本域" disabled />
        <BasicInput.Password placeholder="禁用的密码框" disabled />
        <BasicInput
          placeholder="禁用的输入框（带值）"
          disabled
          defaultValue="这是禁用的值"
        />
      </div>
    </ConfigProvider>
  );
};

export default DisabledDemo;
