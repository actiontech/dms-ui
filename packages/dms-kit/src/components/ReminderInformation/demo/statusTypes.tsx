import React from 'react';
import { Card, Space, Typography, Divider } from 'antd';
import { ReminderInformation, ConfigProvider } from '@actiontech/dms-kit';

const { Title, Paragraph, Text } = Typography;

const StatusTypesDemo: React.FC = () => {
  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>状态类型</h3>

        <Card title="成功状态" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>成功状态用于显示操作成功、任务完成等正面反馈：</p>
          </div>

          <Space direction="vertical" style={{ width: '100%' }}>
            <ReminderInformation status="success" message="数据保存成功！" />

            <ReminderInformation
              status="success"
              message="用户权限更新成功，新权限已生效。"
            />

            <ReminderInformation
              status="success"
              message="系统配置已更新，重启后生效。"
            />
          </Space>

          <Divider />

          <div>
            <h4>成功状态特点:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>绿色主题色彩</li>
              <li>显示成功图标 (CheckCircleOutlined)</li>
              <li>适用于正面反馈场景</li>
              <li>提升用户操作信心</li>
            </ul>
          </div>
        </Card>

        <Card title="错误状态" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>错误状态用于显示操作失败、系统错误等负面反馈：</p>
          </div>

          <Space direction="vertical" style={{ width: '100%' }}>
            <ReminderInformation
              status="error"
              message="数据保存失败，请检查输入信息后重试。"
            />

            <ReminderInformation
              status="error"
              message="网络连接异常，无法访问服务器。"
            />

            <ReminderInformation
              status="error"
              message="权限不足，无法执行此操作。"
            />
          </Space>

          <Divider />

          <div>
            <h4>错误状态特点:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>红色主题色彩</li>
              <li>显示错误图标 (CloseCircleOutlined)</li>
              <li>适用于错误提示场景</li>
              <li>帮助用户快速定位问题</li>
            </ul>
          </div>
        </Card>

        <Card title="状态对比">
          <div style={{ marginBottom: '16px' }}>
            <p>对比两种状态类型的视觉效果：</p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <h4>成功状态</h4>
              <div
                style={{
                  padding: '20px',
                  backgroundColor: '#f6ffed',
                  borderRadius: '8px'
                }}
              >
                <ReminderInformation status="success" message="操作成功示例" />
              </div>
              <Text type="secondary">绿色主题，正面反馈</Text>
            </div>

            <div style={{ textAlign: 'center' }}>
              <h4>错误状态</h4>
              <div
                style={{
                  padding: '20px',
                  backgroundColor: '#fff2f0',
                  borderRadius: '8px'
                }}
              >
                <ReminderInformation status="error" message="操作失败示例" />
              </div>
              <Text type="secondary">红色主题，错误提示</Text>
            </div>
          </div>

          <Divider />

          <div>
            <h4>使用建议:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>
                <strong>成功状态</strong>:
                用于操作成功、任务完成、配置更新等场景
              </li>
              <li>
                <strong>错误状态</strong>:
                用于操作失败、系统错误、权限不足等场景
              </li>
              <li>
                <strong>消息内容</strong>: 保持简洁明了，提供必要的操作指导
              </li>
              <li>
                <strong>显示时机</strong>: 在操作完成后立即显示，提供及时反馈
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default StatusTypesDemo;
