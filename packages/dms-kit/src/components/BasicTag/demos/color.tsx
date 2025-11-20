/**
 * 多种预设颜色
 * - 提供 12 种颜色主题
 * - 统一的视觉风格
 */
import React from 'react';
import { BasicTag, ConfigProvider } from '@actiontech/dms-kit';
import { Space } from 'antd';

const BasicTagColorDemo = () => {
  const colorTags = [
    { color: 'default', text: '默认' },
    { color: 'red', text: '红色' },
    { color: 'orange', text: '橙色' },
    { color: 'gold', text: '金色' },
    { color: 'green', text: '绿色' },
    { color: 'cyan', text: '青色' },
    { color: 'blue', text: '蓝色' },
    { color: 'geekblue', text: '极客蓝' },
    { color: 'purple', text: '紫色' },
    { color: 'Grape', text: '葡萄色' },
    { color: 'lilac', text: '丁香色' },
    { color: 'gray', text: '灰色' }
  ];

  return (
    <ConfigProvider>
      <Space size={[0, 8]} wrap>
        {colorTags.map((tag) => (
          <BasicTag key={tag.color} color={tag.color as any}>
            {tag.text}
          </BasicTag>
        ))}
      </Space>
    </ConfigProvider>
  );
};

export default BasicTagColorDemo;
