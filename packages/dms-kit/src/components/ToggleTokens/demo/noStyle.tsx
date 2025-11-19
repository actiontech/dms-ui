import React, { useState } from 'react';
import { Space, Tag } from 'antd';
import { ToggleTokens, ConfigProvider } from '@actiontech/dms-kit';

const NoStyleDemo: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'work',
    'personal'
  ]);

  return (
    <ConfigProvider>
      <div style={{ marginBottom: '12px' }}>
        <Space wrap>
          <span>当前选中:</span>
          {selectedCategories.length > 0 ? (
            selectedCategories.map((category) => (
              <Tag key={category} color="blue">
                {category}
              </Tag>
            ))
          ) : (
            <Tag>未选择</Tag>
          )}
        </Space>
      </div>
      <ToggleTokens
        value={selectedCategories}
        onChange={setSelectedCategories}
        options={[
          { label: '工作', value: 'work' },
          { label: '个人', value: 'personal' },
          { label: '学习', value: 'study' },
          { label: '娱乐', value: 'entertainment' }
        ]}
        multiple={true}
        noStyle={true}
      />
    </ConfigProvider>
  );
};

export default NoStyleDemo;
