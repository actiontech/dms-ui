import React, { useState } from 'react';
import { Card, Space, Tag, Divider } from 'antd';
import { ToggleTokens, ConfigProvider } from '@actiontech/dms-kit';

const SingleModeDemo: React.FC = () => {
  const [status, setStatus] = useState<string>('processing');
  const [priority, setPriority] = useState<string>('normal');
  const [category, setCategory] = useState<string>('work');

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>单选模式</h3>
        
        <Card title="状态选择 (单选)" style={{ marginBottom: '20px' }}>
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
            multiple={false}
          />
          
          <Divider />
          
          <div>
            <h4>配置说明:</h4>
            <pre style={{ backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
{`multiple={false} // 单选模式，默认值

// 只能选择一个选项
// value 类型为 string | number
// onChange 回调参数类型为 string | number`}
            </pre>
          </div>
        </Card>

        <Card title="优先级选择 (单选)" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginRight: '8px' }}>当前选中:</span>
            <Tag color="green">{priority}</Tag>
          </div>
          <ToggleTokens
            value={priority}
            onChange={setPriority}
            options={[
              { label: '🔵 低优先级', value: 'low' },
              { label: '🟡 普通优先级', value: 'normal' },
              { label: '🟠 高优先级', value: 'high' },
              { label: '🔴 紧急优先级', value: 'urgent' }
            ]}
            multiple={false}
          />
        </Card>

        <Card title="分类选择 (单选)">
          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginRight: '8px' }}>当前选中:</span>
            <Tag color="orange">{category}</Tag>
          </div>
          <ToggleTokens
            value={category}
            onChange={setCategory}
            options={[
              { label: '💼 工作', value: 'work' },
              { label: '👤 个人', value: 'personal' },
              { label: '📚 学习', value: 'study' },
              { label: '🎮 娱乐', value: 'entertainment' }
            ]}
            multiple={false}
          />
          
          <Divider />
          
          <div>
            <h4>单选模式特点:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>只能选择一个选项</li>
              <li>点击已选中的选项不会取消选择</li>
              <li>适合互斥选择的场景</li>
              <li>值类型为单个值，不是数组</li>
            </ul>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default SingleModeDemo;
