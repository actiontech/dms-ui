import React, { useState } from 'react';
import { Card, Space, Tag, Divider } from 'antd';
import { CustomSegmentedFilter, ConfigProvider } from '@actiontech/dms-kit';

const WithAllDemo: React.FC = () => {
  const [status, setStatus] = useState<string | null>('all');
  const [priority, setPriority] = useState<string | null>('all');
  const [type, setType] = useState<string | null>('all');

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>全部选项配置</h3>

        <Card
          title="默认全部选项 (withAll: true)"
          style={{ marginBottom: '20px' }}
        >
          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginRight: '8px' }}>当前选中:</span>
            <Tag color="blue">{status === 'all' ? '全部' : status}</Tag>
          </div>
          <CustomSegmentedFilter
            value={status}
            onChange={setStatus}
            options={['processing', 'finished', 'failed', 'cancelled']}
            withAll={true}
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
              {`withAll: true

// 自动添加的选项:
// { label: '全部', value: null }`}
            </pre>
          </div>
        </Card>

        <Card
          title="自定义全部选项 (withAll: 对象)"
          style={{ marginBottom: '20px' }}
        >
          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginRight: '8px' }}>当前选中:</span>
            <Tag color="green">
              {priority === 'all' ? '所有优先级' : priority}
            </Tag>
          </div>
          <CustomSegmentedFilter
            value={priority}
            onChange={setPriority}
            options={['low', 'normal', 'high', 'urgent']}
            withAll={{
              label: '所有优先级',
              value: 'all'
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
              {`withAll: {
  label: '所有优先级',
  value: 'all'
}

// 自定义的选项:
// { label: '所有优先级', value: 'all' }`}
            </pre>
          </div>
        </Card>

        <Card
          title="禁用全部选项 (withAll: false)"
          style={{ marginBottom: '20px' }}
        >
          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginRight: '8px' }}>当前选中:</span>
            <Tag color="orange">{type || '请选择'}</Tag>
          </div>
          <CustomSegmentedFilter
            value={type}
            onChange={setType}
            options={['document', 'image', 'video', 'audio']}
            withAll={false}
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
              {`withAll: false

// 不添加全部选项，只显示原始选项`}
            </pre>
          </div>
        </Card>

        <Card title="全部选项对比">
          <div style={{ marginBottom: '16px' }}>
            <h4>三种配置方式的对比</h4>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '16px'
            }}
          >
            <div>
              <h5>默认全部选项</h5>
              <CustomSegmentedFilter options={['A', 'B', 'C']} withAll={true} />
              <div
                style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}
              >
                自动添加"全部"选项，value 为 null
              </div>
            </div>

            <div>
              <h5>自定义全部选项</h5>
              <CustomSegmentedFilter
                options={['A', 'B', 'C']}
                withAll={{
                  label: '全部类型',
                  value: 'all'
                }}
              />
              <div
                style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}
              >
                自定义标签和值
              </div>
            </div>

            <div>
              <h5>禁用全部选项</h5>
              <CustomSegmentedFilter
                options={['A', 'B', 'C']}
                withAll={false}
              />
              <div
                style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}
              >
                不显示全部选项
              </div>
            </div>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default WithAllDemo;
