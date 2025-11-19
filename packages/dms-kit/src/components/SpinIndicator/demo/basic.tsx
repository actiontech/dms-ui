import React from 'react';
import { Space, Divider } from 'antd';
import { SpinIndicator, ConfigProvider } from '@actiontech/dms-kit';
import { styled } from '@mui/material';

/**
 * 基础用法
 * - 默认尺寸和不同颜色
 * - 自定义尺寸
 */

// 覆盖默认的绝对定位
const DemoWrapper = styled('div')`
  .custom-icon-spin-dot {
    position: static !important;
    margin: 0 !important;
  }
`;

const BasicDemo: React.FC = () => {
  return (
    <ConfigProvider>
      <DemoWrapper>
        默认
        <div style={{ marginBottom: '24px' }}>
          <SpinIndicator />
        </div>
        <Divider />
        不同颜色
        <div style={{ marginBottom: '24px' }}>
          <Space size="large" align="center">
            <div style={{ color: '#1890ff' }}>
              <SpinIndicator />
            </div>
            <div style={{ color: '#52c41a' }}>
              <SpinIndicator />
            </div>
            <div style={{ color: '#fa8c16' }}>
              <SpinIndicator />
            </div>
            <div style={{ color: '#f5222d' }}>
              <SpinIndicator />
            </div>
          </Space>
        </div>
        <Divider />
      </DemoWrapper>
    </ConfigProvider>
  );
};

export default BasicDemo;
