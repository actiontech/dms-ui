import React from 'react';
import { ConfigProvider } from '@actiontech/dms-kit';
import { Tag } from 'antd';
import { CopyIcon } from '@actiontech/dms-kit';
import { Space, Typography } from 'antd';

const { Text } = Typography;

const CustomTooltipDemo: React.FC = () => {
  return (
    <ConfigProvider>
      <Space direction="vertical" size="large">
        <div>
          <Text>自定义提示文本：</Text>
          <CopyIcon text="自定义提示的复制内容" tooltips="点击复制此内容" />
        </div>

        <div>
          <Text>带标签的提示：</Text>
          <CopyIcon
            text="带标签提示的复制内容"
            tooltips={
              <div>
                <Tag color="blue">提示</Tag>
                <span>点击复制此内容</span>
              </div>
            }
          />
        </div>

        <div>
          <Text>状态相关提示：</Text>
          <CopyIcon text="状态相关提示的复制内容" tooltips="✅ 已复制" />
        </div>

        <div>
          <Text>多语言提示：</Text>
          <CopyIcon text="多语言提示的复制内容" tooltips="复制成功！" />
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default CustomTooltipDemo;
