import React from 'react';
import { BasicTag } from '@actiontech/dms-kit';
import { ConfigProvider } from '@actiontech/dms-kit';
import { Space, Typography } from 'antd';

const { Title } = Typography;

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
      <div style={{ padding: '20px' }}>
        <Title level={4}>预设颜色标签</Title>
        <Space size={[0, 8]} wrap>
          {colorTags.map((tag) => (
            <BasicTag key={tag.color} color={tag.color as any}>
              {tag.text}
            </BasicTag>
          ))}
        </Space>
      </div>
    </ConfigProvider>
  );
};

export default BasicTagColorDemo;
