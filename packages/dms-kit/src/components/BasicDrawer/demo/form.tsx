import React, { useState } from 'react';
import { BasicDrawer, BasicButton, ConfigProvider } from '@actiontech/dms-kit';
import { Form, Input, Select, Switch, Space } from 'antd';

const BasicDrawerFormDemo = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
    form.resetFields();
  };

  const onFinish = (values: any) => {
    console.log('Form values:', values);
    setVisible(false);
    form.resetFields();
  };

  return (
    <ConfigProvider>
      <BasicButton type="primary" onClick={showDrawer}>
        表单抽屉
      </BasicButton>

      <BasicDrawer
        title="用户配置"
        placement="right"
        visible={visible}
        size="large"
        onClose={onClose}
        footer={
          <Space>
            <BasicButton onClick={onClose}>取消</BasicButton>
            <BasicButton type="primary" onClick={() => form.submit()}>
              保存
            </BasicButton>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ paddingTop: 16 }}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            name="role"
            label="用户角色"
            rules={[{ required: true, message: '请选择用户角色' }]}
          >
            <Select placeholder="请选择用户角色">
              <Select.Option value="admin">系统管理员</Select.Option>
              <Select.Option value="manager">项目经理</Select.Option>
              <Select.Option value="developer">开发人员</Select.Option>
              <Select.Option value="tester">测试人员</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="department" label="所属部门">
            <Input placeholder="请输入所属部门" />
          </Form.Item>

          <Form.Item name="isActive" label="账户状态" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="description" label="备注">
            <Input.TextArea rows={4} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </BasicDrawer>
    </ConfigProvider>
  );
};

export default BasicDrawerFormDemo;
