import React, { useState } from 'react';
import { BasicTag } from '@actiontech/dms-kit';
import { ConfigProvider } from '@actiontech/dms-kit';
import { Space, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const BasicTagDynamicDemo = () => {
  const [tags, setTags] = useState([
    { id: '1', text: '标签1', color: 'blue' },
    { id: '2', text: '标签2', color: 'green' }
  ]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');

  const colors = ['blue', 'green', 'orange', 'purple', 'cyan', 'geekblue'];

  const handleClose = (removedTag: any) => {
    const newTags = tags.filter((tag) => tag.id !== removedTag.id);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.find((tag) => tag.text === inputValue)) {
      const newTag = {
        id: Date.now().toString(),
        text: inputValue,
        color: colors[tags.length % colors.length]
      };
      setTags([...tags, newTag]);
      setInputValue('');
    }
    setInputVisible(false);
  };

  const handleEditInputConfirm = () => {
    if (editInputValue && editInputIndex >= 0) {
      const newTags = [...tags];
      newTags[editInputIndex].text = editInputValue;
      setTags(newTags);
      setEditInputIndex(-1);
      setEditInputValue('');
    }
  };

  const tagInputStyle = {
    width: 78,
    height: 22,
    marginInlineEnd: 8,
    verticalAlign: 'top'
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <Space size={[0, 8]} wrap>
          {tags.map((tag, index) => {
            if (editInputIndex === index) {
              return (
                <Input
                  key={tag.id}
                  size="small"
                  style={tagInputStyle}
                  value={editInputValue}
                  onChange={(e) => setEditInputValue(e.target.value)}
                  onBlur={handleEditInputConfirm}
                  onPressEnter={handleEditInputConfirm}
                />
              );
            }
            return (
              <BasicTag
                key={tag.id}
                color={tag.color as any}
                closable
                onClose={() => handleClose(tag)}
                onDoubleClick={() => {
                  setEditInputIndex(index);
                  setEditInputValue(tag.text);
                }}
              >
                {tag.text}
              </BasicTag>
            );
          })}
          {inputVisible ? (
            <Input
              type="text"
              size="small"
              style={tagInputStyle}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
            />
          ) : (
            <BasicTag onClick={showInput} style={{ borderStyle: 'dashed' }}>
              <PlusOutlined /> 新标签
            </BasicTag>
          )}
        </Space>
      </div>
    </ConfigProvider>
  );
};

export default BasicTagDynamicDemo;
