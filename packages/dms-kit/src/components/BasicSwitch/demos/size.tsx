import React from 'react';
import { BasicSwitch, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Typography } from 'antd';
import DemoWrapper from './DemoWrapper';

const { Text } = Typography;

/**
 * 不同尺寸和状态
 * - 支持 small 和 default 两种尺寸
 * - 展示选中状态效果
 */
const BasicSwitchSizeDemo = () => {
  return (
    <ConfigProvider>
      <DemoWrapper>
        <div style={{ padding: '20px' }}>
          <Space direction="vertical" size="large">
            <div>
              <Text style={{ marginRight: '8px' }}>小尺寸:</Text>
              <BasicSwitch size="small" defaultChecked />
            </div>

            <div>
              <Text style={{ marginRight: '8px' }}>默认尺寸:</Text>
              <BasicSwitch defaultChecked />
            </div>

            <div>
              <Text style={{ marginRight: '8px' }}>加载状态:</Text>
              <BasicSwitch loading defaultChecked />
            </div>

            <div>
              <Text style={{ marginRight: '8px' }}>禁用状态:</Text>
              <BasicSwitch disabled defaultChecked />
            </div>
          </Space>
        </div>
      </DemoWrapper>
    </ConfigProvider>
  );
};

export default BasicSwitchSizeDemo;
