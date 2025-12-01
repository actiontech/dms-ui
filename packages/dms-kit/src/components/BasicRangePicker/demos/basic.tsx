import React, { useState } from 'react';
import { BasicRangePicker, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Typography } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { CalendarOutlined } from '@actiontech/icons';

const { Text } = Typography;

/**
 * 基础用法
 * - 简单的日期范围选择
 * - 支持不同尺寸和禁用状态
 * - 支持限制日期范围
 * - 支持前缀图标和年份/月份快速切换
 */
const BasicRangePickerBasicDemo: React.FC = () => {
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);

  const handleRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null,
    dateStrings: [string, string]
  ) => {
    setDateRange(dates);
    if (dates && dates[0] && dates[1]) {
      console.log('开始日期:', dates[0].format('YYYY-MM-DD'));
      console.log('结束日期:', dates[1].format('YYYY-MM-DD'));
    }
  };

  // 禁用今天之前的日期
  const disabledDate = (current: Dayjs) => {
    return current && current < dayjs().startOf('day');
  };

  return (
    <ConfigProvider>
      <Space direction="vertical" size="middle">
        <Space>
          <Text>基础用法：</Text>
          <BasicRangePicker
            value={dateRange}
            onChange={handleRangeChange}
            placeholder={['开始日期', '结束日期']}
          />
        </Space>

        <Space>
          <Text>小尺寸：</Text>
          <BasicRangePicker
            size="small"
            placeholder={['开始日期', '结束日期']}
          />
        </Space>

        <Space>
          <Text>大尺寸：</Text>
          <BasicRangePicker
            size="large"
            placeholder={['开始日期', '结束日期']}
          />
        </Space>

        <Space>
          <Text>带默认值：</Text>
          <BasicRangePicker
            defaultValue={[dayjs().subtract(7, 'day'), dayjs()]}
            placeholder={['开始日期', '结束日期']}
          />
        </Space>

        <Space>
          <Text>禁用状态：</Text>
          <BasicRangePicker
            disabled
            defaultValue={[dayjs().subtract(7, 'day'), dayjs()]}
            placeholder={['开始日期', '结束日期']}
          />
        </Space>

        <Space>
          <Text>限制日期（今天之后）：</Text>
          <BasicRangePicker
            disabledDate={disabledDate}
            placeholder={['开始日期', '结束日期']}
          />
        </Space>

        <Space>
          <Text>带前缀图标：</Text>
          <BasicRangePicker
            prefix={<CalendarOutlined />}
            placeholder={['开始日期', '结束日期']}
          />
        </Space>

        <Space>
          <Text>显示年份快速切换按钮：</Text>
          <BasicRangePicker
            hideSuperIcon={false}
            placeholder={['开始日期', '结束日期']}
          />
        </Space>
      </Space>
    </ConfigProvider>
  );
};

export default BasicRangePickerBasicDemo;
