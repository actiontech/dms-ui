import React from 'react';
import { BasicRangePicker, ConfigProvider } from '@actiontech/dms-kit';
import dayjs from 'dayjs';

const BasicRangePickerFormatDemo: React.FC = () => (
  <ConfigProvider>
    <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <BasicRangePicker
        format="YYYY年MM月DD日"
        placeholder={['开始日期', '结束日期']}
        defaultValue={[dayjs('2024-01-01'), dayjs('2024-01-31')]}
      />
      <BasicRangePicker
        format="MM/DD/YYYY"
        placeholder={['开始日期', '结束日期']}
        defaultValue={[dayjs('2024-01-01'), dayjs('2024-01-31')]}
      />
      <BasicRangePicker
        format="YYYY-MM-DD HH:mm:ss"
        showTime={{ format: 'HH:mm:ss' }}
        placeholder={['开始日期时间', '结束日期时间']}
        defaultValue={[
          dayjs('2024-01-01 00:00:00'),
          dayjs('2024-01-31 23:59:59')
        ]}
      />
    </div>
  </ConfigProvider>
);

export default BasicRangePickerFormatDemo;
