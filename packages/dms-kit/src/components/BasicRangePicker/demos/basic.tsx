import React, { useState } from 'react';
import { BasicRangePicker, ConfigProvider } from '@actiontech/dms-kit';
import type { Dayjs } from 'dayjs';

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
      console.log('开始日期字符串:', dateStrings[0]);
      console.log('结束日期字符串:', dateStrings[1]);
    }
  };

  return (
    <ConfigProvider>
      <BasicRangePicker
        value={dateRange}
        onChange={handleRangeChange}
        placeholder={['开始日期', '结束日期']}
      />
    </ConfigProvider>
  );
};

export default BasicRangePickerBasicDemo;
