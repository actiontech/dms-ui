import React from 'react';
import { CustomSelect, ConfigProvider } from '@actiontech/dms-kit';
import {
  Form,
  Input,
  Button,
  Card,
  Space,
  Row,
  Col,
  message,
  Divider
} from 'antd';
import {
  UserOutlined,
  DatabaseOutlined,
  ProjectOutlined,
  TeamOutlined
} from '@ant-design/icons';

const FormIntegrationDemo: React.FC = () => {
  const [form] = Form.useForm();

  const userOptions = [
    { label: '张三', value: 'zhangsan' },
    { label: '李四', value: 'lisi' },
    { label: '王五', value: 'wangwu' },
    { label: '赵六', value: 'zhaoliu' }
  ];

  const databaseOptions = [
    { label: 'MySQL', value: 'mysql' },
    { label: 'PostgreSQL', value: 'postgresql' },
    { label: 'Oracle', value: 'oracle' },
    { label: 'SQL Server', value: 'sqlserver' }
  ];

  const projectOptions = [
    { label: '电商系统', value: 'ecommerce' },
    { label: 'CRM系统', value: 'crm' },
    { label: 'ERP系统', value: 'erp' },
    { label: '数据分析平台', value: 'analytics' }
  ];

  const teamOptions = [
    { label: '开发团队', value: 'dev' },
    { label: '测试团队', value: 'test' },
    { label: '运维团队', value: 'ops' },
    { label: '产品团队', value: 'product' }
  ];

  const onFinish = (values: any) => {
    message.success('表单提交成功！');
    console.log('表单数据:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error('表单验证失败！请检查输入内容。');
    console.log('验证失败:', errorInfo);
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>表单集成</h3>

        <Card title="用户信息表单" style={{ marginBottom: '20px' }}>
          <Form
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
            scrollToFirstError
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="用户名"
                  name="username"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input placeholder="请输入用户名" />
                </Form.Item>
              </Col>
              <Col span={12}>
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
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="负责人"
                  name="owner"
                  rules={[{ required: true, message: '请选择负责人' }]}
                >
                  <CustomSelect
                    prefix={<UserOutlined />}
                    placeholder="请选择负责人"
                    options={userOptions}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="数据库类型"
                  name="databaseType"
                  rules={[{ required: true, message: '请选择数据库类型' }]}
                >
                  <CustomSelect
                    prefix={<DatabaseOutlined />}
                    placeholder="请选择数据库类型"
                    options={databaseOptions}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="项目名称"
                  name="projectName"
                  rules={[{ required: true, message: '请选择项目名称' }]}
                >
                  <CustomSelect
                    prefix={<ProjectOutlined />}
                    placeholder="请选择项目名称"
                    options={projectOptions}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="所属团队"
                  name="team"
                  rules={[{ required: true, message: '请选择所属团队' }]}
                >
                  <CustomSelect
                    prefix={<TeamOutlined />}
                    placeholder="请选择所属团队"
                    options={teamOptions}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="项目描述"
              name="description"
              rules={[{ required: true, message: '请输入项目描述' }]}
            >
              <Input.TextArea placeholder="请输入项目描述" rows={3} />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  提交表单
                </Button>
                <Button onClick={() => form.resetFields()}>重置表单</Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        <Card title="多选表单示例" style={{ marginBottom: '20px' }}>
          <Form
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
          >
            <Form.Item
              label="项目成员"
              name="members"
              rules={[{ required: true, message: '请选择项目成员' }]}
            >
              <CustomSelect
                mode="multiple"
                prefix={<UserOutlined />}
                placeholder="请选择项目成员（可多选）"
                options={userOptions}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              label="支持的技术栈"
              name="technologies"
              rules={[{ required: true, message: '请选择支持的技术栈' }]}
            >
              <CustomSelect
                mode="multiple"
                prefix={<DatabaseOutlined />}
                placeholder="请选择支持的技术栈（可多选）"
                options={[
                  ...databaseOptions,
                  { label: 'Redis', value: 'redis' },
                  { label: 'MongoDB', value: 'mongodb' },
                  { label: 'Node.js', value: 'nodejs' },
                  { label: 'React', value: 'react' },
                  { label: 'Vue', value: 'vue' }
                ]}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item label="项目标签" name="tags">
              <CustomSelect
                mode="tags"
                prefix={<ProjectOutlined />}
                placeholder="请输入或选择项目标签"
                options={[
                  { label: '前端', value: 'frontend' },
                  { label: '后端', value: 'backend' },
                  { label: '移动端', value: 'mobile' },
                  { label: 'AI', value: 'ai' },
                  { label: '大数据', value: 'bigdata' }
                ]}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                提交多选表单
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card title="表单验证特性" style={{ marginBottom: '20px' }}>
          <ul style={{ paddingLeft: '20px' }}>
            <li>
              <strong>必填验证</strong>: 使用 rules 属性设置验证规则
            </li>
            <li>
              <strong>实时验证</strong>: 支持实时验证和提交时验证
            </li>
            <li>
              <strong>错误提示</strong>: 自动显示验证错误信息
            </li>
            <li>
              <strong>滚动定位</strong>: 使用 scrollToFirstError
              自动滚动到错误字段
            </li>
            <li>
              <strong>表单重置</strong>: 支持一键重置所有字段和验证状态
            </li>
            <li>
              <strong>数据绑定</strong>: 自动绑定表单数据到组件状态
            </li>
          </ul>
        </Card>

        <Card title="集成优势">
          <ul style={{ paddingLeft: '20px' }}>
            <li>
              <strong>无缝集成</strong>: 与 Ant Design Form 完全兼容
            </li>
            <li>
              <strong>验证支持</strong>: 支持所有 Form 验证规则
            </li>
            <li>
              <strong>样式统一</strong>: 保持与 Form 组件的样式一致性
            </li>
            <li>
              <strong>功能增强</strong>: 在 Form 基础上提供额外功能
            </li>
            <li>
              <strong>开发效率</strong>: 减少重复代码，提高开发效率
            </li>
          </ul>
        </Card>

        <Card title="使用建议">
          <ul style={{ paddingLeft: '20px' }}>
            <li>
              <strong>命名规范</strong>: 使用语义化的字段名称
            </li>
            <li>
              <strong>验证规则</strong>: 为重要字段设置合适的验证规则
            </li>
            <li>
              <strong>用户体验</strong>: 使用 placeholder 和 prefix 提升用户体验
            </li>
            <li>
              <strong>错误处理</strong>: 提供清晰的错误提示信息
            </li>
            <li>
              <strong>响应式设计</strong>: 使用 Row 和 Col 实现响应式布局
            </li>
          </ul>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default FormIntegrationDemo;
