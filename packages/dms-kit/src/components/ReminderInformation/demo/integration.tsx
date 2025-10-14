import React, { useState } from 'react';
import {
  Card,
  Space,
  Button,
  Typography,
  Form,
  Input,
  Select,
  message,
  Divider,
  Alert
} from 'antd';
import { ReminderInformation, ConfigProvider } from '@actiontech/dms-kit';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  SaveOutlined,
  ReloadOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const IntegrationDemo: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (values: any) => {
    setLoading(true);
    setShowSuccess(false);
    setShowError(false);

    // 模拟异步提交
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 模拟随机成功/失败
          if (Math.random() > 0.3) {
            resolve(values);
          } else {
            reject(new Error('网络连接失败，请检查网络设置'));
          }
        }, 1500);
      });

      setShowSuccess(true);
      message.success('用户创建成功！');
      form.resetFields();
    } catch (error: any) {
      setErrorMessage(error.message || '操作失败，请重试');
      setShowError(true);
      message.error('用户创建失败！');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    form.resetFields();
    setShowSuccess(false);
    setShowError(false);
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>集成使用</h3>

        <Card title="表单提交集成" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>在表单提交后使用 ReminderInformation 显示操作结果：</p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            style={{ maxWidth: '500px' }}
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, message: '用户名至少3个字符' }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
            </Form.Item>

            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
            </Form.Item>

            <Form.Item
              name="role"
              label="用户角色"
              rules={[{ required: true, message: '请选择用户角色' }]}
            >
              <Select placeholder="请选择用户角色">
                <Option value="admin">管理员</Option>
                <Option value="editor">编辑者</Option>
                <Option value="viewer">查看者</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6个字符' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入密码"
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                >
                  创建用户
                </Button>
                <Button onClick={resetForm} icon={<ReloadOutlined />}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>

          {/* 操作结果反馈 */}
          <div style={{ marginTop: '20px' }}>
            {showSuccess && (
              <ReminderInformation
                status="success"
                message="用户创建成功！新用户已添加到系统中，可以通过邮箱和密码登录。"
              />
            )}

            {showError && (
              <ReminderInformation status="error" message={errorMessage} />
            )}
          </div>
        </Card>

        <Card title="批量操作集成" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>在批量操作中使用 ReminderInformation 显示操作结果：</p>
          </div>

          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>批量导入结果:</Text>
              <ReminderInformation
                status="success"
                message="批量导入完成！成功导入 156 条记录，失败 3 条。失败记录已导出到错误日志文件。"
              />
            </div>

            <div>
              <Text strong>批量删除结果:</Text>
              <ReminderInformation
                status="error"
                message="批量删除失败！部分记录正在被其他用户使用，无法删除。请检查依赖关系后重试。"
              />
            </div>

            <div>
              <Text strong>权限批量更新:</Text>
              <ReminderInformation
                status="success"
                message="权限批量更新成功！已更新 89 个用户的权限配置，新权限将在下次登录时生效。"
              />
            </div>
          </Space>
        </Card>

        <Card title="系统状态集成" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>在系统状态监控中使用 ReminderInformation：</p>
          </div>

          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>系统维护通知:</Text>
              <ReminderInformation
                status="success"
                message="系统维护完成！所有服务已恢复正常运行，新功能已上线。如有问题请联系技术支持。"
              />
            </div>

            <div>
              <Text strong>数据库连接状态:</Text>
              <ReminderInformation
                status="error"
                message="数据库连接异常！主数据库连接失败，已自动切换到备用数据库。系统功能正常，但建议尽快修复主数据库。"
              />
            </div>

            <div>
              <Text strong>备份任务状态:</Text>
              <ReminderInformation
                status="success"
                message="数据备份任务完成！已成功备份 2.5GB 数据到云端存储，备份文件已加密保存。"
              />
            </div>
          </Space>
        </Card>

        <Card title="集成使用说明">
          <div style={{ marginBottom: '16px' }}>
            <h4>集成场景:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>
                <strong>表单操作</strong>: 在表单提交后显示操作结果
              </li>
              <li>
                <strong>批量操作</strong>: 在批量处理完成后显示结果统计
              </li>
              <li>
                <strong>系统状态</strong>: 显示系统运行状态和重要通知
              </li>
              <li>
                <strong>异步操作</strong>: 在异步操作完成后提供反馈
              </li>
            </ul>
          </div>

          <Divider />

          <div style={{ marginBottom: '16px' }}>
            <h4>集成方式:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>
                <strong>条件渲染</strong>: 根据操作状态条件性显示组件
              </li>
              <li>
                <strong>状态管理</strong>: 通过状态管理控制显示时机
              </li>
              <li>
                <strong>事件驱动</strong>: 在用户操作事件后触发显示
              </li>
              <li>
                <strong>定时更新</strong>: 定时更新系统状态信息
              </li>
            </ul>
          </div>

          <div style={{ marginTop: '16px' }}>
            <h4>最佳实践:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>在操作完成后立即显示结果反馈</li>
              <li>提供具体的操作结果和后续指导</li>
              <li>使用合适的消息长度和详细程度</li>
              <li>考虑消息的自动消失和手动关闭</li>
              <li>保持与整体界面风格的一致性</li>
            </ul>
          </div>

          <div style={{ marginTop: '16px' }}>
            <Alert
              message="集成提示"
              description="ReminderInformation 组件可以轻松集成到各种业务场景中，提供统一的用户反馈体验。建议在整个应用中保持一致的反馈风格。"
              type="info"
              showIcon
            />
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default IntegrationDemo;
