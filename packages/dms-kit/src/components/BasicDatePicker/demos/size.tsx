import React from 'react';
import { BasicDatePicker, ConfigProvider } from '@actiontech/dms-kit';

const BasicDatePickerSizeDemo: React.FC = () => (
  <ConfigProvider>
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <BasicDatePicker size="small" placeholder="小尺寸" />
      <BasicDatePicker size="middle" placeholder="中尺寸" />
      <BasicDatePicker size="large" placeholder="大尺寸" />
    </div>
  </ConfigProvider>
);

export default BasicDatePickerSizeDemo;
