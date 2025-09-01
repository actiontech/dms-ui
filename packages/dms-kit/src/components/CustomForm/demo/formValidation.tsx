import React from 'react';
import { ConfigProvider } from '@actiontech/dms-kit';
import {
  FormItemBigTitle,
  FormItemSubTitle,
  FormItemLabel,
  FormItemNoLabel,
  CustomLabelContent
} from '@actiontech/dms-kit';
import {
  Form,
  Input,
  Button,
  Card,
  Space,
  Select,
  InputNumber,
  message,
  Divider
} from 'antd';

const FormValidationDemo: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    message.success('表单验证通过！数据：' + JSON.stringify(values, null, 2));
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error('表单验证失败！请检查输入内容。');
    console.log('验证失败:', errorInfo);
  };

  const validatePassword = async (_: any, value: string) => {
    if (!value) {
      throw new Error('请输入密码');
    }
    if (value.length < 6) {
      throw new Error('密码长度不能少于6位');
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
      throw new Error('密码必须包含大小写字母和数字');
    }
  };

  const validateConfirmPassword = async (_: any, value: string) => {
    if (!value) {
      throw new Error('请确认密码');
    }
    const password = form.getFieldValue('password');
    if (value !== password) {
      throw new Error('两次输入的密码不一致');
    }
  };

  const validatePhone = async (_: any, value: string) => {
    if (!value) {
      throw new Error('请输入手机号');
    }
    if (!/^1[3-9]\d{9}$/.test(value)) {
      throw new Error('请输入有效的手机号');
    }
  };

  const validateIdCard = async (_: any, value: string) => {
    if (!value) {
      throw new Error('请输入身份证号');
    }
    if (!/^\d{17}[\dXx]$/.test(value)) {
      throw new Error('请输入有效的身份证号');
    }
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>表单验证示例</h3>

        <Card title="用户注册表单（完整验证）" style={{ marginBottom: '20px' }}>
          <Form
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
            scrollToFirstError
          >
            <FormItemBigTitle>用户注册</FormItemBigTitle>

            <FormItemSubTitle>基本信息</FormItemSubTitle>
            <FormItemLabel
              label="用户名"
              name="username"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, max: 20, message: '用户名长度必须在3-20位之间' },
                {
                  pattern: /^[a-zA-Z0-9_]+$/,
                  message: '用户名只能包含字母、数字和下划线'
                }
              ]}
              hasFeedback
            >
              <Input placeholder="请输入用户名（3-20位，只能包含字母、数字和下划线）" />
            </FormItemLabel>

            <FormItemLabel
              label="邮箱"
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
              hasFeedback
            >
              <Input placeholder="请输入邮箱地址" />
            </FormItemLabel>

            <FormItemLabel
              label="手机号"
              name="phone"
              rules={[
                { required: true, message: '请输入手机号' },
                { validator: validatePhone }
              ]}
              hasFeedback
            >
              <Input placeholder="请输入手机号" />
            </FormItemLabel>

            <FormItemLabel
              label="身份证号"
              name="idCard"
              rules={[
                { required: true, message: '请输入身份证号' },
                { validator: validateIdCard }
              ]}
              hasFeedback
            >
              <Input placeholder="请输入身份证号" />
            </FormItemLabel>

            <Divider />

            <FormItemSubTitle>安全设置</FormItemSubTitle>
            <FormItemLabel
              label="密码"
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { validator: validatePassword }
              ]}
              hasFeedback
            >
              <Input.Password placeholder="请输入密码（至少6位，包含大小写字母和数字）" />
            </FormItemLabel>

            <FormItemLabel
              label="确认密码"
              name="confirmPassword"
              rules={[
                { required: true, message: '请确认密码' },
                { validator: validateConfirmPassword }
              ]}
              hasFeedback
            >
              <Input.Password placeholder="请再次输入密码" />
            </FormItemLabel>

            <Divider />

            <FormItemSubTitle>其他信息</FormItemSubTitle>
            <FormItemLabel
              label="年龄"
              name="age"
              rules={[
                { required: true, message: '请输入年龄' },
                {
                  type: 'number',
                  min: 1,
                  max: 120,
                  message: '年龄必须在1-120之间'
                }
              ]}
              hasFeedback
            >
              <InputNumber
                placeholder="请输入年龄"
                min={1}
                max={120}
                style={{ width: '100%' }}
              />
            </FormItemLabel>

            <FormItemLabel
              label="用户类型"
              name="userType"
              rules={[{ required: true, message: '请选择用户类型' }]}
              hasFeedback
            >
              <Select
                placeholder="请选择用户类型"
                options={[
                  { label: '普通用户', value: 'normal' },
                  { label: 'VIP用户', value: 'vip' },
                  { label: '企业用户', value: 'enterprise' }
                ]}
              />
            </FormItemLabel>

            <Form.Item
              label={
                <CustomLabelContent
                  title="地址信息"
                  tips="请输入详细的地址信息"
                />
              }
              name="address"
              rules={[
                { required: true, message: '请输入地址信息' },
                { min: 10, message: '地址信息至少10个字符' }
              ]}
              hasFeedback
            >
              <Input.TextArea
                placeholder="请输入详细地址（至少10个字符）"
                rows={3}
              />
            </Form.Item>

            <FormItemNoLabel name="agreement">
              <div style={{ marginBottom: '16px' }}>
                <input type="checkbox" id="agreement" required />
                <label htmlFor="agreement" style={{ marginLeft: '8px' }}>
                  我已阅读并同意《用户协议》和《隐私政策》
                </label>
              </div>
            </FormItemNoLabel>

            <Form.Item>
              <Space size="large">
                <Button type="primary" htmlType="submit" size="large">
                  提交注册
                </Button>
                <Button size="large" onClick={() => form.resetFields()}>
                  重置表单
                </Button>
                <Button size="large" onClick={() => form.validateFields()}>
                  验证表单
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        <Card title="验证规则说明">
          <ul style={{ paddingLeft: '20px' }}>
            <li>
              <strong>必填验证</strong>: 使用 required: true 确保字段不为空
            </li>
            <li>
              <strong>长度验证</strong>: 使用 min 和 max 限制字符串长度
            </li>
            <li>
              <strong>格式验证</strong>: 使用 pattern 进行正则表达式验证
            </li>
            <li>
              <strong>类型验证</strong>: 使用 type 验证邮箱、数字等类型
            </li>
            <li>
              <strong>自定义验证</strong>: 使用 validator 函数进行复杂验证
            </li>
            <li>
              <strong>关联验证</strong>: 验证密码确认等关联字段
            </li>
            <li>
              <strong>实时反馈</strong>: 使用 hasFeedback 显示验证状态图标
            </li>
          </ul>
        </Card>

        <Card title="验证特性">
          <ul style={{ paddingLeft: '20px' }}>
            <li>
              <strong>滚动到错误</strong>: 使用 scrollToFirstError
              自动滚动到第一个错误字段
            </li>
            <li>
              <strong>验证状态</strong>: 支持
              success、warning、error、validating 等状态
            </li>
            <li>
              <strong>错误提示</strong>: 自动显示验证错误信息
            </li>
            <li>
              <strong>表单重置</strong>: 支持一键重置所有字段和验证状态
            </li>
            <li>
              <strong>手动验证</strong>: 可以手动触发表单验证
            </li>
          </ul>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default FormValidationDemo;
