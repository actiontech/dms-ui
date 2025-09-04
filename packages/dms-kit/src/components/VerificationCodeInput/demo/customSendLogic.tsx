import React, { useState } from 'react';
import { Form, Input, Button, Space, message, Typography } from 'antd';
import { ConfigProvider, VerificationCodeInput } from '@actiontech/dms-kit';

const { Text } = Typography;

const CustomSendLogicDemo: React.FC = () => {
  const [form] = Form.useForm();
  const [phone, setPhone] = useState('');

  // 模拟验证手机号格式
  const isValidPhone = (phoneStr: string) => {
    return /^1[3-9]\d{9}$/.test(phoneStr);
  };

  // 模拟发送验证码 API
  const sendVerificationCode = async (phoneStr: string) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.2) {
          // 80% 成功率
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
        return;
      }

      // 验证手机号格式
      if (!isValidPhone(phone)) {
        message.error('请输入正确的手机号格式');
        return;
      }

      // 调用发送验证码 API
      const response = await sendVerificationCode(phone);
      message.success('验证码已发送到您的手机');

      return response as any;
    } catch (error) {
      message.error(error instanceof Error ? error.message : '发送失败');
      throw error; // 重新抛出错误，让组件处理
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
        <h4>自定义发送逻辑</h4>
        <p>
          在 <code>onSendCode</code>{' '}
          回调中添加业务逻辑，如手机号验证、格式检查等。
        </p>

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

        <div style={{ marginTop: '24px' }}>
          <p>
            <strong>功能特性：</strong>
          </p>
          <ul>
            <li>手机号格式验证</li>
            <li>验证码输入框在手机号无效时禁用</li>
            <li>完整的错误处理和用户提示</li>
            <li>表单验证和提交</li>
            <li>模拟 API 调用的成功/失败场景</li>
          </ul>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default CustomSendLogicDemo;
