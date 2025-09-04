import React, { useState } from 'react';
import { BasicSwitch, ConfigProvider } from '@actiontech/dms-kit';
import { Space } from 'antd';

const BasicSwitchWithLabelDemo = () => {
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <Space direction="vertical" size="large">
          <div>
            <BasicSwitch checked={notifications} onChange={setNotifications} />
            <span style={{ marginLeft: '8px' }}>接收通知</span>
          </div>

          <div>
            <BasicSwitch checked={autoSave} onChange={setAutoSave} />
            <span style={{ marginLeft: '8px' }}>自动保存</span>
          </div>

          <div>
            <BasicSwitch checked={darkMode} onChange={setDarkMode} />
            <span style={{ marginLeft: '8px' }}>深色模式</span>
          </div>
        </Space>
      </div>
    </ConfigProvider>
  );
};

export default BasicSwitchWithLabelDemo;
