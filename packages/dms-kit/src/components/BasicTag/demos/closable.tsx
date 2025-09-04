import React, { useState } from 'react';
import { ConfigProvider } from '@actiontech/dms-kit';
import { Space, Button, message } from 'antd';
import { BasicTag } from '@actiontech/dms-kit';

const BasicTagClosableDemo = () => {
  const [selectedTags, setSelectedTags] = useState([
    { key: '1', text: '已选择标签1', color: 'blue' },
    { key: '2', text: '已选择标签2', color: 'green' },
    { key: '3', text: '已选择标签3', color: 'orange' }
  ]);

  const handleClose = (removedTag: any) => {
    const newTags = selectedTags.filter((tag) => tag.key !== removedTag.key);
    setSelectedTags(newTags);
    message.success(`已移除标签: ${removedTag.text}`);
  };

  const addTag = () => {
    const newTag = {
      key: Date.now().toString(),
      text: `新标签${selectedTags.length + 1}`,
      color: ['blue', 'green', 'orange', 'purple'][
        selectedTags.length % 4
      ] as any
    };
    setSelectedTags([...selectedTags, newTag]);
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <Button onClick={addTag} type="primary">
            添加标签
          </Button>
        </div>

        <Space size={[0, 8]} wrap>
          {selectedTags.map((tag) => (
            <BasicTag
              key={tag.key}
              color={tag.color as any}
              closable
              onClose={() => handleClose(tag)}
            >
              {tag.text}
            </BasicTag>
          ))}
        </Space>

        {selectedTags.length === 0 && (
          <div style={{ color: '#999', marginTop: '16px' }}>
            暂无标签，请添加标签
          </div>
        )}
      </div>
    </ConfigProvider>
  );
};

export default BasicTagClosableDemo;
