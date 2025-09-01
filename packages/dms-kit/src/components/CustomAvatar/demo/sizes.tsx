import React from 'react';
import { Space, Card, Divider } from 'antd';
import { CustomAvatar, ConfigProvider } from '@actiontech/dms-kit';

const SizesDemo: React.FC = () => {
  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>头像尺寸</h3>

        <Card title="预设尺寸" style={{ marginBottom: '20px' }}>
          <Space size="large" align="center">
            <div>
              <CustomAvatar name="张三" size="large" />
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '8px',
                  fontSize: '12px'
                }}
              >
                large (40px)
              </div>
            </div>
            <div>
              <CustomAvatar name="李四" size="default" />
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '8px',
                  fontSize: '12px'
                }}
              >
                default (32px)
              </div>
            </div>
            <div>
              <CustomAvatar name="王五" size="small" />
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '8px',
                  fontSize: '12px'
                }}
              >
                small (24px)
              </div>
            </div>
          </Space>
        </Card>

        <Card title="自定义尺寸" style={{ marginBottom: '20px' }}>
          <Space size="large" align="center">
            <div>
              <CustomAvatar name="张三" size={64} />
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '8px',
                  fontSize: '12px'
                }}
              >
                64px
              </div>
            </div>
            <div>
              <CustomAvatar name="李四" size={80} />
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '8px',
                  fontSize: '12px'
                }}
              >
                80px
              </div>
            </div>
            <div>
              <CustomAvatar name="王五" size={100} />
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '8px',
                  fontSize: '12px'
                }}
              >
                100px
              </div>
            </div>
            <div>
              <CustomAvatar name="赵六" size={120} />
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '8px',
                  fontSize: '12px'
                }}
              >
                120px
              </div>
            </div>
          </Space>
        </Card>

        <Card title="图片头像尺寸对比">
          <Space size="large" align="center">
            <div>
              <CustomAvatar
                src="https://avatars.githubusercontent.com/u/623663?v=4"
                name="用户A"
                size="large"
              />
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '8px',
                  fontSize: '12px'
                }}
              >
                large (40px)
              </div>
            </div>
            <div>
              <CustomAvatar
                src="https://avatars.githubusercontent.com/u/623663?v=4"
                name="用户B"
                size="default"
              />
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '8px',
                  fontSize: '12px'
                }}
              >
                default (32px)
              </div>
            </div>
            <div>
              <CustomAvatar
                src="https://avatars.githubusercontent.com/u/623663?v=4"
                name="用户C"
                size="small"
              />
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '8px',
                  fontSize: '12px'
                }}
              >
                small (24px)
              </div>
            </div>
            <div>
              <CustomAvatar
                src="https://avatars.githubusercontent.com/u/623663?v=4"
                name="用户D"
                size={64}
              />
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '8px',
                  fontSize: '12px'
                }}
              >
                64px
              </div>
            </div>
          </Space>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default SizesDemo;
