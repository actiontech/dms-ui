import React, { useState } from 'react';
import { Space, Divider } from 'antd';
import { CustomSegmentedFilter, ConfigProvider } from '@actiontech/dms-kit';

/**
 * 基础用法
 * - 对象数组选项
 * - 字符串数组选项
 * - 受控和非受控模式
 */
const BasicDemo: React.FC = () => {
  const [status, setStatus] = useState<string>('all');

  return (
    <ConfigProvider>
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* 对象数组选项 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>对象数组选项：</div>
        <div style={{ width: 'max-content' }}>
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
        </div>

        <Divider />

        {/* 字符串数组选项 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>
          字符串数组选项：
        </div>
        <div style={{ width: 'max-content' }}>
          <CustomSegmentedFilter
            value={status}
            onChange={setStatus}
            options={['all', 'processing', 'finished', 'failed']}
          />
        </div>

        <Divider />

        {/* 非受控模式 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>
          非受控模式（带默认值）：
        </div>
        <div style={{ width: 'max-content' }}>
          <CustomSegmentedFilter
            defaultValue="processing"
            options={[
              { label: '进行中', value: 'processing' },
              { label: '已完成', value: 'finished' },
              { label: '已失败', value: 'failed' }
            ]}
          />
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default BasicDemo;
