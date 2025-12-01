import React, { useState } from 'react';
import { BasicModal, BasicButton, ConfigProvider } from '@actiontech/dms-kit';
import { Form, Input, Select, message } from 'antd';

/**
 * 表单弹窗
 * - 表单验证和提交
 * - 关闭时销毁表单数据
 * - 提交状态展示
 */
const BasicModalFormDemo = () => {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      setConfirmLoading(true);
      // 模拟提交操作
      setTimeout(() => {
        console.log('Form values:', values);
        message.success('保存成功');
        setConfirmLoading(false);
        setVisible(false);
        form.resetFields();
      }, 1500);
    });
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  return (
    <ConfigProvider>
      <BasicButton type="primary" onClick={showModal}>
        打开表单弹窗
      </BasicButton>

      <BasicModal
        title="用户信息编辑"
        open={visible}
        size="large"
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
        destroyOnClose
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
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
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              <Select.Option value="admin">管理员</Select.Option>
              <Select.Option value="user">普通用户</Select.Option>
              <Select.Option value="guest">访客</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="个人简介">
            <Input.TextArea rows={4} placeholder="请输入个人简介" />
          </Form.Item>
        </Form>
      </BasicModal>
    </ConfigProvider>
  );
};

export default BasicModalFormDemo;
