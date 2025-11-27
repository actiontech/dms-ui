import React from 'react';
import { BasicDatePicker, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Typography } from 'antd';
import dayjs from 'dayjs';

const { Title } = Typography;

/**
 * 日期范围限制
 * - 禁用今天之前的日期
 * - 禁用今天之后的日期
 * - 禁用指定日期范围
 */
const BasicDatePickerRangeDemo: React.FC = () => {
  // 禁用今天之前的日期
  const disabledBeforeToday = (current: dayjs.Dayjs) => {
    return current && current < dayjs().startOf('day');
  };

  // 禁用今天之后的日期
  const disabledAfterToday = (current: dayjs.Dayjs) => {
    return current && current > dayjs().endOf('day');
  };

  // 禁用指定日期范围（只能选择最近 7 天）
  const disabledOutOfRange = (current: dayjs.Dayjs) => {
    const start = dayjs().subtract(7, 'days').startOf('day');
    const end = dayjs().endOf('day');
    return current && (current < start || current > end);
  };

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={5}>禁用今天之前的日期</Title>
          <BasicDatePicker
            disabledDate={disabledBeforeToday}
            placeholder="只能选择今天及以后"
            style={{ width: 200 }}
          />
        </div>

        <div>
          <Title level={5}>禁用今天之后的日期</Title>
          <BasicDatePicker
            disabledDate={disabledAfterToday}
            placeholder="只能选择今天及以前"
            style={{ width: 200 }}
          />
        </div>

        <div>
          <Title level={5}>只能选择最近 7 天</Title>
          <BasicDatePicker
            disabledDate={disabledOutOfRange}
            placeholder="最近 7 天"
            style={{ width: 200 }}
          />
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default BasicDatePickerRangeDemo;
