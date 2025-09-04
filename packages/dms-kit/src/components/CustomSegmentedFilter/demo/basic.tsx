import React, { useState } from 'react';
import { Card, Space, Tag } from 'antd';
import { CustomSegmentedFilter, ConfigProvider } from '@actiontech/dms-kit';

const BasicDemo: React.FC = () => {
  const [status, setStatus] = useState<string>('all');
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
          <CustomSegmentedFilter
            value={status}
            onChange={setStatus}
            options={[
              { label: '全部', value: 'all' },
              { label: '进行中', value: 'processing' },
              { label: '已完成', value: 'finished' },
              { label: '已失败', value: 'failed' }
            ]}
          />
        </Card>

        <Card title="类型过滤" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginRight: '8px' }}>当前选中:</span>
            <Tag color="green">{type}</Tag>
          </div>
          <CustomSegmentedFilter
            value={type}
            onChange={setType}
            options={[
              { label: '文档', value: 'document' },
              { label: '图片', value: 'image' },
              { label: '视频', value: 'video' },
              { label: '音频', value: 'audio' }
            ]}
          />
        </Card>

        <Card title="字符串选项">
          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginRight: '8px' }}>当前选中:</span>
            <Tag color="orange">{status}</Tag>
          </div>
          <CustomSegmentedFilter
            value={status}
            onChange={setStatus}
            options={['all', 'processing', 'finished', 'failed']}
          />
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default BasicDemo;
