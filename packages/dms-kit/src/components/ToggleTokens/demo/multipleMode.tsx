import React, { useState } from 'react';
import { Space, Tag, Divider } from 'antd';
import { ToggleTokens, ConfigProvider } from '@actiontech/dms-kit';

const MultipleModeDemo: React.FC = () => {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([
    'processing',
    'finished'
  ]);

  return (
    <ConfigProvider>
      <div style={{ marginBottom: '12px' }}>
        <Space wrap>
          <span>已选中 {selectedStatuses.length} 项:</span>
          {selectedStatuses.length > 0 ? (
            selectedStatuses.map((status) => (
              <Tag key={status} color="blue">
                {status}
              </Tag>
            ))
          ) : (
            <Tag>未选择</Tag>
          )}
        </Space>
      </div>
      <ToggleTokens
        value={selectedStatuses}
        onChange={setSelectedStatuses}
        options={[
          { label: '进行中', value: 'processing' },
          { label: '已完成', value: 'finished' },
          { label: '已失败', value: 'failed' },
          { label: '已取消', value: 'cancelled' }
        ]}
        multiple={true}
      />
    </ConfigProvider>
  );
};

export default MultipleModeDemo;
