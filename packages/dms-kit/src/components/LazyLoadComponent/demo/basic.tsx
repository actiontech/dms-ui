import React, { useState } from 'react';
import { ConfigProvider } from '@actiontech/dms-kit';
import LazyLoadComponent from '../LazyLoadComponent';

export default function BasicDemo() {
  const [visible, setVisible] = useState(false);
  return (
    <ConfigProvider>
      <button onClick={() => setVisible((v) => !v)}>切换显示</button>
      <LazyLoadComponent open={visible}>
        <div>这是懒加载内容</div>
      </LazyLoadComponent>
    </ConfigProvider>
  );
}
