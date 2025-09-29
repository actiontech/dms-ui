import React, { useState } from 'react';
import { BasicTag } from '@actiontech/dms-kit';
import { ConfigProvider } from '@actiontech/dms-kit';
import { Space } from 'antd';

const BasicTagDemo = () => {
  const [tags, setTags] = useState(['标签1', '标签2', '标签3']);

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <Space size={[0, 8]} wrap>
          {tags.map((tag) => (
            <BasicTag key={tag} closable onClose={() => handleClose(tag)}>
              {tag}
            </BasicTag>
          ))}
        </Space>
      </div>
    </ConfigProvider>
  );
};

export default BasicTagDemo;
