import React from 'react';
import { ConfigProvider, CopyIcon } from '@actiontech/dms-kit';
import { Space, Typography, message } from 'antd';

const { Text, Title } = Typography;

/**
 * 自定义配置
 * - 自定义复制逻辑
 * - 复制前验证
 * - 复制后埋点统计
 */
const CustomCopyDemo: React.FC = () => {
  // 自定义复制逻辑
  const handleCustomCopy = async () => {
    try {
      await navigator.clipboard.writeText('自定义复制的内容');
      message.success('使用自定义逻辑复制成功！');
    } catch (error) {
      message.error('自定义复制失败');
    }
  };

  // 复制前验证
  const handleSecureCopy = async () => {
    const confirmed = window.confirm('确认复制此敏感信息？');
    if (confirmed) {
      await navigator.clipboard.writeText('sk-1234567890abcdef');
      message.success('API 密钥已复制到剪贴板');
    }
  };

  // 复制后埋点统计
  const handleTrackCopy = async () => {
    await navigator.clipboard.writeText('配置内容');
    console.log('复制操作已记录:', new Date().toISOString());
    message.success('已复制并记录操作日志');
  };

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={5}>自定义复制逻辑</Title>
          <Space>
            <Text>使用自定义逻辑处理复制：</Text>
            <CopyIcon text="自定义复制的内容" onCustomCopy={handleCustomCopy} />
          </Space>
        </div>

        <div>
          <Title level={5}>复制前验证</Title>
          <Space>
            <Text>敏感信息需要确认后才能复制：</Text>
            <CopyIcon
              text="sk-1234567890abcdef"
              onCustomCopy={handleSecureCopy}
            />
          </Space>
        </div>

        <div>
          <Title level={5}>复制后埋点</Title>
          <Space>
            <Text>复制成功后记录操作日志：</Text>
            <CopyIcon text="配置内容" onCustomCopy={handleTrackCopy} />
          </Space>
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default CustomCopyDemo;
