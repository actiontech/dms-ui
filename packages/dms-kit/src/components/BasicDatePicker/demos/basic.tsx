import React, { useState } from 'react';
import { BasicDatePicker, ConfigProvider } from '@actiontech/dms-kit';
import type { Dayjs } from 'dayjs';

const BasicDatePickerBasicDemo: React.FC = () => {
  const [date, setDate] = useState<Dayjs | null>(null);

  const handleDateChange = (value: Dayjs | null) => {
    setDate(value);
    console.log('选择的日期:', value?.format('YYYY-MM-DD'));
  };

  return (
    <ConfigProvider>
      <BasicDatePicker
        value={date}
        onChange={handleDateChange}
        placeholder="请选择日期"
      />
    </ConfigProvider>
  );
};

export default BasicDatePickerBasicDemo;
