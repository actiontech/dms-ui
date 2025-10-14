import React from 'react';
import { Space, Card } from 'antd';
import { CustomAvatar, ConfigProvider } from '@actiontech/dms-kit';

const BasicDemo: React.FC = () => {
  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>基础用法</h3>

        <Card title="文字头像" style={{ marginBottom: '20px' }}>
          <Space size="large">
            <div>
              <CustomAvatar name="张三" size="large" />
              <div style={{ textAlign: 'center', marginTop: '8px' }}>张三</div>
            </div>
            <div>
              <CustomAvatar name="李四" />
              <div style={{ textAlign: 'center', marginTop: '8px' }}>李四</div>
            </div>
            <div>
              <CustomAvatar name="王五" size="small" />
              <div style={{ textAlign: 'center', marginTop: '8px' }}>王五</div>
            </div>
          </Space>
        </Card>

        <Card title="图片头像" style={{ marginBottom: '20px' }}>
          <Space size="large">
            <div>
              <CustomAvatar
                src="https://avatars.githubusercontent.com/u/623663?v=4"
                name="用户A"
                size="large"
              />
              <div style={{ textAlign: 'center', marginTop: '8px' }}>用户A</div>
            </div>
            <div>
              <CustomAvatar
                src="https://avatars.githubusercontent.com/u/17185?v=4"
                name="用户B"
              />
              <div style={{ textAlign: 'center', marginTop: '8px' }}>用户B</div>
            </div>
            <div>
              <CustomAvatar
                src="https://avatars.githubusercontent.com/u/69631?v=4"
                name="用户C"
                size="small"
              />
              <div style={{ textAlign: 'center', marginTop: '8px' }}>用户C</div>
            </div>
          </Space>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default BasicDemo;
