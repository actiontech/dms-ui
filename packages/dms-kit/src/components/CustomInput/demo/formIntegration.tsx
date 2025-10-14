import React, { useState } from 'react';
import { CustomInput, ConfigProvider } from '@actiontech/dms-kit';
import { message, Form, Button, Card, Space, Divider } from 'antd';

interface FormData {
  username: string;
  email: string;
  project: string;
  database: string;
  sql: string;
}

const FormIntegrationDemo: React.FC = () => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    project: '',
    database: '',
    sql: ''
  });

  const handleUsernameEnter = (value: string) => {
    form.setFieldsValue({ username: value });
    setFormData(prev => ({ ...prev, username: value }));
    message.success(`用户名已设置: ${value}`);
  };

  const handleEmailEnter = (value: string) => {
    form.setFieldsValue({ email: value });
    setFormData(prev => ({ ...prev, email: value }));
    message.success(`邮箱已设置: ${value}`);
  };

  const handleProjectEnter = (value: string) => {
    form.setFieldsValue({ project: value });
    setFormData(prev => ({ ...prev, project: value }));
    message.success(`项目已设置: ${value}`);
  };

  const handleDatabaseEnter = (value: string) => {
    form.setFieldsValue({ database: value });
    setFormData(prev => ({ ...prev, database: value }));
    message.success(`数据库已设置: ${value}`);
  };

  const handleSqlEnter = (value: string) => {
    form.setFieldsValue({ sql: value });
    setFormData(prev => ({ ...prev, sql: value }));
    message.success(`SQL已设置: ${value}`);
  };

  const onFinish = (values: FormData) => {
    message.success('表单提交成功！');
    console.log('表单数据:', values);
  };

  const resetForm = () => {
    form.resetFields();
    setFormData({
      username: '',
      email: '',
      project: '',
      database: '',
      sql: ''
    });
    message.info('表单已重置');
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>表单集成示例</h3>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          在表单中使用 CustomInput 组件，支持回车键快速提交单个字段
        </p>

        <Card title="用户信息表单" style={{ marginBottom: '20px' }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={formData}
          >
            <Form.Item
              label="用户名"
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <CustomInput
                prefix="👤"
                placeholder="输入用户名后按回车确认"
                onCustomPressEnter={handleUsernameEnter}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <CustomInput
                prefix="📧"
                placeholder="输入邮箱后按回车确认"
                onCustomPressEnter={handleEmailEnter}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              label="项目名称"
              name="project"
              rules={[{ required: true, message: '请输入项目名称' }]}
            >
              <CustomInput
                prefix="📁"
                placeholder="输入项目名称后按回车确认"
                onCustomPressEnter={handleProjectEnter}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              label="数据库名称"
              name="database"
              rules={[{ required: true, message: '请输入数据库名称' }]}
            >
              <CustomInput
                prefix="🗄️"
                placeholder="输入数据库名称后按回车确认"
                onCustomPressEnter={handleDatabaseEnter}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              label="SQL语句"
              name="sql"
              rules={[{ required: true, message: '请输入SQL语句' }]}
            >
              <CustomInput
                prefix="SQL"
                placeholder="输入SQL语句后按回车确认"
                onCustomPressEnter={handleSqlEnter}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  提交表单
                </Button>
                <Button onClick={resetForm}>
                  重置表单
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        <Card title="当前表单数据">
          <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
            {JSON.stringify(formData, null, 2)}
          </pre>
        </Card>

        <Divider />

        <Card title="使用说明">
          <ul style={{ paddingLeft: '20px' }}>
            <li>每个输入框都支持回车键快速确认输入</li>
            <li>回车确认后会自动更新表单数据</li>
            <li>表单验证规则仍然有效</li>
            <li>可以结合 Ant Design Form 的所有功能</li>
          </ul>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default FormIntegrationDemo;
