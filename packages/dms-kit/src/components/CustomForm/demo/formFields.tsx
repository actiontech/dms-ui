import React from 'react';
import { ConfigProvider } from '@actiontech/dms-kit';
import {
  FormItemLabel,
  FormItemNoLabel,
  FormInputBotBorder,
  CustomLabelContent
} from '@actiontech/dms-kit';
import { Form, Input, Button, Space, Divider } from 'antd';

/**
 * 表单字段
 * - FormItemLabel：标准表单项（带标签）
 * - FormItemNoLabel：无标签表单项
 * - FormInputBotBorder：底部边框输入框
 * - CustomLabelContent：自定义标签内容
 */
const FormFieldsDemo: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('表单数据:', values);
  };

  return (
    <ConfigProvider>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Space direction="vertical" style={{ width: '100%' }}>
          {/* 标准表单项 */}
          <div style={{ color: '#666', marginBottom: '8px' }}>
            FormItemLabel（标准表单项）：
          </div>
          <FormItemLabel
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" style={{ width: '300px' }} />
          </FormItemLabel>

          <Divider />

          {/* 无标签表单项 */}
          <div style={{ color: '#666', marginBottom: '8px' }}>
            FormItemNoLabel（无标签表单项）：
          </div>
          <FormItemNoLabel name="description">
            <Input.TextArea
              placeholder="请输入描述信息（无标签）"
              rows={3}
              style={{ width: '300px' }}
            />
          </FormItemNoLabel>

          <Divider />

          {/* 底部边框输入框 */}
          <div style={{ color: '#666', marginBottom: '8px' }}>
            FormInputBotBorder（底部边框输入框）：
          </div>
          <FormItemLabel label="备注" name="remark">
            <FormInputBotBorder placeholder="使用底部边框样式的输入框" />
          </FormItemLabel>

          <Divider />

          {/* 自定义标签内容 */}
          <div style={{ color: '#666', marginBottom: '8px' }}>
            CustomLabelContent（自定义标签内容）：
          </div>
          <Form.Item
            label={
              <CustomLabelContent
                title="数据库配置"
                tips="请输入数据库连接信息，包括主机地址、端口等"
              />
            }
            name="databaseConfig"
          >
            <Space direction="vertical" style={{ width: '300px' }}>
              <Input placeholder="数据库主机地址" />
              <Input placeholder="数据库端口" />
              <Input placeholder="数据库用户名" />
            </Space>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
              <Button onClick={() => form.resetFields()}>重置</Button>
            </Space>
          </Form.Item>
        </Space>
      </Form>
    </ConfigProvider>
  );
};

export default FormFieldsDemo;
