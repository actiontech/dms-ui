import React, { useState } from 'react';
import { Card, Space, Typography, Input, Button, Divider, Alert } from 'antd';
import { ReminderInformation, ConfigProvider } from '@actiontech/dms-kit';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const MessageContentDemo: React.FC = () => {
  const [successMessage, setSuccessMessage] = useState('操作已成功完成！');
  const [errorMessage, setErrorMessage] = useState('操作失败，请检查后重试。');
  const [customMessage, setCustomMessage] = useState('这是一条自定义的提醒信息，可以包含较长的文本内容。');

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>消息内容</h3>
        
        <Card title="自定义消息内容" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>自定义成功和错误状态的消息内容：</p>
          </div>
          
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>成功消息:</Text>
              <TextArea
                value={successMessage}
                onChange={(e) => setSuccessMessage(e.target.value)}
                placeholder="输入成功消息内容"
                style={{ marginTop: '8px' }}
                rows={2}
              />
            </div>
            
            <div>
              <Text strong>错误消息:</Text>
              <TextArea
                value={errorMessage}
                onChange={(e) => setErrorMessage(e.target.value)}
                placeholder="输入错误消息内容"
                style={{ marginTop: '8px' }}
                rows={2}
              />
            </div>
          </Space>
          
          <div style={{ marginTop: '20px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <ReminderInformation
                status="success"
                message={successMessage}
              />
              
              <ReminderInformation
                status="error"
                message={errorMessage}
              />
            </Space>
          </div>
        </Card>

        <Card title="长文本消息" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>支持长文本消息的显示：</p>
          </div>
          
          <div>
            <Text strong>长文本消息:</Text>
            <TextArea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="输入长文本消息内容"
              style={{ marginTop: '8px' }}
              rows={3}
            />
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <ReminderInformation
              status="success"
              message={customMessage}
            />
          </div>
          
          <div style={{ marginTop: '16px' }}>
            <Alert
              message="长文本支持"
              description="ReminderInformation 组件支持长文本消息，会自动换行显示。建议保持消息简洁明了，避免过于冗长的描述。"
              type="info"
              showIcon
            />
          </div>
        </Card>

        <Card title="不同场景的消息示例" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>各种使用场景下的消息内容示例：</p>
          </div>
          
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>表单提交成功:</Text>
              <ReminderInformation
                status="success"
                message="用户信息已成功保存！新用户已添加到系统中，可以通过邮箱登录。"
              />
            </div>
            
            <div>
              <Text strong>数据导入成功:</Text>
              <ReminderInformation
                status="success"
                message="数据导入完成！成功导入 125 条记录，失败 0 条。所有数据已通过验证。"
              />
            </div>
            
            <div>
              <Text strong>权限更新成功:</Text>
              <ReminderInformation
                status="success"
                message="用户权限已更新！新权限将在下次登录时生效，如需立即生效请重新登录。"
              />
            </div>
            
            <div>
              <Text strong>系统配置更新:</Text>
              <ReminderInformation
                status="success"
                message="系统配置已更新！部分配置需要重启服务才能生效，建议在维护时间进行重启。"
              />
            </div>
          </Space>
          
          <Divider />
          
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>网络连接失败:</Text>
              <ReminderInformation
                status="error"
                message="网络连接失败！无法连接到服务器，请检查网络设置或联系网络管理员。"
              />
            </div>
            
            <div>
              <Text strong>数据验证失败:</Text>
              <ReminderInformation
                status="error"
                message="数据验证失败！请检查必填字段是否完整，邮箱格式是否正确，用户名是否已存在。"
              />
            </div>
            
            <div>
              <Text strong>权限不足:</Text>
              <ReminderInformation
                status="error"
                message="权限不足！您没有执行此操作的权限，请联系管理员获取相应权限。"
              />
            </div>
            
            <div>
              <Text strong>系统错误:</Text>
              <ReminderInformation
                status="error"
                message="系统发生错误！错误代码：ERR_001，请联系技术支持并提供错误代码。"
              />
            </div>
          </Space>
        </Card>

        <Card title="消息内容最佳实践">
          <div style={{ marginBottom: '16px' }}>
            <h4>消息内容设计原则:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>
                <strong>简洁明了</strong>: 使用简洁的语言表达核心信息
              </li>
              <li>
                <strong>用户友好</strong>: 使用用户容易理解的语言，避免技术术语
              </li>
              <li>
                <strong>操作指导</strong>: 在错误消息中提供具体的解决建议
              </li>
              <li>
                <strong>信息完整</strong>: 包含必要的信息，如错误代码、影响范围等
              </li>
            </ul>
          </div>
          
          <Divider />
          
          <div style={{ marginBottom: '16px' }}>
            <h4>成功消息建议:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>确认操作已完成</li>
              <li>说明操作的结果和影响</li>
              <li>提供后续操作的指导</li>
              <li>使用积极正面的语言</li>
            </ul>
          </div>
          
          <div style={{ marginTop: '16px' }}>
            <h4>错误消息建议:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>明确说明错误原因</li>
              <li>提供具体的解决步骤</li>
              <li>包含错误代码或标识</li>
              <li>避免指责用户的语言</li>
            </ul>
          </div>
          
          <div style={{ marginTop: '16px' }}>
            <h4>注意事项:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>避免使用过于技术化的语言</li>
              <li>保持消息长度适中，避免过长</li>
              <li>确保消息内容的准确性</li>
              <li>考虑多语言支持的需求</li>
            </ul>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default MessageContentDemo;
