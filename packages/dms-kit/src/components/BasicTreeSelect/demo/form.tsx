import React from 'react';
import { BasicTreeSelect, ConfigProvider } from '@actiontech/dms-kit';
import { Form, Button, Card, Space } from 'antd';
import { TreeSelectProps } from 'antd';

const FormTreeSelectDemo = () => {
  const [form] = Form.useForm();

  const treeData: TreeSelectProps['treeData'] = [
    {
      title: '部门管理',
      value: 'dept',
      children: [
        {
          title: '技术部',
          value: 'tech',
          children: [
            {
              title: '前端组',
              value: 'frontend'
            },
            {
              title: '后端组',
              value: 'backend'
            },
            {
              title: '测试组',
              value: 'qa'
            }
          ]
        },
        {
          title: '产品部',
          value: 'product',
          children: [
            {
              title: '产品设计',
              value: 'design'
            },
            {
              title: '产品运营',
              value: 'operation'
            }
          ]
        }
      ]
    }
  ];

  const onFinish = (values: any) => {
    console.log('表单提交:', values);
    alert(`选择的部门: ${values.department}`);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <ConfigProvider>
      <Card title="部门选择表单" style={{ width: '100%' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ department: undefined }}
        >
          <Form.Item
            label="选择部门"
            name="department"
            rules={[{ required: true, message: '请选择部门!' }]}
          >
            <BasicTreeSelect
              placeholder="请选择部门"
              treeData={treeData}
              treeDefaultExpandAll
              allowClear
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

export default FormTreeSelectDemo;

