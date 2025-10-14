import React from 'react';
import { BasicDatePicker, ConfigProvider } from '@actiontech/dms-kit';
import dayjs from 'dayjs';

const BasicDatePickerFormatDemo: React.FC = () => (
  <ConfigProvider>
    <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <BasicDatePicker
        format="YYYY年MM月DD日"
        placeholder="请选择日期"
        defaultValue={dayjs('2024-01-01')}
      />
      <BasicDatePicker
        format="MM/DD/YYYY"
        placeholder="请选择日期"
        defaultValue={dayjs('2024-01-01')}
      />
      <BasicDatePicker
        format="YYYY-MM-DD HH:mm:ss"
        showTime={{ format: 'HH:mm:ss' }}
        placeholder="请选择日期和时间"
        defaultValue={dayjs('2024-01-01 12:00:00')}
      />
    </div>
  </ConfigProvider>
);

export default BasicDatePickerFormatDemo;
