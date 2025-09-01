import React from 'react';
import { BasicRangePicker, ConfigProvider } from '@actiontech/dms-kit';

const BasicRangePickerSizeDemo: React.FC = () => (
  <ConfigProvider>
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <BasicRangePicker size="small" placeholder={['小尺寸', '小尺寸']} />
      <BasicRangePicker size="middle" placeholder={['中尺寸', '中尺寸']} />
      <BasicRangePicker size="large" placeholder={['大尺寸', '大尺寸']} />
    </div>
  </ConfigProvider>
);

export default BasicRangePickerSizeDemo;
