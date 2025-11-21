import React from 'react';
import { BasicSwitch, ConfigProvider } from '@actiontech/dms-kit';
import { Form, Button, message } from 'antd';
import DemoWrapper from './DemoWrapper';

/**
 * 表单集成
 * - 在 Form 中使用必须设置 valuePropName="checked"
 * - 支持表单验证和提交
 */
const BasicSwitchFormDemo = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('表单数据:', values);
    message.success('设置已保存');
  };

  return (
    <ConfigProvider>
      <DemoWrapper>
        <div style={{ padding: '20px', maxWidth: '400px' }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              notifications: true,
              autoSave: false,
              darkMode: true
            }}
          >
            <Form.Item
              name="notifications"
              label="接收通知"
              valuePropName="checked"
            >
              <BasicSwitch />
            </Form.Item>

            <Form.Item name="autoSave" label="自动保存" valuePropName="checked">
              <BasicSwitch />
            </Form.Item>

            <Form.Item name="darkMode" label="深色模式" valuePropName="checked">
              <BasicSwitch />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                保存设置
              </Button>
            </Form.Item>
          </Form>
        </div>
      </DemoWrapper>
    </ConfigProvider>
  );
};

export default BasicSwitchFormDemo;
