import React from 'react';
import { ConfigProvider } from '@actiontech/dms-kit';
import {
  FormItemLabel,
  FormItemNoLabel,
  FormInputBotBorder,
  CustomLabelContent
} from '@actiontech/dms-kit';
import {
  Form,
  Input,
  Button,
  Card,
  Space,
  Select,
  Switch,
  DatePicker
} from 'antd';

const FormFieldsDemo: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('表单数据:', values);
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>表单字段组件</h3>

        <Card
          title="FormItemLabel - 标准标签表单项"
          style={{ marginBottom: '16px' }}
        >
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
              label="用户类型"
              name="userType"
              rules={[{ required: true, message: '请选择用户类型' }]}
            >
              <Select
                placeholder="请选择用户类型"
                options={[
                  { label: '普通用户', value: 'normal' },
                  { label: 'VIP用户', value: 'vip' },
                  { label: '管理员', value: 'admin' }
                ]}
              />
            </FormItemLabel>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card
          title="FormItemNoLabel - 无标签表单项"
          style={{ marginBottom: '16px' }}
        >
          <Form form={form} onFinish={onFinish} layout="vertical">
            <FormItemNoLabel name="description">
              <Input.TextArea placeholder="请输入描述信息（无标签）" rows={3} />
            </FormItemNoLabel>

            <FormItemNoLabel name="notes">
              <Input.TextArea placeholder="请输入备注信息（无标签）" rows={2} />
            </FormItemNoLabel>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card
          title="FormInputBotBorder - 底部边框输入框"
          style={{ marginBottom: '16px' }}
        >
          <Form form={form} onFinish={onFinish} layout="vertical">
            <FormItemLabel label="备注" name="remark">
              <FormInputBotBorder placeholder="使用底部边框样式的输入框" />
            </FormItemLabel>

            <FormItemLabel label="说明" name="explanation">
              <FormInputBotBorder placeholder="另一个底部边框样式的输入框" />
            </FormItemLabel>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card
          title="CustomLabelContent - 自定义标签内容"
          style={{ marginBottom: '16px' }}
        >
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

            <Form.Item
              label={
                <CustomLabelContent
                  title="系统设置"
                  tips="配置系统的基本参数和功能开关"
                />
              }
              name="systemSettings"
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <span style={{ marginRight: '8px' }}>启用通知:</span>
                  <Switch defaultChecked />
                </div>
                <div>
                  <span style={{ marginRight: '8px' }}>系统日期:</span>
                  <DatePicker />
                </div>
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
            <FormItemLabel
              label="项目名称"
              name="projectName"
              rules={[{ required: true }]}
            >
              <Input placeholder="请输入项目名称" />
            </FormItemLabel>

            <FormItemLabel label="项目描述" name="projectDescription">
              <Input.TextArea placeholder="请输入项目描述" rows={3} />
            </FormItemLabel>

            <FormItemNoLabel name="internalNotes">
              <Input.TextArea placeholder="内部备注（无标签）" rows={2} />
            </FormItemNoLabel>

            <Form.Item
              label={
                <CustomLabelContent
                  title="高级配置"
                  tips="配置项目的特殊参数和选项"
                />
              }
              name="advancedConfig"
            >
              <FormInputBotBorder placeholder="高级配置参数" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  保存项目
                </Button>
                <Button onClick={() => form.resetFields()}>重置</Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        <Card title="使用说明">
          <ul style={{ paddingLeft: '20px' }}>
            <li>
              <strong>FormItemLabel</strong>: 标准表单项，包含标签和验证规则
            </li>
            <li>
              <strong>FormItemNoLabel</strong>: 无标签表单项，适合紧凑布局
            </li>
            <li>
              <strong>FormInputBotBorder</strong>:
              特殊样式的输入框，只有底部边框
            </li>
            <li>
              <strong>CustomLabelContent</strong>:
              自定义标签内容，支持标题和提示
            </li>
            <li>所有组件都支持 Ant Design Form 的验证规则</li>
            <li>可以组合使用创建复杂的表单布局</li>
          </ul>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default FormFieldsDemo;
