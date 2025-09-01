import React from 'react';
import { BasicSwitch, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Typography } from 'antd';

const { Text } = Typography;

const BasicSwitchSizeDemo = () => {
  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <Space direction="vertical" size="large">
          <div>
            <Text>小尺寸:</Text>
            <BasicSwitch size="small" defaultChecked />
          </div>

          <div>
            <Text>默认尺寸:</Text>
            <BasicSwitch defaultChecked />
          </div>
        </Space>
      </div>
    </ConfigProvider>
  );
};

export default BasicSwitchSizeDemo;
