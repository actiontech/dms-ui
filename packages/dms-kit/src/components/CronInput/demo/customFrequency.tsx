import React, { useState } from 'react';
import { ConfigProvider } from '@actiontech/dms-kit';
import { Space, Typography, Card, Radio, Alert } from 'antd';
import { CronInput } from '@actiontech/dms-kit';
import { CronFrequencyEnum } from '@actiontech/dms-kit';

const { Text, Title } = Typography;

const CustomFrequencyDemo: React.FC = () => {
  const [cronValue, setCronValue] = useState('0 0 * * *');
  const [frequency, setFrequency] = useState<CronFrequencyEnum>(
    CronFrequencyEnum.Daily
  );

  const handleChange = (value: string) => {
    setCronValue(value);
    console.log('Cron 表达式变化:', value);
  };

  const handleFrequencyChange = (e: any) => {
    const newFrequency = e.target.value;
    setFrequency(newFrequency);
    console.log('频率类型变化:', newFrequency);

    // 根据频率类型设置默认的 Cron 表达式
    if (newFrequency === CronFrequencyEnum.Daily) {
      setCronValue('0 0 * * *');
    } else if (newFrequency === CronFrequencyEnum.Weekly) {
      setCronValue('0 0 * * 1');
    }
  };

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Alert
          message="自定义频率演示"
          description="通过 defaultFrequency 属性可以设置 CronInput 组件的默认频率类型，影响可视化选择模式下的默认行为。"
          type="success"
          showIcon
        />

        <Card size="small">
          <Title level={5}>频率类型选择</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text>选择频率类型：</Text>
              <Radio.Group value={frequency} onChange={handleFrequencyChange}>
                <Radio.Button value={CronFrequencyEnum.Daily}>
                  每日
                </Radio.Button>
                <Radio.Button value={CronFrequencyEnum.Weekly}>
                  每周
                </Radio.Button>
              </Radio.Group>
            </div>

            <div>
              <Text>当前频率：</Text>
              <Text code>
                {frequency === CronFrequencyEnum.Daily
                  ? '每日执行'
                  : '每周执行'}
              </Text>
            </div>

            <div>
              <Text>当前值：</Text>
              <Text code>{cronValue}</Text>
            </div>

            <CronInput
              value={cronValue}
              onChange={handleChange}
              defaultFrequency={frequency}
            />
          </Space>
        </Card>

        <Card size="small">
          <Title level={5}>频率类型说明</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>每日频率 (Daily)：</Text>
            </div>
            <div>
              <Text>• 适用于需要每天执行的任务</Text>
            </div>
            <div>
              <Text>• 默认表达式：0 0 * * *（每天午夜执行）</Text>
            </div>
            <div>
              <Text>• 可配置具体的小时和分钟</Text>
            </div>

            <div style={{ marginTop: 16 }}>
              <Text strong>每周频率 (Weekly)：</Text>
            </div>
            <div>
              <Text>• 适用于需要每周执行的任务</Text>
            </div>
            <div>
              <Text>• 默认表达式：0 0 * * 1（每周一午夜执行）</Text>
            </div>
            <div>
              <Text>• 可配置具体的星期几、小时和分钟</Text>
            </div>
          </Space>
        </Card>

        <Card size="small">
          <Title level={5}>使用建议</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>频率选择建议：</Text>
            </div>
            <div>
              <Text>• 数据备份任务：建议使用每日频率</Text>
            </div>
            <div>
              <Text>• 系统维护任务：建议使用每周频率</Text>
            </div>
            <div>
              <Text>• 报表生成任务：根据业务需求选择频率</Text>
            </div>
            <div>
              <Text>• 数据清理任务：建议使用每日频率</Text>
            </div>
          </Space>
        </Card>
      </Space>
    </ConfigProvider>
  );
};

export default CustomFrequencyDemo;
