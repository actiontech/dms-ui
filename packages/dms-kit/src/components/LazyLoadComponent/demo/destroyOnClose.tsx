import React, { useState, useEffect } from 'react';
import { ConfigProvider, BasicButton } from '@actiontech/dms-kit';
import LazyLoadComponent from '../LazyLoadComponent';

/**
 * 模拟一个有副作用的组件（定时器）
 */
function ComponentWithTimer({ label }: { label: string }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    console.log(`✅ [${label}] 组件已挂载`);
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => {
      console.log(`❌ [${label}] 组件已卸载，定时器已清理`);
      clearInterval(interval);
    };
  }, [label]);

  return (
    <div
      style={{
        padding: '15px',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        marginTop: '10px',
        backgroundColor: '#fafafa'
      }}
    >
      <div>
        <strong>{label}</strong>
      </div>
      <div style={{ marginTop: '8px', fontSize: '20px', color: '#1890ff' }}>
        ⏱️ {seconds} 秒
      </div>
    </div>
  );
}

/**
 * destroyOnClose Demo
 * 演示关闭时是否销毁组件的效果
 */
export default function DestroyOnCloseDemo() {
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);

  return (
    <ConfigProvider>
      <div
        style={{
          marginBottom: '15px',
          padding: '10px',
          backgroundColor: '#e6f7ff',
          borderRadius: '4px'
        }}
      >
        <strong>💡 提示：</strong> 打开浏览器控制台查看组件的挂载和卸载日志
      </div>

      {/* destroyOnClose=true */}
      <div style={{ marginBottom: '30px' }}>
        <BasicButton
          onClick={() => setVisible1((v) => !v)}
          style={{ marginBottom: '10px' }}
        >
          {visible1 ? '隐藏' : '显示'} - destroyOnClose=true
        </BasicButton>
        <div
          style={{
            padding: '10px',
            backgroundColor: '#fff7e6',
            borderRadius: '4px',
            marginBottom: '10px'
          }}
        >
          <strong>✅ destroyOnClose=true</strong>
          <p style={{ margin: '5px 0 0 0', fontSize: '13px' }}>
            关闭时完全销毁组件，释放资源（定时器、事件监听等）
          </p>
        </div>
        <LazyLoadComponent open={visible1} destroyOnClose>
          <ComponentWithTimer label="destroyOnClose=true" />
        </LazyLoadComponent>
      </div>

      {/* destroyOnClose=false (默认) */}
      <div>
        <BasicButton
          onClick={() => setVisible2((v) => !v)}
          style={{ marginBottom: '10px' }}
        >
          {visible2 ? '隐藏' : '显示'} - destroyOnClose=false（默认）
        </BasicButton>
        <div
          style={{
            padding: '10px',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            marginBottom: '10px'
          }}
        >
          <strong>❌ destroyOnClose=false（默认）</strong>
          <p style={{ margin: '5px 0 0 0', fontSize: '13px' }}>
            关闭时仅通过 CSS 隐藏，组件和副作用继续运行（定时器不停止）
          </p>
        </div>
        <LazyLoadComponent open={visible2}>
          <ComponentWithTimer label="destroyOnClose=false" />
        </LazyLoadComponent>
      </div>
    </ConfigProvider>
  );
}
