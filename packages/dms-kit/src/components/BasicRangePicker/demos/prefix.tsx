import React from 'react';
import { BasicRangePicker, ConfigProvider } from '@actiontech/dms-kit';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined
} from '@ant-design/icons';

const BasicRangePickerPrefixDemo: React.FC = () => (
  <ConfigProvider>
    <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <BasicRangePicker
        prefix={<CalendarOutlined />}
        placeholder={['开始日期', '结束日期']}
      />
      <BasicRangePicker
        prefix={<ClockCircleOutlined />}
        placeholder={['开始时间', '结束时间']}
      />
      <BasicRangePicker
        prefix={<UserOutlined />}
        placeholder={['入职开始日期', '入职结束日期']}
      />
    </div>
  </ConfigProvider>
);

export default BasicRangePickerPrefixDemo;
