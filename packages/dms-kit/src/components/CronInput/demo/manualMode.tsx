import React, { useState } from 'react';
import { ConfigProvider } from '@actiontech/dms-kit';
import { Space, Typography, Card, Alert } from 'antd';
import { CronInput } from '@actiontech/dms-kit';
import { CronInputModeEnum } from '@actiontech/dms-kit';

const { Text, Title } = Typography;

const ManualModeDemo: React.FC = () => {
  const [cronValue, setCronValue] = useState('0 0 * * *');
  const [currentMode, setCurrentMode] = useState<CronInputModeEnum>(
    CronInputModeEnum.Manual
  );

  const handleChange = (value: string) => {
    setCronValue(value);
    console.log('手动输入 Cron 表达式:', value);
  };

  const handleModeChange = (mode: CronInputModeEnum) => {
    setCurrentMode(mode);
    console.log('输入模式变化:', mode);
  };

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Alert
          message="手动输入模式"
          description="在此模式下，用户可以直接在输入框中输入 Cron 表达式，支持完整的 Cron 语法。"
          type="info"
          showIcon
        />

        <Card size="small">
          <Title level={5}>手动输入 Cron 表达式</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text>当前模式：</Text>
              <Text code>
                {currentMode === CronInputModeEnum.Manual
                  ? '手动输入'
                  : '可视化选择'}
              </Text>
            </div>

            <div>
              <Text>当前值：</Text>
              <Text code>{cronValue}</Text>
            </div>

            <CronInput
              value={cronValue}
              onChange={handleChange}
              inputMode={CronInputModeEnum.Manual}
              onModeChange={handleModeChange}
            />
          </Space>
        </Card>

        <Card size="small">
          <Title level={5}>Cron 表达式格式说明</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>格式：</Text>
              <Text code>分钟 小时 日期 月份 星期</Text>
            </div>
            <div>
              <Text strong>示例：</Text>
            </div>
            <div>
              <Text code>0 0 * * *</Text>
              <Text> - 每天午夜执行</Text>
            </div>
            <div>
              <Text code>0 */2 * * *</Text>
              <Text> - 每2小时执行</Text>
            </div>
            <div>
              <Text code>30 9 * * 1-5</Text>
              <Text> - 工作日9:30执行</Text>
            </div>
            <div>
              <Text code>0 12 1 * *</Text>
              <Text> - 每月1号中午执行</Text>
            </div>
          </Space>
        </Card>
      </Space>
    </ConfigProvider>
  );
};

export default ManualModeDemo;
