import React from 'react';
import { ConfigProvider } from '@actiontech/dms-kit';
import { message } from 'antd';
import { CopyIcon } from '@actiontech/dms-kit';
import { Space, Typography } from 'antd';

const { Text } = Typography;

const CustomCopyDemo: React.FC = () => {
  const handleCustomCopy = async () => {
    try {
      // 模拟自定义复制逻辑
      await navigator.clipboard.writeText('自定义复制的内容');
      message.success('使用自定义逻辑复制成功！');
    } catch (error) {
      message.error('自定义复制失败，使用降级方案');
      // 降级到默认复制逻辑
      return false;
    }
  };

  const handleApiKeyCopy = async () => {
    try {
      await navigator.clipboard.writeText('sk-1234567890abcdef');
      message.success('API 密钥已复制到剪贴板');
    } catch (error) {
      message.error('复制失败');
    }
  };

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large">
        <div>
          <Text>自定义复制逻辑：</Text>
          <CopyIcon text="自定义复制的内容" onCustomCopy={handleCustomCopy} />
        </div>

        <div>
          <Text>API 密钥复制：</Text>
          <CopyIcon
            text="sk-1234567890abcdef"
            onCustomCopy={handleApiKeyCopy}
          />
        </div>

        <div>
          <Text>带验证的复制：</Text>
          <CopyIcon
            text="需要验证的敏感信息"
            onCustomCopy={async () => {
              const confirmed = window.confirm('确认复制此敏感信息？');
              if (confirmed) {
                await navigator.clipboard.writeText('需要验证的敏感信息');
                message.success('敏感信息已复制');
              }
            }}
          />
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default CustomCopyDemo;
