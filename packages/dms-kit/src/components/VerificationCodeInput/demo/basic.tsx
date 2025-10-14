import React from 'react';
import { ConfigProvider } from '@actiontech/dms-kit';
import { VerificationCodeInput } from '@actiontech/dms-kit';
import { message } from 'antd';

const BasicDemo: React.FC = () => {
  const handleSendCode = async () => {
    // 模拟发送验证码的 API 调用
    return new Promise((resolve) => {
      setTimeout(() => {
        message.success('验证码已发送到您的手机');
        resolve({} as any);
      }, 1000);
    }) as any;
  };

  return (
    <ConfigProvider>
      <div style={{ width: '400px' }}>
        <h4>基础用法</h4>
        <p>点击发送验证码按钮，组件会自动处理倒计时和状态管理。</p>

        <VerificationCodeInput
          onSendCode={handleSendCode}
          placeholder="请输入验证码"
        />

        <div style={{ marginTop: '16px' }}>
          <p>
            <strong>功能特性：</strong>
          </p>
          <ul>
            <li>自动倒计时 60 秒</li>
            <li>发送期间显示 loading 状态</li>
            <li>倒计时期间按钮禁用</li>
            <li>支持自定义 placeholder</li>
          </ul>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default BasicDemo;
