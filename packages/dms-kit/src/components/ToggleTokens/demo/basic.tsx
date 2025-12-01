import React, { useState } from 'react';
import { Space, Tag, Divider, Typography } from 'antd';
import { ToggleTokens, ConfigProvider } from '@actiontech/dms-kit';

const { Text } = Typography;

const BasicDemo: React.FC = () => {
  const [status, setStatus] = useState<string>('processing');

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 对象选项 */}
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            对象选项（自定义标签和值）：
          </Text>
          <div style={{ marginBottom: 12 }}>
            <Space>
              <span>当前选中:</span>
              <Tag color="blue">{status}</Tag>
            </Space>
          </div>
          <ToggleTokens
            value={status}
            onChange={setStatus}
            options={[
              { label: '进行中', value: 'processing' },
              { label: '已完成', value: 'finished' },
              { label: '已失败', value: 'failed' },
              { label: '已取消', value: 'cancelled' }
            ]}
          />
        </div>

        <Divider style={{ margin: '8px 0' }} />

        {/* 字符串选项 */}
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            字符串选项（值即标签）：
          </Text>
          <div style={{ marginBottom: 12 }}>
            <Space>
              <span>当前选中:</span>
              <Tag color="blue">{status}</Tag>
            </Space>
          </div>
          <ToggleTokens
            value={status}
            onChange={setStatus}
            options={['processing', 'finished', 'failed', 'cancelled']}
          />
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default BasicDemo;
