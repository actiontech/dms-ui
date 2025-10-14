import React, { useState } from 'react';
import { ConfigProvider } from '@actiontech/dms-kit';
import { Space, Typography, Card } from 'antd';
import { CronInput } from '@actiontech/dms-kit';

const { Text, Title } = Typography;

const BasicDemo: React.FC = () => {
  const [cronValue, setCronValue] = useState('0 0 * * *');
  const [error, setError] = useState('');

  const handleChange = (value: string) => {
    setCronValue(value);
    console.log('Cron 表达式变化:', value);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    console.log('Cron 表达式错误:', errorMessage);
  };

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card size="small">
          <Title level={5}>基础 Cron 表达式输入</Title>
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

            {error && <Text type="danger">错误信息：{error}</Text>}
          </Space>
        </Card>

        <Card size="small">
          <Title level={5}>预设 Cron 表达式</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text>每日执行：</Text>
              <Text code>0 0 * * *</Text>
            </div>
            <div>
              <Text>每小时执行：</Text>
              <Text code>0 * * * *</Text>
            </div>
            <div>
              <Text>每周一执行：</Text>
              <Text code>0 0 * * 1</Text>
            </div>
          </Space>
        </Card>
      </Space>
    </ConfigProvider>
  );
};

export default BasicDemo;
