import React from 'react';
import { BasicRangePicker, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Typography } from 'antd';
import dayjs from 'dayjs';

const { Text } = Typography;

/**
 * 自定义格式
 * - 支持自定义日期显示格式
 * - 支持日期时间格式
 */
const BasicRangePickerFormatDemo: React.FC = () => (
  <ConfigProvider>
    <Space direction="vertical" size="middle">
      <Space>
        <Text>默认格式（YYYY-MM-DD）：</Text>
        <BasicRangePicker
          placeholder={['开始日期', '结束日期']}
          defaultValue={[dayjs('2024-01-01'), dayjs('2024-01-31')]}
        />
      </Space>

      <Space>
        <Text>中文格式（YYYY年MM月DD日）：</Text>
        <BasicRangePicker
          format="YYYY年MM月DD日"
          placeholder={['开始日期', '结束日期']}
          defaultValue={[dayjs('2024-01-01'), dayjs('2024-01-31')]}
        />
      </Space>

      <Space>
        <Text>美式格式（MM/DD/YYYY）：</Text>
        <BasicRangePicker
          format="MM/DD/YYYY"
          placeholder={['开始日期', '结束日期']}
          defaultValue={[dayjs('2024-01-01'), dayjs('2024-01-31')]}
        />
      </Space>

      <Space>
        <Text>日期时间格式：</Text>
        <BasicRangePicker
          format="YYYY-MM-DD HH:mm:ss"
          showTime={{ format: 'HH:mm:ss' }}
          placeholder={['开始日期时间', '结束日期时间']}
          defaultValue={[
            dayjs('2024-01-01 00:00:00'),
            dayjs('2024-01-31 23:59:59')
          ]}
        />
      </Space>

      <Space>
        <Text>简化时间格式：</Text>
        <BasicRangePicker
          format="YYYY-MM-DD HH:mm"
          showTime={{ format: 'HH:mm' }}
          placeholder={['开始时间', '结束时间']}
          defaultValue={[dayjs('2024-01-01 09:00'), dayjs('2024-01-01 18:00')]}
        />
      </Space>
    </Space>
  </ConfigProvider>
);

export default BasicRangePickerFormatDemo;
