import React from 'react';
import { BasicToolTip } from '@actiontech/dms-kit';
import { ConfigProvider } from '@actiontech/dms-kit';
import { Form, Input, Button, Space } from 'antd';
import { QuestionCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

const BasicToolTipFormDemo = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('表单数据:', values);
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px', maxWidth: '500px' }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label={
              <Space>
                用户名
                <BasicToolTip
                  title="用户名用于登录系统，建议使用字母、数字和下划线的组合"
                  prefixIcon={<QuestionCircleOutlined />}
                >
                  <QuestionCircleOutlined
                    style={{ color: '#999', cursor: 'pointer' }}
                  />
                </BasicToolTip>
              </Space>
            }
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            label={
              <Space>
                邮箱地址
                <BasicToolTip
                  title="邮箱地址用于接收系统通知和找回密码，请确保邮箱地址正确"
                  prefixIcon={<InfoCircleOutlined />}
                >
                  <InfoCircleOutlined
                    style={{ color: '#999', cursor: 'pointer' }}
                  />
                </BasicToolTip>
              </Space>
            }
            name="email"
            rules={[
              { required: true, message: '请输入邮箱地址' },
              { type: 'email', message: '请输入正确的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱地址" />
          </Form.Item>

          <Form.Item
            label={
              <Space>
                密码
                <BasicToolTip
                  title="密码长度至少8位，建议包含大小写字母、数字和特殊字符"
                  prefixIcon={<QuestionCircleOutlined />}
                >
                  <QuestionCircleOutlined
                    style={{ color: '#999', cursor: 'pointer' }}
                  />
                </BasicToolTip>
              </Space>
            }
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 8, message: '密码长度至少8位' }
            ]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    </ConfigProvider>
  );
};

export default BasicToolTipFormDemo;
