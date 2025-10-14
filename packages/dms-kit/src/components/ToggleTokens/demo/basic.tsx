import React, { useState } from 'react';
import { Card, Space, Tag } from 'antd';
import { ToggleTokens, ConfigProvider } from '@actiontech/dms-kit';

const BasicDemo: React.FC = () => {
  const [status, setStatus] = useState<string>('processing');
  const [type, setType] = useState<string>('document');

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>基础用法</h3>
        
        <Card title="状态过滤" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginRight: '8px' }}>当前选中:</span>
            <Tag color="blue">{status}</Tag>
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
        </Card>

        <Card title="类型过滤" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginRight: '8px' }}>当前选中:</span>
            <Tag color="green">{type}</Tag>
          </div>
          <ToggleTokens
            value={type}
            onChange={setType}
            options={[
              { label: '📄 文档', value: 'document' },
              { label: '🖼️ 图片', value: 'image' },
              { label: '🎥 视频', value: 'video' },
              { label: '🎵 音频', value: 'audio' }
            ]}
          />
        </Card>

        <Card title="字符串选项">
          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginRight: '8px' }}>当前选中:</span>
            <Tag color="orange">{status}</Tag>
          </div>
          <ToggleTokens
            value={status}
            onChange={setStatus}
            options={['processing', 'finished', 'failed', 'cancelled']}
          />
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default BasicDemo;
