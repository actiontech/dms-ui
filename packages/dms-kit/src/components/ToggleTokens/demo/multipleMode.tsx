import React, { useState } from 'react';
import { Space, Tag, Divider, Typography } from 'antd';
import { ToggleTokens, ConfigProvider } from '@actiontech/dms-kit';

const { Text } = Typography;

const MultipleModeDemo: React.FC = () => {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([
    'processing',
    'finished'
  ]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'search',
    'filter'
  ]);

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 基础多选 */}
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            基础多选：
          </Text>
          <div style={{ marginBottom: 12 }}>
            <Space wrap>
              <span>已选中 {selectedStatuses.length} 项:</span>
              {selectedStatuses.length > 0 ? (
                selectedStatuses.map((status) => (
                  <Tag key={status} color="blue">
                    {status}
                  </Tag>
                ))
              ) : (
                <Tag>未选择</Tag>
              )}
            </Space>
          </div>
          <ToggleTokens
            value={selectedStatuses}
            onChange={setSelectedStatuses}
            options={[
              { label: '进行中', value: 'processing' },
              { label: '已完成', value: 'finished' },
              { label: '已失败', value: 'failed' },
              { label: '已取消', value: 'cancelled' }
            ]}
            multiple={true}
          />
        </div>

        <Divider style={{ margin: '8px 0' }} />

        {/* 带复选框的多选 */}
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            带复选框图标（更清晰的视觉反馈）：
          </Text>
          <div style={{ marginBottom: 12 }}>
            <Space wrap>
              <span>已选中 {selectedFeatures.length} 项:</span>
              {selectedFeatures.length > 0 ? (
                selectedFeatures.map((feature) => (
                  <Tag key={feature} color="blue">
                    {feature}
                  </Tag>
                ))
              ) : (
                <Tag>未选择</Tag>
              )}
            </Space>
          </div>
          <ToggleTokens
            value={selectedFeatures}
            onChange={setSelectedFeatures}
            options={[
              { label: '搜索功能', value: 'search' },
              { label: '筛选功能', value: 'filter' },
              { label: '排序功能', value: 'sort' },
              { label: '导出功能', value: 'export' },
              { label: '批量操作', value: 'batch' }
            ]}
            multiple={true}
            withCheckbox={true}
          />
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default MultipleModeDemo;
