import React from 'react';
import { Card, Space, Typography } from 'antd';
import { SpinIndicator, ConfigProvider } from '@actiontech/dms-kit';

const BasicDemo: React.FC = () => {
  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>基础用法</h3>
        
        <Card title="默认尺寸" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>使用默认尺寸 (24px × 30px) 的加载指示器：</p>
          </div>
          <Space size="large" align="center">
            <div>
              <SpinIndicator />
              <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '12px' }}>
                默认尺寸
              </div>
            </div>
            <div>
              <SpinIndicator />
              <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '12px' }}>
                默认尺寸
              </div>
            </div>
            <div>
              <SpinIndicator />
              <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '12px' }}>
                默认尺寸
              </div>
            </div>
          </Space>
        </Card>

        <Card title="不同颜色" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>加载指示器会自动继承父元素的文本颜色：</p>
          </div>
          <Space size="large" align="center">
            <div style={{ color: '#1890ff' }}>
              <SpinIndicator />
              <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '12px' }}>
                蓝色主题
              </div>
            </div>
            <div style={{ color: '#52c41a' }}>
              <SpinIndicator />
              <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '12px' }}>
                绿色主题
              </div>
            </div>
            <div style={{ color: '#fa8c16' }}>
              <SpinIndicator />
              <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '12px' }}>
                橙色主题
              </div>
            </div>
            <div style={{ color: '#f5222d' }}>
              <SpinIndicator />
              <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '12px' }}>
                红色主题
              </div>
            </div>
          </Space>
        </Card>

        <Card title="动画效果说明">
          <div style={{ marginBottom: '16px' }}>
            <h4>动画特性:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li><strong>波浪式动画</strong>: 三个矩形依次进行动画，形成波浪效果</li>
              <li><strong>动画时长</strong>: 每个动画循环 0.6 秒</li>
              <li><strong>动画延迟</strong>: 三个矩形分别延迟 0s、0.15s、0.3s</li>
              <li><strong>动画属性</strong>: 透明度、高度、位置同时变化</li>
              <li><strong>循环方式</strong>: 无限循环播放</li>
            </ul>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <h4>技术实现:</h4>
            <pre style={{ backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
{`// 使用 SVG 动画实现
<svg>
  <rect>
    <animate attributeName="opacity" values="0.2; 1; .2" />
    <animate attributeName="height" values="10; 20; 10" />
    <animate attributeName="y" values="10; 5; 10" />
  </rect>
</svg>`}
            </pre>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default BasicDemo;
