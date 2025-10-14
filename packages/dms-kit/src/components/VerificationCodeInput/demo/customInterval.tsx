import React from 'react';
import { ConfigProvider } from '@actiontech/dms-kit';
import { Space, Typography } from 'antd';
import { VerificationCodeInput } from '@actiontech/dms-kit';
import { message } from 'antd';

const { Text } = Typography;

const CustomIntervalDemo: React.FC = () => {
  const handleSendCode = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        message.success('验证码已发送');
        resolve({} as any);
      }, 500);
    }) as any;
  };

  return (
    <ConfigProvider>
      <div style={{ width: '600px' }}>
        <h4>自定义倒计时间隔</h4>
        <p>
          通过 <code>interval</code>{' '}
          属性可以自定义倒计时间隔，适用于不同的业务场景。
        </p>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text strong>30 秒倒计时（快速重试）：</Text>
            <div style={{ marginTop: '8px' }}>
              <VerificationCodeInput
                onSendCode={handleSendCode}
                interval={30}
                placeholder="请输入验证码"
              />
            </div>
          </div>

          <div>
            <Text strong>默认 60 秒倒计时：</Text>
            <div style={{ marginTop: '8px' }}>
              <VerificationCodeInput
                onSendCode={handleSendCode}
                placeholder="请输入验证码"
              />
            </div>
          </div>

          <div>
            <Text strong>120 秒倒计时（安全限制）：</Text>
            <div style={{ marginTop: '8px' }}>
              <VerificationCodeInput
                onSendCode={handleSendCode}
                interval={120}
                placeholder="请输入验证码"
              />
            </div>
          </div>
        </Space>

        <div style={{ marginTop: '24px' }}>
          <p>
            <strong>使用场景：</strong>
          </p>
          <ul>
            <li>
              <strong>30 秒</strong>：适用于测试环境或对安全性要求不高的场景
            </li>
            <li>
              <strong>60 秒</strong>：适用于大多数生产环境，平衡用户体验和安全性
            </li>
            <li>
              <strong>120 秒</strong>：适用于对安全性要求较高的场景，如支付验证
            </li>
          </ul>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default CustomIntervalDemo;
