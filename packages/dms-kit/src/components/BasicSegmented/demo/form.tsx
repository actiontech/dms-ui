import React from 'react';
import { BasicSegmented, ConfigProvider } from '@actiontech/dms-kit';
import { Form, Button, Card, Space, Input, Select } from 'antd';

const FormSegmentedDemo = () => {
  const [form] = Form.useForm();

  const viewOptions = [
    {
      label: '列表视图',
      value: 'list'
    },
    {
      label: '卡片视图',
      value: 'card'
    },
    {
      label: '表格视图',
      value: 'table'
    }
  ];

  const onFinish = (values: any) => {
    console.log('表单提交:', values);
    alert(`表单数据: ${JSON.stringify(values, null, 2)}`);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <ConfigProvider>
      <Card title="视图配置表单" style={{ width: '100%' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            viewType: 'list',
            name: '',
            category: 'all'
          }}
        >
          <Form.Item
            label="视图类型"
            name="viewType"
            rules={[{ required: true, message: '请选择视图类型!' }]}
          >
            <BasicSegmented options={viewOptions} block />
          </Form.Item>

          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: '请输入名称!' }]}
          >
            <Input placeholder="请输入名称" />
          </Form.Item>

          <Form.Item
            label="分类"
            name="category"
            rules={[{ required: true, message: '请选择分类!' }]}
          >
            <Select
              placeholder="请选择分类"
              options={[
                { label: '全部', value: 'all' },
                { label: '技术', value: 'tech' },
                { label: '产品', value: 'product' },
                { label: '设计', value: 'design' }
              ]}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
              <Button onClick={onReset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </ConfigProvider>
  );
};

export default FormSegmentedDemo;

