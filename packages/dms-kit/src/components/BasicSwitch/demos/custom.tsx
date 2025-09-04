import React, { useState } from 'react';
import { BasicSwitch, ConfigProvider } from '@actiontech/dms-kit';
import { Space } from 'antd';

const BasicSwitchCustomDemo = () => {
  const [checked, setChecked] = useState(false);

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <Space direction="vertical" size="large">
          <div>
            <BasicSwitch
              checked={checked}
              onChange={setChecked}
              className="custom-switch"
              style={{
                backgroundColor: checked ? '#52c41a' : '#bfbfbf'
              }}
            />
            <span style={{ marginLeft: '8px' }}>自定义颜色</span>
          </div>

          <div>
            <BasicSwitch
              checked={checked}
              onChange={setChecked}
              style={{
                transform: 'scale(1.2)',
                margin: '0 8px'
              }}
            />
            <span style={{ marginLeft: '8px' }}>放大尺寸</span>
          </div>
        </Space>

        <style>{`
          .custom-switch {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          }
        `}</style>
      </div>
    </ConfigProvider>
  );
};

export default BasicSwitchCustomDemo;
