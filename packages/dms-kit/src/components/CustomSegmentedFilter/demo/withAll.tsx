import React, { useState } from 'react';
import { Space, Divider } from 'antd';
import { CustomSegmentedFilter, ConfigProvider } from '@actiontech/dms-kit';

/**
 * 全部选项配置
 * - withAll: true - 默认"全部"选项（value 为 null）
 * - withAll: 对象 - 自定义标签和值
 * - withAll: false - 不显示全部选项
 */
const WithAllDemo: React.FC = () => {
  const [status1, setStatus1] = useState<string | null>(null);
  const [status2, setStatus2] = useState<string>('all');
  const [status3, setStatus3] = useState<string>('processing');

  return (
    <ConfigProvider>
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* 默认全部选项 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>
          默认全部选项（withAll: true）：
        </div>
        <div style={{ width: 'max-content' }}>
          <CustomSegmentedFilter
            value={status1}
            onChange={setStatus1}
            options={['processing', 'finished', 'failed']}
            withAll={true}
          />
        </div>
        <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
          自动添加 {`{ label: '全部', value: null }`}
        </div>

        <Divider />

        {/* 自定义全部选项 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>
          自定义全部选项（withAll: 对象）：
        </div>
        <div style={{ width: 'max-content' }}>
          <CustomSegmentedFilter
            value={status2}
            onChange={setStatus2}
            options={['low', 'normal', 'high', 'urgent']}
            labelDictionary={{
              low: '低',
              normal: '普通',
              high: '高',
              urgent: '紧急'
            }}
            withAll={{
              label: '所有优先级',
              value: 'all'
            }}
          />
        </div>
        <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
          自定义 {`{ label: '所有优先级', value: 'all' }`}
        </div>

        <Divider />

        {/* 无全部选项 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>
          无全部选项（withAll: false）：
        </div>
        <div style={{ width: 'max-content' }}>
          <CustomSegmentedFilter
            value={status3}
            onChange={setStatus3}
            options={[
              { label: '进行中', value: 'processing' },
              { label: '已完成', value: 'finished' },
              { label: '已失败', value: 'failed' }
            ]}
            withAll={false}
          />
        </div>
        <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
          不显示全部选项，只显示原始选项
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default WithAllDemo;
