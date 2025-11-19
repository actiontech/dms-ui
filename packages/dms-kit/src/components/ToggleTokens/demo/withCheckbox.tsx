import React, { useState } from 'react';
import { Space, Tag } from 'antd';
import { ToggleTokens, ConfigProvider } from '@actiontech/dms-kit';

const WithCheckboxDemo: React.FC = () => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'search',
    'filter'
  ]);

  return (
    <ConfigProvider>
      <div style={{ marginBottom: '12px' }}>
        <Space wrap>
          <span>已选中 {selectedFeatures.length} 项:</span>
          {selectedFeatures.length > 0 ? (
            selectedFeatures.map((feature) => (
              <Tag key={feature} color="blue">
                {feature}
              </Tag>
            ))
          ) : (
            <Tag>未选择</Tag>
          )}
        </Space>
      </div>
      <ToggleTokens
        value={selectedFeatures}
        onChange={setSelectedFeatures}
        options={[
          { label: '搜索功能', value: 'search' },
          { label: '筛选功能', value: 'filter' },
          { label: '排序功能', value: 'sort' },
          { label: '导出功能', value: 'export' },
          { label: '批量操作', value: 'batch' }
        ]}
        multiple={true}
        withCheckbox={true}
      />
    </ConfigProvider>
  );
};

export default WithCheckboxDemo;
