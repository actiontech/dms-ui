import React from 'react';
import { BasicRangePicker, ConfigProvider } from '@actiontech/dms-kit';
import {
  ArrowRightOutlined,
  MinusOutlined,
  SwapOutlined,
  DoubleRightOutlined
} from '@ant-design/icons';

const BasicRangePickerSeparatorDemo: React.FC = () => (
  <ConfigProvider>
    <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <BasicRangePicker
        separator={<ArrowRightOutlined />}
        placeholder={['开始日期', '结束日期']}
      />
      <BasicRangePicker
        separator={<MinusOutlined />}
        placeholder={['开始日期', '结束日期']}
      />
      <BasicRangePicker
        separator={<SwapOutlined />}
        placeholder={['开始日期', '结束日期']}
      />
      <BasicRangePicker
        separator={<DoubleRightOutlined />}
        placeholder={['开始日期', '结束日期']}
      />
    </div>
  </ConfigProvider>
);

export default BasicRangePickerSeparatorDemo;
