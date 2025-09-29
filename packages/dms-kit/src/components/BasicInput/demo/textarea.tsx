import React from 'react';
import { BasicInput, ConfigProvider } from '@actiontech/dms-kit';

const TextAreaDemo = () => {
  return (
    <ConfigProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <BasicInput.TextArea placeholder="请输入多行文本" rows={4} />
        <BasicInput.TextArea
          placeholder="自适应高度的文本域"
          autoSize={{ minRows: 2, maxRows: 6 }}
        />
        <BasicInput.TextArea placeholder="固定行数的文本域" rows={6} />
      </div>
    </ConfigProvider>
  );
};

export default TextAreaDemo;
