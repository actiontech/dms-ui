import React from 'react';
import { ConfigProvider } from '@actiontech/dms-kit';
import { Form, Input, Button, Card, Space } from 'antd';
import {
  FormItemBigTitle,
  FormItemSubTitle,
  FormItemLabel,
  FormItemNoLabel,
  FormInputBotBorder,
  CustomLabelContent
} from '@actiontech/dms-kit';

const BasicDemo: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('表单数据:', values);
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>基础用法</h3>

        <Card title="表单标题组件" style={{ marginBottom: '16px' }}>
          <FormItemBigTitle>用户信息表单</FormItemBigTitle>
          <FormItemSubTitle>基本信息</FormItemSubTitle>
          <p style={{ color: '#666', marginBottom: '16px' }}>
            使用 FormItemBigTitle 和 FormItemSubTitle 来组织表单结构
          </p>
        </Card>

        <Card title="标准表单项" style={{ marginBottom: '16px' }}>
          <Form form={form} onFinish={onFinish} layout="vertical">
            <FormItemLabel
              label="用户名"
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="请输入用户名" />
            </FormItemLabel>

            <FormItemLabel
              label="邮箱"
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input placeholder="请输入邮箱" />
            </FormItemLabel>

            <FormItemLabel
              label="手机号"
              name="phone"
              rules={[{ required: true, message: '请输入手机号' }]}
            >
              <Input placeholder="请输入手机号" />
            </FormItemLabel>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card title="无标签表单项" style={{ marginBottom: '16px' }}>
          <Form form={form} onFinish={onFinish} layout="vertical">
            <FormItemNoLabel name="description">
              <Input.TextArea placeholder="请输入描述信息（无标签）" rows={3} />
            </FormItemNoLabel>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card title="底部边框输入框" style={{ marginBottom: '16px' }}>
          <Form form={form} onFinish={onFinish} layout="vertical">
            <FormItemLabel label="备注" name="remark">
              <FormInputBotBorder placeholder="使用底部边框样式的输入框" />
            </FormItemLabel>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card title="自定义标签内容" style={{ marginBottom: '16px' }}>
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item
              label={
                <CustomLabelContent
                  title="数据库配置"
                  tips="请输入数据库连接信息，包括主机地址、端口、用户名和密码"
                />
              }
              name="databaseConfig"
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Input placeholder="数据库主机地址" />
                <Input placeholder="数据库端口" />
                <Input placeholder="数据库用户名" />
                <Input.Password placeholder="数据库密码" />
              </Space>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card title="组件组合使用" style={{ marginBottom: '16px' }}>
          <Form form={form} onFinish={onFinish} layout="vertical">
            <FormItemBigTitle>系统配置</FormItemBigTitle>

            <FormItemSubTitle>基础配置</FormItemSubTitle>
            <FormItemLabel label="系统名称" name="systemName">
              <Input placeholder="请输入系统名称" />
            </FormItemLabel>

            <FormItemSubTitle>高级配置</FormItemSubTitle>
            <Form.Item
              label={
                <CustomLabelContent title="缓存设置" tips="配置系统缓存参数" />
              }
              name="cacheConfig"
            >
              <FormInputBotBorder placeholder="缓存过期时间（秒）" />
            </Form.Item>

            <FormItemNoLabel name="advancedConfig">
              <Input.TextArea placeholder="高级配置（JSON格式）" rows={4} />
            </FormItemNoLabel>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  保存配置
                </Button>
                <Button onClick={() => form.resetFields()}>重置</Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default BasicDemo;
