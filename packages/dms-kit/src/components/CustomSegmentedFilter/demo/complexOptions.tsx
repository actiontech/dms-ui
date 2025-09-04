import React, { useState } from 'react';
import { Card, Space, Tag, Divider, Row, Col } from 'antd';
import { CustomSegmentedFilter, ConfigProvider } from '@actiontech/dms-kit';

const ComplexOptionsDemo: React.FC = () => {
  const [status, setStatus] = useState<string>('processing');
  const [priority, setPriority] = useState<string>('normal');
  const [type, setType] = useState<string>('document');
  const [category, setCategory] = useState<string>('work');

  // 复杂选项配置
  const complexOptions = [
    { label: '进行中', value: 'processing', color: '#1890ff' },
    { label: '已完成', value: 'finished', color: '#52c41a' },
    { label: '已失败', value: 'failed', color: '#ff4d4f' },
    { label: '已取消', value: 'cancelled', color: '#faad14' }
  ];

  const priorityOptions = [
    { label: '低优先级', value: 'low', icon: '🔵' },
    { label: '普通优先级', value: 'normal', icon: '🟡' },
    { label: '高优先级', value: 'high', icon: '🟠' },
    { label: '紧急优先级', value: 'urgent', icon: '🔴' }
  ];

  const typeOptions = [
    { label: '📄 文档', value: 'document' },
    { label: '🖼️ 图片', value: 'image' },
    { label: '🎥 视频', value: 'video' },
    { label: '🎵 音频', value: 'audio' },
    { label: '📦 压缩包', value: 'archive' }
  ];

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>复杂选项配置</h3>
        
        <Card title="对象数组选项" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginRight: '8px' }}>当前选中:</span>
            <Tag color="blue">{status}</Tag>
          </div>
          <CustomSegmentedFilter
            value={status}
            onChange={setStatus}
            options={complexOptions}
            withAll={true}
          />
          
          <Divider />
          
          <div>
            <h4>配置说明:</h4>
            <pre style={{ backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
{`const complexOptions = [
  { label: '进行中', value: 'processing', color: '#1890ff' },
  { label: '已完成', value: 'finished', color: '#52c41a' },
  { label: '已失败', value: 'failed', color: '#ff4d4f' },
  { label: '已取消', value: 'cancelled', color: '#faad14' }
];`}
            </pre>
          </div>
        </Card>

        <Card title="带图标的选项" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginRight: '8px' }}>当前选中:</span>
            <Tag color="green">{priority}</Tag>
          </div>
          <CustomSegmentedFilter
            value={priority}
            onChange={setPriority}
            options={priorityOptions}
            withAll={true}
          />
          
          <Divider />
          
          <div>
            <h4>配置说明:</h4>
            <pre style={{ backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
{`const priorityOptions = [
  { label: '低优先级', value: 'low', icon: '🔵' },
  { label: '普通优先级', value: 'normal', icon: '🟡' },
  { label: '高优先级', value: 'high', icon: '🟠' },
  { label: '紧急优先级', value: 'urgent', icon: '🔴' }
];`}
            </pre>
          </div>
        </Card>

        <Card title="混合内容选项" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginRight: '8px' }}>当前选中:</span>
            <Tag color="orange">{type}</Tag>
          </div>
          <CustomSegmentedFilter
            value={type}
            onChange={setType}
            options={typeOptions}
            withAll={true}
          />
          
          <Divider />
          
          <div>
            <h4>配置说明:</h4>
            <pre style={{ backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
{`const typeOptions = [
  { label: '📄 文档', value: 'document' },
  { label: '🖼️ 图片', value: 'image' },
  { label: '🎥 视频', value: 'video' },
  { label: '🎵 音频', value: 'audio' },
  { label: '📦 压缩包', value: 'archive' }
];`}
            </pre>
          </div>
        </Card>

        <Card title="动态选项生成">
          <div style={{ marginBottom: '16px' }}>
            <h4>根据数据动态生成选项</h4>
          </div>
          
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div style={{ marginBottom: '16px' }}>
                <span style={{ marginRight: '8px' }}>当前选中:</span>
                <Tag color="purple">{category}</Tag>
              </div>
              <CustomSegmentedFilter
                value={category}
                onChange={setCategory}
                options={[
                  'work',
                  'personal',
                  'study',
                  'entertainment',
                  'health',
                  'finance'
                ]}
                labelDictionary={{
                  work: '💼 工作',
                  personal: '👤 个人',
                  study: '📚 学习',
                  entertainment: '🎮 娱乐',
                  health: '🏥 健康',
                  finance: '💰 财务'
                }}
                withAll={true}
              />
            </Col>
            
            <Col span={12}>
              <div style={{ marginBottom: '16px' }}>
                <h5>动态选项配置:</h5>
                <pre style={{ backgroundColor: '#f5f5f5', padding: '8px', borderRadius: '4px', fontSize: '12px' }}>
{`// 基础选项
options: ['work', 'personal', 'study', ...]

// 标签字典
labelDictionary: {
  work: '💼 工作',
  personal: '👤 个人',
  study: '📚 学习',
  ...
}

// 自动转换为:
// [
//   { label: '💼 工作', value: 'work' },
//   { label: '👤 个人', value: 'personal' },
//   { label: '📚 学习', value: 'study' },
//   ...
// ]`}
                </pre>
              </div>
            </Col>
          </Row>
        </Card>

        <Card title="选项组合使用">
          <div style={{ marginBottom: '16px' }}>
            <h4>多种配置方式的组合使用</h4>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <h5>字符串 + 标签字典</h5>
              <CustomSegmentedFilter
                options={['pending', 'approved', 'rejected']}
                labelDictionary={{
                  pending: '⏳ 待审核',
                  approved: '✅ 已通过',
                  rejected: '❌ 已拒绝'
                }}
                withAll={{
                  label: '📋 全部状态',
                  value: 'all'
                }}
              />
            </div>
            
            <div>
              <h5>对象数组 + 自定义全部</h5>
              <CustomSegmentedFilter
                options={[
                  { label: '🌅 上午', value: 'morning' },
                  { label: '🌞 下午', value: 'afternoon' },
                  { label: '🌙 晚上', value: 'evening' }
                ]}
                withAll={{
                  label: '📅 全天',
                  value: 'all'
                }}
              />
            </div>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default ComplexOptionsDemo;
