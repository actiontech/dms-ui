import React, { useState } from 'react';
import { ConfigProvider } from '@actiontech/dms-kit';
import { Space, Typography, Card, Switch, Alert } from 'antd';
import { CronInput } from '@actiontech/dms-kit';

const { Text, Title } = Typography;

const DisabledDemo: React.FC = () => {
  const [cronValue, setCronValue] = useState('0 0 * * *');
  const [isDisabled, setIsDisabled] = useState(true);

  const handleChange = (value: string) => {
    setCronValue(value);
    console.log('Cron 表达式变化:', value);
  };

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Alert
          message="禁用状态演示"
          description="当组件处于禁用状态时，用户无法修改 Cron 表达式，适用于只读展示或权限控制场景。"
          type="warning"
          showIcon
        />

        <Card size="small">
          <Title level={5}>禁用状态控制</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text>禁用状态：</Text>
              <Switch
                checked={isDisabled}
                onChange={setIsDisabled}
                checkedChildren="禁用"
                unCheckedChildren="启用"
              />
            </div>

            <div>
              <Text>当前值：</Text>
              <Text code>{cronValue}</Text>
            </div>

            <CronInput
              value={cronValue}
              onChange={handleChange}
              disabled={isDisabled}
            />

            <Text type="secondary">
              状态：{isDisabled ? '已禁用（不可编辑）' : '已启用（可编辑）'}
            </Text>
          </Space>
        </Card>

        <Card size="small">
          <Title level={5}>禁用状态使用场景</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>适用场景：</Text>
            </div>
            <div>
              <Text>• 只读展示：在详情页面展示定时任务配置</Text>
            </div>
            <div>
              <Text>• 权限控制：用户没有修改权限时禁用编辑</Text>
            </div>
            <div>
              <Text>• 状态锁定：任务正在执行时锁定配置</Text>
            </div>
            <div>
              <Text>• 审核流程：等待审核的配置不允许修改</Text>
            </div>
          </Space>
        </Card>

        <Card size="small">
          <Title level={5}>禁用状态样式</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text>禁用状态的 CronInput 组件：</Text>
            </div>
            <CronInput value="0 0 * * *" disabled={true} />
            <Text type="secondary">
              禁用状态下，输入框呈现灰色，无法点击和编辑
            </Text>
          </Space>
        </Card>
      </Space>
    </ConfigProvider>
  );
};

export default DisabledDemo;
