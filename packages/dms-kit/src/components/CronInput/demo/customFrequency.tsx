import React, { useState } from 'react';
import {
  ConfigProvider,
  CronInput,
  CronFrequencyEnum,
  CronInputModeEnum
} from '@actiontech/dms-kit';
import { Space, Typography, Radio, Alert } from 'antd';

const { Title } = Typography;

/**
 * 自定义配置
 * - 每日频率（daily）
 * - 每周频率（weekly）
 * - 模式切换回调
 */
const CustomFrequencyDemo: React.FC = () => {
  const [cronValue, setCronValue] = useState('0 0 * * *');
  const [frequency, setFrequency] = useState<CronFrequencyEnum>(
    CronFrequencyEnum.Daily
  );
  const [mode, setMode] = useState<string>('Manual');

  const handleFrequencyChange = (e: any) => {
    const newFrequency = e.target.value;
    setFrequency(newFrequency);

    // 根据频率类型设置默认的 Cron 表达式
    if (newFrequency === CronFrequencyEnum.Daily) {
      setCronValue('0 0 * * *');
    } else {
      setCronValue('0 0 * * 1');
    }
  };

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={5}>自定义频率类型</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Radio.Group value={frequency} onChange={handleFrequencyChange}>
                <Radio.Button value={CronFrequencyEnum.Daily}>
                  每日
                </Radio.Button>
                <Radio.Button value={CronFrequencyEnum.Weekly}>
                  每周
                </Radio.Button>
              </Radio.Group>
            </div>

            <CronInput
              value={cronValue}
              onChange={setCronValue}
              defaultFrequency={frequency}
              onModeChange={setMode}
            />

            <Alert
              message={`当前频率：${
                frequency === CronFrequencyEnum.Daily ? '每日' : '每周'
              } | 当前值：${cronValue}`}
              type="info"
              showIcon
            />
          </Space>
        </div>

        <div>
          <Title level={5}>模式切换回调</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <CronInput
              value={cronValue}
              onChange={setCronValue}
              onModeChange={(newMode) => {
                setMode(newMode);
                console.log('模式切换:', newMode);
              }}
            />
            <Alert message={`当前输入模式：${mode}`} type="success" showIcon />
          </Space>
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default CustomFrequencyDemo;
