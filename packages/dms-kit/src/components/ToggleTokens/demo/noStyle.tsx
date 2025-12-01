import React, { useState } from 'react';
import { Space, Tag, Typography } from 'antd';
import { ToggleTokens, ConfigProvider } from '@actiontech/dms-kit';

const { Text } = Typography;

const NoStyleDemo: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'work',
    'personal'
  ]);

  return (
    <ConfigProvider>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Text type="secondary" style={{ fontSize: '13px' }}>
          使用 `noStyle` 清空所有默认样式，可完全自定义样式
        </Text>
        <div style={{ marginBottom: 12 }}>
          <Space wrap>
            <span>已选中:</span>
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
      </Space>
    </ConfigProvider>
  );
};

export default NoStyleDemo;
