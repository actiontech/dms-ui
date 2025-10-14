import React, { useState } from 'react';
import { ConfigProvider } from '@actiontech/dms-kit';
import { Space, Typography, Card, Alert, List } from 'antd';
import { CronInput } from '@actiontech/dms-kit';

const { Text, Title } = Typography;

const ErrorHandlingDemo: React.FC = () => {
  const [cronValue, setCronValue] = useState('0 0 * * *');
  const [errorHistory, setErrorHistory] = useState<string[]>([]);

  const handleChange = (value: string) => {
    setCronValue(value);
    console.log('Cron 表达式变化:', value);
  };

  const handleError = (errorMessage: string) => {
    console.log('Cron 表达式错误:', errorMessage);
    setErrorHistory((prev) => [errorMessage, ...prev.slice(0, 4)]);
  };

  const invalidCronExamples = [
    'invalid cron expression',
    '99 99 * * *',
    '0 0 32 2 *',
    '* * * * * *',
    '0 0 * * 8'
  ];

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Alert
          message="错误处理演示"
          description="CronInput 组件会自动验证输入的 Cron 表达式格式，并通过 onError 回调返回错误信息。"
          type="info"
          showIcon
        />

        <Card size="small">
          <Title level={5}>错误信息收集</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text>当前值：</Text>
              <Text code>{cronValue}</Text>
            </div>

            <CronInput
              value={cronValue}
              onChange={handleChange}
              onError={handleError}
            />

            {errorHistory.length > 0 && (
              <div>
                <Text strong>错误历史：</Text>
                <List
                  size="small"
                  dataSource={errorHistory}
                  renderItem={(error, index) => (
                    <List.Item>
                      <Text type="danger">
                        {index + 1}. {error}
                      </Text>
                    </List.Item>
                  )}
                />
              </div>
            )}
          </Space>
        </Card>

        <Card size="small">
          <Title level={5}>常见错误示例</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text strong>尝试输入以下无效的 Cron 表达式来测试错误处理：</Text>
            <List
              size="small"
              dataSource={invalidCronExamples}
              renderItem={(example) => (
                <List.Item>
                  <Text code>{example}</Text>
                  <Text type="secondary"> - 复制到上方输入框测试</Text>
                </List.Item>
              )}
            />
          </Space>
        </Card>

        <Card size="small">
          <Title level={5}>错误处理最佳实践</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>错误处理建议：</Text>
            </div>
            <div>
              <Text>• 在 onError 回调中收集错误信息</Text>
            </div>
            <div>
              <Text>• 向用户显示友好的错误提示</Text>
            </div>
            <div>
              <Text>• 记录错误日志用于问题排查</Text>
            </div>
            <div>
              <Text>• 提供正确的 Cron 表达式示例</Text>
            </div>
            <div>
              <Text>• 在表单提交前验证表达式有效性</Text>
            </div>
          </Space>
        </Card>
      </Space>
    </ConfigProvider>
  );
};

export default ErrorHandlingDemo;
