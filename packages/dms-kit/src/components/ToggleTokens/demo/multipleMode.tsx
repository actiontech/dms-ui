import React, { useState } from 'react';
import { Card, Space, Tag, Divider } from 'antd';
import { ToggleTokens, ConfigProvider } from '@actiontech/dms-kit';

const MultipleModeDemo: React.FC = () => {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([
    'processing'
  ]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    'document',
    'image'
  ]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>多选模式</h3>

        <Card title="状态多选" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginRight: '8px' }}>当前选中:</span>
            {selectedStatuses.length > 0 ? (
              selectedStatuses.map((status) => (
                <Tag key={status} color="blue" style={{ marginBottom: '4px' }}>
                  {status}
                </Tag>
              ))
            ) : (
              <Tag color="default">无选择</Tag>
            )}
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
              {`multiple={true} // 多选模式

// 可以选择多个选项
// value 类型为 string[] | number[]
// onChange 回调参数类型为 string[] | number[]`}
            </pre>
          </div>
        </Card>

        <Card title="类型多选" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginRight: '8px' }}>当前选中:</span>
            {selectedTypes.length > 0 ? (
              selectedTypes.map((type) => (
                <Tag key={type} color="green" style={{ marginBottom: '4px' }}>
                  {type}
                </Tag>
              ))
            ) : (
              <Tag color="default">无选择</Tag>
            )}
          </div>
          <ToggleTokens
            value={selectedTypes}
            onChange={setSelectedTypes}
            options={[
              { label: '📄 文档', value: 'document' },
              { label: '🖼️ 图片', value: 'image' },
              { label: '🎥 视频', value: 'video' },
              { label: '🎵 音频', value: 'audio' },
              { label: '📊 数据', value: 'data' }
            ]}
            multiple={true}
          />
        </Card>

        <Card title="优先级多选">
          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginRight: '8px' }}>当前选中:</span>
            {selectedPriorities.length > 0 ? (
              selectedPriorities.map((priority) => (
                <Tag
                  key={priority}
                  color="orange"
                  style={{ marginBottom: '4px' }}
                >
                  {priority}
                </Tag>
              ))
            ) : (
              <Tag color="default">无选择</Tag>
            )}
          </div>
          <ToggleTokens
            value={selectedPriorities}
            onChange={setSelectedPriorities}
            options={[
              { label: '🔵 低优先级', value: 'low' },
              { label: '🟡 普通优先级', value: 'normal' },
              { label: '🟠 高优先级', value: 'high' },
              { label: '🔴 紧急优先级', value: 'urgent' }
            ]}
            multiple={true}
          />

          <Divider />

          <div>
            <h4>多选模式特点:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>可以选择多个选项</li>
              <li>点击已选中的选项会取消选择</li>
              <li>适合多条件筛选的场景</li>
              <li>值类型为数组</li>
              <li>支持全选和全不选</li>
            </ul>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default MultipleModeDemo;
