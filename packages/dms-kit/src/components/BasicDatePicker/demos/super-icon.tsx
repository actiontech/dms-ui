import React from 'react';
import { BasicDatePicker, ConfigProvider } from '@actiontech/dms-kit';

const BasicDatePickerSuperIconDemo: React.FC = () => (
  <ConfigProvider>
    <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <BasicDatePicker
        hideSuperIcon={true}
        placeholder="隐藏超级图标（年份和月份快速跳转按钮）"
      />
      <BasicDatePicker
        hideSuperIcon={false}
        placeholder="显示超级图标（年份和月份快速跳转按钮）"
      />
    </div>
  </ConfigProvider>
);

export default BasicDatePickerSuperIconDemo;
