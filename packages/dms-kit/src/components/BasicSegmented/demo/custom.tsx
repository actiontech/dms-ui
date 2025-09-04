import React, { useState } from 'react';
import { Space } from 'antd';
import { ConfigProvider, BasicSegmented } from '@actiontech/dms-kit';

const BasicSegmentedCustomDemo: React.FC = () => {
  const [value, setValue] = useState<string | number>('light');

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large">
        <div>
          <h4>撑满容器宽度</h4>
          <BasicSegmented
            block
            options={['light', 'dark', 'auto']}
            value={value}
            onChange={setValue}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <h4>自定义样式</h4>
          <BasicSegmented
            options={['light', 'dark', 'auto']}
            value={value}
            onChange={setValue}
            className="custom-segmented"
            style={{
              backgroundColor: '#f0f0f0',
              borderRadius: '8px',
              padding: '4px'
            }}
          />
        </div>

        <div>
          <h4>紧凑布局</h4>
          <BasicSegmented
            size="small"
            options={['light', 'dark', 'auto']}
            value={value}
            onChange={setValue}
            style={{
              backgroundColor: '#e6f7ff',
              border: '1px solid #91d5ff'
            }}
          />
        </div>

        <div>
          当前选择: <strong>{value}</strong>
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default BasicSegmentedCustomDemo;
