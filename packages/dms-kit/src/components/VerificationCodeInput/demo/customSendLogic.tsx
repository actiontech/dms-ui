import React, { useState } from 'react';
import { Form, Input, Button, Space, message } from 'antd';
import { ConfigProvider, VerificationCodeInput } from '@actiontech/dms-kit';

/**
 * 表单集成
 * - 手机号格式验证
 * - 发送前验证
 * - 错误处理
 * - 表单提交
 */
const CustomSendLogicDemo: React.FC = () => {
  const [form] = Form.useForm();
  const [phone, setPhone] = useState('');

  // 验证手机号格式
  const isValidPhone = (phoneStr: string) => {
    return /^1[3-9]\d{9}$/.test(phoneStr);
  };

  // 模拟发送验证码 API
  const sendVerificationCode = async (phoneStr: string) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.2) {
          resolve({ success: true, message: '验证码已发送' });
        } else {
          reject(new Error('发送失败，请重试'));
        }
      }, 1000);
    });
  };

  const handleSendCode = async () => {
    try {
      // 验证手机号是否已输入
      if (!phone) {
        message.error('请先输入手机号');
        throw new Error('手机号为空');
      }

      // 验证手机号格式
      if (!isValidPhone(phone)) {
        message.error('请输入正确的手机号格式');
        throw new Error('手机号格式错误');
      }

      // 调用发送验证码 API
      await sendVerificationCode(phone);
      message.success('验证码已发送到您的手机');

      return {} as any;
    } catch (error) {
      message.error(error instanceof Error ? error.message : '发送失败');
      throw error;
    }
  };

  const handleSubmit = (values: any) => {
    message.success(
      `表单提交成功！手机号: ${values.phone}, 验证码: ${values.code}`
    );
  };

  return (
    <ConfigProvider>
      <div style={{ width: '500px' }}>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label="手机号"
            name="phone"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式' }
            ]}
          >
            <Input
              placeholder="请输入手机号"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="验证码"
            name="code"
            rules={[
              { required: true, message: '请输入验证码' },
              { len: 6, message: '验证码长度为6位' }
            ]}
          >
            <VerificationCodeInput
              onSendCode={handleSendCode}
              placeholder="请输入6位验证码"
              disabled={!phone || !isValidPhone(phone)}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
              <Button onClick={() => form.resetFields()}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </ConfigProvider>
  );
};

export default CustomSendLogicDemo;
