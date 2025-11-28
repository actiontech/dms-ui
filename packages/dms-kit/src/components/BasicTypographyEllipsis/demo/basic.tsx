import React from 'react';
import { BasicTypographyEllipsis, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Typography } from 'antd';

const { Text } = Typography;

const BasicTypographyEllipsisDemo = () => {
  const shortText = '这是一段短文本';
  const longText =
    '这是一段很长的文本内容，用于演示文本超出容器宽度时的省略效果。当文本内容超过容器宽度时，会自动显示省略号，鼠标悬停可以查看完整内容，并且支持复制功能。';
  const veryLongText =
    '这是一段超长的文本内容，用于演示 tooltipLimitLength 功能。当文本长度超过 tooltipLimitLength 设置的值时，tooltip 中也会显示省略号，避免 tooltip 内容过长影响用户体验。这段文本会持续很长很长，用于测试 tooltip 长度限制功能是否正常工作。在实际应用中，这个功能对于展示日志、错误信息等长文本非常有用。';

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            基础用法：
          </Text>
          <div style={{ maxWidth: 300 }}>
            <BasicTypographyEllipsis textCont={longText} />
          </div>
        </div>

        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            短文本（不会省略）：
          </Text>
          <div style={{ maxWidth: 300 }}>
            <BasicTypographyEllipsis textCont={shortText} />
          </div>
        </div>

        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            禁用复制功能：
          </Text>
          <div style={{ maxWidth: 300 }}>
            <BasicTypographyEllipsis textCont={longText} copyable={false} />
          </div>
        </div>

        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            限制 Tooltip 长度（tooltipLimitLength=50）：
          </Text>
          <div style={{ maxWidth: 300 }}>
            <BasicTypographyEllipsis
              textCont={veryLongText}
              tooltipLimitLength={50}
            />
          </div>
        </div>

        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            自定义 Tooltip 最大宽度（tooltipsMaxWidth=400）：
          </Text>
          <div style={{ maxWidth: 300 }}>
            <BasicTypographyEllipsis
              textCont={longText}
              tooltipsMaxWidth={400}
            />
          </div>
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default BasicTypographyEllipsisDemo;
