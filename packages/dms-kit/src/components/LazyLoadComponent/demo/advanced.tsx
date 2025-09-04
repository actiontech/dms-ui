import React, { useState } from 'react';
import { ConfigProvider } from '@actiontech/dms-kit';
import LazyLoadComponent from '../LazyLoadComponent';

function HeavyComponent() {
  return <div>这是重组件内容</div>;
}

export default function AdvancedDemo() {
  const [visible, setVisible] = useState(false);
  return (
    <ConfigProvider>
      <button onClick={() => setVisible((v) => !v)}>切换重渲染</button>
      <LazyLoadComponent
        open={visible}
        forceRender
        destroyOnClose
        animation="fade"
      >
        <HeavyComponent />
      </LazyLoadComponent>
    </ConfigProvider>
  );
}
