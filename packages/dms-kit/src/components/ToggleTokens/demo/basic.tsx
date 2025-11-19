import React, { useState } from 'react';
import { Space, Tag, Divider } from 'antd';
import { ToggleTokens, ConfigProvider } from '@actiontech/dms-kit';

/**
 * 基础用法演示
 * - 支持对象选项和字符串选项
 * - 默认为单选模式
 * - 自动控制选中状态
 */
const BasicDemo: React.FC = () => {
  const [status, setStatus] = useState<string>('processing');

  return (
    <ConfigProvider>
      <div style={{ padding: '24px' }}>
        {/* 对象选项 - 状态过滤 */}
        <div style={{ marginBottom: '32px' }}>
          <h4 style={{ marginBottom: '12px' }}>状态过滤 (对象选项)</h4>
          <div style={{ marginBottom: '12px' }}>
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

        <Divider />

        {/* 字符串选项 */}
        <div>
          <h4 style={{ marginBottom: '12px' }}>
            字符串选项 (直接使用值作为标签)
          </h4>
          <div style={{ marginBottom: '12px' }}>
            <Space>
              <span>当前选中:</span>
              <Tag color="orange">{status}</Tag>
            </Space>
          </div>
          <ToggleTokens
            value={status}
            onChange={setStatus}
            options={['processing', 'finished', 'failed', 'cancelled']}
          />
          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              fontSize: '13px'
            }}
          >
            <p style={{ margin: 0 }}>
              💡 <strong>提示：</strong>
              字符串选项会直接使用值作为标签显示，如需自定义标签可使用对象选项或标签字典。
            </p>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default BasicDemo;
