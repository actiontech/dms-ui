import React, { useState } from 'react';
import { ConfigProvider, CronInput } from '@actiontech/dms-kit';
import { Space, Typography, Form, Alert } from 'antd';

const { Title, Text } = Typography;

/**
 * 基础用法
 * - 支持手动输入 Cron 表达式
 * - 点击日历图标切换到可视化选择模式
 * - 自动验证表达式格式
 * - 禁用状态
 */
const BasicDemo: React.FC = () => {
  const [cronValue1, setCronValue1] = useState('0 0 * * *');
  const [cronValue2, setCronValue2] = useState('0 0 * * 1');
  const [error, setError] = useState('');

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={5}>基础用法（支持手动输入和可视化选择）</Title>
          <Form layout="vertical">
            <Form.Item
              label="Cron 表达式"
              validateStatus={error ? 'error' : ''}
              help={error}
            >
              <CronInput
                value={cronValue1}
                onChange={setCronValue1}
                onError={setError}
              />
            </Form.Item>
            <Alert
              message={`当前值：${cronValue1} | 提示：点击输入框右侧的日历图标可切换到可视化选择模式`}
              type="info"
              showIcon
            />
          </Form>
        </div>

        <div>
          <Title level={5}>错误验证</Title>
          <Form layout="vertical">
            <Form.Item label="Cron 表达式">
              <CronInput value={cronValue2} onChange={setCronValue2} />
            </Form.Item>
            <Alert message={`当前值：${cronValue2}`} type="info" showIcon />
          </Form>
        </div>

        <div>
          <Title level={5}>禁用状态</Title>
          <CronInput value="0 0 * * *" onChange={() => {}} disabled />
        </div>

        <div>
          <Title level={5}>常用 Cron 表达式</Title>
          <Space direction="vertical">
            <Text>
              • <Text code>0 0 * * *</Text> - 每天午夜执行
            </Text>
            <Text>
              • <Text code>0 * * * *</Text> - 每小时执行
            </Text>
            <Text>
              • <Text code>0 0 * * 1</Text> - 每周一午夜执行
            </Text>
            <Text>
              • <Text code>0 0 1 * *</Text> - 每月 1 号午夜执行
            </Text>
          </Space>
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default BasicDemo;
