import React from 'react';
import { BasicDatePicker, ConfigProvider } from '@actiontech/dms-kit';
import dayjs from 'dayjs';

const BasicDatePickerDisabledDemo: React.FC = () => (
  <ConfigProvider>
    <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <BasicDatePicker
        disabled
        defaultValue={dayjs('2024-01-01')}
        placeholder="禁用的日期选择器"
      />
      <BasicDatePicker
        disabled
        defaultValue={dayjs('2024-01-01')}
        placeholder="禁用的日期选择器（带默认值）"
      />
    </div>
  </ConfigProvider>
);

export default BasicDatePickerDisabledDemo;
