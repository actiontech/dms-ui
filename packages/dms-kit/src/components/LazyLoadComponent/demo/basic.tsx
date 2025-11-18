import React, { useState } from 'react';
import { ConfigProvider, BasicButton } from '@actiontech/dms-kit';
import LazyLoadComponent from '../LazyLoadComponent';

export default function BasicDemo() {
  const [visible, setVisible] = useState(false);
  return (
    <ConfigProvider>
      <BasicButton onClick={() => setVisible((v) => !v)}>切换显示</BasicButton>
      <LazyLoadComponent open={visible}>
        <div style={{ marginTop: '10px' }}>这是懒加载内容</div>
      </LazyLoadComponent>
    </ConfigProvider>
  );
}
