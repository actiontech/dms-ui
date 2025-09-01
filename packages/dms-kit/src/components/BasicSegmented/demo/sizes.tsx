import React, { useState } from 'react';
import { Space } from 'antd';
import { ConfigProvider, BasicSegmented } from '@actiontech/dms-kit';

const BasicSegmentedSizesDemo: React.FC = () => {
  const [value, setValue] = useState<string | number>('Day');

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large">
        <div>
          <h4>大尺寸 (large)</h4>
          <BasicSegmented
            size="large"
            options={['Day', 'Week', 'Month', 'Year']}
            value={value}
            onChange={setValue}
          />
        </div>

        <div>
          <h4>默认尺寸 (middle)</h4>
          <BasicSegmented
            size="middle"
            options={['Day', 'Week', 'Month', 'Year']}
            value={value}
            onChange={setValue}
          />
        </div>

        <div>
          <h4>小尺寸 (small)</h4>
          <BasicSegmented
            size="small"
            options={['Day', 'Week', 'Month', 'Year']}
            value={value}
            onChange={setValue}
          />
        </div>

        <div>
          当前选择: <strong>{value}</strong>
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default BasicSegmentedSizesDemo;
