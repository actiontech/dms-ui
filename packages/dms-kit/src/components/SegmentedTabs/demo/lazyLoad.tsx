import React, { useState, useEffect } from 'react';
import { SegmentedTabs, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Tag } from 'antd';

/**
 * 模拟一个有副作用的面板内容（带定时器）
 */
function PanelWithTimer({
  title,
  config
}: {
  title: string;
  config: { forceRender?: boolean; destroyInactivePane?: boolean };
}) {
  const [seconds, setSeconds] = useState(0);
  const [mountTime] = useState(() => new Date().toLocaleTimeString());

  useEffect(() => {
    console.log(`✅ [${title}] 面板已挂载 - ${mountTime}`);
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => {
      console.log(`❌ [${title}] 面板已卸载 - 定时器已清理`);
      clearInterval(interval);
    };
  }, [title, mountTime]);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '15px' }}>
        <h3 style={{ marginBottom: '10px' }}>{title}</h3>
        <Space>
          <Tag color={config.forceRender ? 'green' : 'default'}>
            forceRender: {config.forceRender ? 'true' : 'false'}
          </Tag>
          <Tag color={config.destroyInactivePane ? 'orange' : 'default'}>
            destroyInactivePane: {config.destroyInactivePane ? 'true' : 'false'}
          </Tag>
        </Space>
      </div>

      <div
        style={{
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          marginBottom: '15px'
        }}
      >
        <div
          style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }}
        >
          ⏱️ {seconds} 秒
        </div>
        <div style={{ fontSize: '13px', color: '#666' }}>
          挂载时间: {mountTime}
        </div>
      </div>

      <div
        style={{
          padding: '12px',
          backgroundColor: '#e6f7ff',
          borderRadius: '4px',
          fontSize: '13px'
        }}
      >
        <strong>配置说明：</strong>
        <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
          {config.forceRender ? (
            <li>✅ 提前渲染：即使未激活也会挂载到 DOM（通过 CSS 隐藏）</li>
          ) : (
            <li>❌ 按需渲染：仅在激活时挂载到 DOM</li>
          )}
          {config.destroyInactivePane ? (
            <li>✅ 自动销毁：切换到其他标签时销毁组件，释放资源</li>
          ) : (
            <li>❌ 保持状态：切换到其他标签时保留组件和状态</li>
          )}
        </ul>
      </div>
    </div>
  );
}

/**
 * LazyLoad Demo
 * 演示不同 tab 项的 forceRender 和 destroyInactivePane 配置
 */
const LazyLoadDemo: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>('tab1');

  const items = [
    {
      label: '默认配置',
      value: 'tab1',
      children: (
        <PanelWithTimer
          title="Tab 1 - 默认配置"
          config={{ forceRender: false, destroyInactivePane: false }}
        />
      )
      // 默认: forceRender=false, destroyInactivePane=false
    },
    {
      label: '强制渲染',
      value: 'tab2',
      forceRender: true,
      children: (
        <PanelWithTimer
          title="Tab 2 - 强制渲染"
          config={{ forceRender: true, destroyInactivePane: false }}
        />
      )
    },
    {
      label: '自动销毁',
      value: 'tab3',
      destroyInactivePane: true,
      children: (
        <PanelWithTimer
          title="Tab 3 - 自动销毁"
          config={{ forceRender: false, destroyInactivePane: true }}
        />
      )
    },
    {
      label: '组合配置',
      value: 'tab4',
      forceRender: true,
      destroyInactivePane: true,
      children: (
        <PanelWithTimer
          title="Tab 4 - 强制渲染 + 自动销毁"
          config={{ forceRender: true, destroyInactivePane: true }}
        />
      )
    }
  ];

  return (
    <ConfigProvider>
      <div
        style={{
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#fff7e6',
          borderRadius: '4px'
        }}
      >
        <strong>💡 使用说明：</strong>
        <ul style={{ marginBottom: 0, marginTop: '8px', paddingLeft: '20px' }}>
          <li>打开浏览器控制台查看面板的挂载和卸载日志</li>
          <li>观察定时器在不同配置下的行为差异</li>
          <li>使用开发者工具检查 DOM 结构的变化</li>
        </ul>
      </div>

      <SegmentedTabs
        items={items}
        activeKey={activeKey}
        onChange={setActiveKey}
      />
    </ConfigProvider>
  );
};

export default LazyLoadDemo;
