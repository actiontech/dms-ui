import React, { useState } from 'react';
import { ConfigProvider, BasicButton } from '@actiontech/dms-kit';
import LazyLoadComponent from '../LazyLoadComponent';

/**
 * forceRender Demo
 * 演示通过 CSS display 实现强制渲染的效果
 */
export default function ForceRenderDemo() {
  const [visible, setVisible] = useState(false);

  return (
    <ConfigProvider>
      <div style={{ marginBottom: '20px' }}>
        <BasicButton onClick={() => setVisible((v) => !v)}>
          {visible ? '隐藏' : '显示'}组件
        </BasicButton>
      </div>

      {/* forceRender=true: 通过 CSS display 控制显示隐藏 */}
      <div style={{ marginBottom: '30px' }}>
        <div
          style={{
            padding: '10px',
            backgroundColor: '#fff7e6',
            borderRadius: '4px',
            marginBottom: '10px'
          }}
        >
          <strong>✅ forceRender=true</strong>
          <p style={{ margin: '5px 0 0 0', fontSize: '13px' }}>
            通过 CSS <code>display: none/block</code> 控制显隐，组件始终存在于
            DOM 中
          </p>
        </div>
        <LazyLoadComponent open={visible} forceRender>
          <div
            style={{
              padding: '15px',
              border: '1px solid #faad14',
              borderRadius: '4px',
              backgroundColor: '#fffbe6'
            }}
          >
            即使隐藏时，该元素也在 DOM 中（使用 display: none）
          </div>
        </LazyLoadComponent>
      </div>

      {/* 默认行为: 按需挂载/卸载 */}
      <div>
        <div
          style={{
            padding: '10px',
            backgroundColor: '#e6f7ff',
            borderRadius: '4px',
            marginBottom: '10px'
          }}
        >
          <strong>❌ forceRender=false（默认）</strong>
          <p style={{ margin: '5px 0 0 0', fontSize: '13px' }}>
            按需挂载/卸载，隐藏时元素不存在于 DOM 中
          </p>
        </div>
        <LazyLoadComponent open={visible}>
          <div
            style={{
              padding: '15px',
              border: '1px solid #1890ff',
              borderRadius: '4px',
              backgroundColor: '#e6f7ff'
            }}
          >
            只有显示时才挂载到 DOM，隐藏时完全移除
          </div>
        </LazyLoadComponent>
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px'
        }}
      >
        <strong>💡 提示：</strong>
        <p style={{ margin: '5px 0 0 0' }}>
          打开浏览器开发者工具查看 DOM
          结构，对比两种模式下元素的存在状态。forceRender 利用 CSS display
          属性实现了组件的显隐控制。
        </p>
      </div>
    </ConfigProvider>
  );
}
