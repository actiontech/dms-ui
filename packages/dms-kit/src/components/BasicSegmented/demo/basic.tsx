import React, { useState } from 'react';
import { Space } from 'antd';
import { ConfigProvider, BasicSegmented } from '@actiontech/dms-kit';

const BasicSegmentedBasicDemo: React.FC = () => {
  const [value, setValue] = useState<string | number>('List');

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large">
        <BasicSegmented
          options={['List', 'Kanban', 'Gantt']}
          value={value}
          onChange={setValue}
        />

        <div>
          当前选择: <strong>{value}</strong>
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default BasicSegmentedBasicDemo;
