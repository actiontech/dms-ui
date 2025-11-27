import React, { useState } from 'react';
import { BasicDrawer, BasicButton, ConfigProvider } from '@actiontech/dms-kit';
import { Form, Input, Space, message } from 'antd';

/**
 * 表单抽屉
 * - maskClosable={false} 防止误操作丢失数据
 * - destroyOnClose={true} 确保每次打开都是干净状态
 * - footer 自定义底部按钮
 */
const FormDrawerDemo = () => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log('表单提交:', values);
      message.success('提交成功');
      setOpen(false);
      form.resetFields();
    });
  };

  const handleClose = () => {
    setOpen(false);
    form.resetFields();
  };

  return (
    <ConfigProvider>
      <BasicButton type="primary" onClick={() => setOpen(true)}>
        新建用户
      </BasicButton>

      <BasicDrawer
        title="新建用户"
        open={open}
        onClose={handleClose}
        maskClosable={false}
        destroyOnClose
        footer={
          <Space style={{ float: 'right' }}>
            <BasicButton onClick={handleClose}>取消</BasicButton>
            <BasicButton type="primary" onClick={handleSubmit}>
              提交
            </BasicButton>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            label="手机号"
            name="phone"
            rules={[{ required: true, message: '请输入手机号' }]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea rows={4} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </BasicDrawer>
    </ConfigProvider>
  );
};

export default FormDrawerDemo;
