import React, { useState } from 'react';
import { Card, Space, Tag, Divider } from 'antd';
import { CustomSegmentedFilter, ConfigProvider } from '@actiontech/dms-kit';

const NoStyleDemo: React.FC = () => {
  const [status, setStatus] = useState<string>('processing');
  const [priority, setPriority] = useState<string>('normal');

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>无样式模式</h3>

        <Card
          title="默认样式模式 (noStyle: false)"
          style={{ marginBottom: '20px' }}
        >
          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginRight: '8px' }}>当前选中:</span>
            <Tag color="blue">{status}</Tag>
          </div>
          <CustomSegmentedFilter
            value={status}
            onChange={setStatus}
            options={['processing', 'finished', 'failed', 'cancelled']}
            withAll={true}
            noStyle={false}
          />

          <Divider />

          <div>
            <h4>配置说明:</h4>
            <pre
              style={{
                backgroundColor: '#f5f5f5',
                padding: '12px',
                borderRadius: '4px'
              }}
            >
              {`noStyle: false

// 使用 BasicSegmented 的默认样式
// 继承 Ant Design Segmented 的所有样式特性`}
            </pre>
          </div>
        </Card>

        <Card
          title="无样式模式 (noStyle: true)"
          style={{ marginBottom: '20px' }}
        >
          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginRight: '8px' }}>当前选中:</span>
            <Tag color="green">{priority}</Tag>
          </div>
          <CustomSegmentedFilter
            value={priority}
            onChange={setPriority}
            options={['low', 'normal', 'high', 'urgent']}
            withAll={true}
            noStyle={true}
            className="custom-no-style-filter"
            style={{
              padding: '8px',
              backgroundColor: '#f5f5f5',
              borderRadius: '6px'
            }}
          />

          <Divider />

          <div>
            <h4>配置说明:</h4>
            <pre
              style={{
                backgroundColor: '#f5f5f5',
                padding: '12px',
                borderRadius: '4px'
              }}
            >
              {`noStyle: true

// 清空所有默认样式
// 用户可以通过 className 和 style 自定义样式
// 完全控制外观和交互`}
            </pre>
          </div>
        </Card>

        <Card title="自定义样式示例">
          <div style={{ marginBottom: '16px' }}>
            <h4>通过 CSS 类自定义样式</h4>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h5>卡片式样式</h5>
            <CustomSegmentedFilter
              options={['选项A', '选项B', '选项C']}
              noStyle={true}
              className="card-style-filter"
              style={{
                display: 'flex',
                gap: '8px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h5>标签式样式</h5>
            <CustomSegmentedFilter
              options={['标签1', '标签2', '标签3']}
              noStyle={true}
              className="tag-style-filter"
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap'
              }}
            />
          </div>

          <Divider />

          <div>
            <h4>CSS 样式示例:</h4>
            <pre
              style={{
                backgroundColor: '#f5f5f5',
                padding: '12px',
                borderRadius: '4px'
              }}
            >
              {`/* 卡片式样式 */
.card-style-filter .custom-segmented-filter-item {
  padding: 12px 20px;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.card-style-filter .custom-segmented-filter-item:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
}

.card-style-filter .custom-segmented-filter-item-checked {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

/* 标签式样式 */
.tag-style-filter .custom-segmented-filter-item {
  padding: 6px 16px;
  background: #f0f0f0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag-style-filter .custom-segmented-filter-item:hover {
  background: #e6f7ff;
}

.tag-style-filter .custom-segmented-filter-item-checked {
  background: #1890ff;
  color: white;
}`}
            </pre>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default NoStyleDemo;
