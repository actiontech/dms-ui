import React from 'react';
import { BasicTag } from '@actiontech/dms-kit';
import { ConfigProvider } from '@actiontech/dms-kit';
import { Space, Typography } from 'antd';

const { Text } = Typography;

const BasicTagSizeDemo = () => {
  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <Space direction="vertical" size="large">
          <div>
            <Text>小尺寸:</Text>
            <Space size={[0, 8]}>
              <BasicTag size="small" color="blue">
                小标签
              </BasicTag>
              <BasicTag size="small" color="green">
                小标签
              </BasicTag>
            </Space>
          </div>

          <div>
            <Text>默认尺寸:</Text>
            <Space size={[0, 8]}>
              <BasicTag color="blue">默认标签</BasicTag>
              <BasicTag color="green">默认标签</BasicTag>
            </Space>
          </div>

          <div>
            <Text>大尺寸:</Text>
            <Space size={[0, 8]}>
              <BasicTag size="large" color="blue">
                大标签
              </BasicTag>
              <BasicTag size="large" color="green">
                大标签
              </BasicTag>
            </Space>
          </div>
        </Space>
      </div>
    </ConfigProvider>
  );
};

export default BasicTagSizeDemo;
