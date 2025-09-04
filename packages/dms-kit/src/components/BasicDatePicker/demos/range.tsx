import React from 'react';
import { BasicDatePicker, ConfigProvider } from '@actiontech/dms-kit';
import dayjs from 'dayjs';

const BasicDatePickerRangeDemo: React.FC = () => (
  <ConfigProvider>
    <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <BasicDatePicker
        placeholder="只能选择今天之后的日期"
        disabledDate={(current) => {
          // 禁用今天之前的日期
          return current && current < dayjs().startOf('day');
        }}
      />
      <BasicDatePicker
        placeholder="只能选择最近30天的日期"
        disabledDate={(current) => {
          const today = dayjs().startOf('day');
          const thirtyDaysAgo = today.subtract(30, 'day');
          return current && (current < thirtyDaysAgo || current > today);
        }}
      />
      <BasicDatePicker
        placeholder="只能选择工作日（周一到周五）"
        disabledDate={(current) => {
          // 禁用周末
          return (current && current.day() === 0) || current.day() === 6;
        }}
      />
    </div>
  </ConfigProvider>
);

export default BasicDatePickerRangeDemo;
