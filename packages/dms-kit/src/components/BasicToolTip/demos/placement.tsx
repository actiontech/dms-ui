import React from 'react';
import { BasicToolTip } from '@actiontech/dms-kit';
import { ConfigProvider } from '@actiontech/dms-kit';
import { Space, Button } from 'antd';

const BasicToolTipPlacementDemo = () => {
  const placements = [
    'top',
    'topLeft',
    'topRight',
    'bottom',
    'bottomLeft',
    'bottomRight',
    'left',
    'leftTop',
    'leftBottom',
    'right',
    'rightTop',
    'rightBottom'
  ];

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h4>提示位置演示</h4>
          <p>点击按钮查看不同位置的提示效果</p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px'
          }}
        >
          {placements.map((placement) => (
            <BasicToolTip
              key={placement}
              title={`这是 ${placement} 位置的提示`}
              placement={placement as any}
            >
              <Button size="small">{placement}</Button>
            </BasicToolTip>
          ))}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default BasicToolTipPlacementDemo;
