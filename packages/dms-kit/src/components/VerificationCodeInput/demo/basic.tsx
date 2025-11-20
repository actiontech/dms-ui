import React from 'react';
import { ConfigProvider, VerificationCodeInput } from '@actiontech/dms-kit';
import { Space, Divider, message } from 'antd';

/**
 * 基础用法
 * - 默认倒计时 60 秒
 * - 自定义倒计时间隔
 * - 自动状态管理
 */
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
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* 默认 60 秒倒计时 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>
          默认 60 秒倒计时：
        </div>
        <div style={{ width: '400px' }}>
          <VerificationCodeInput
            onSendCode={handleSendCode}
            placeholder="请输入验证码"
          />
        </div>

        <Divider />

        {/* 30 秒倒计时 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>
          30 秒倒计时（快速重试）：
        </div>
        <div style={{ width: '400px' }}>
          <VerificationCodeInput
            onSendCode={handleSendCode}
            interval={30}
            placeholder="请输入验证码"
          />
        </div>

        <Divider />

        {/* 120 秒倒计时 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>
          120 秒倒计时（安全限制）：
        </div>
        <div style={{ width: '400px' }}>
          <VerificationCodeInput
            onSendCode={handleSendCode}
            interval={120}
            placeholder="请输入验证码"
          />
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default BasicDemo;
