import React, { useState } from 'react';
import { Space, Divider } from 'antd';
import { CustomSegmentedFilter, ConfigProvider } from '@actiontech/dms-kit';

/**
 * 标签字典
 * - 字符串选项 + 标签字典实现国际化
 * - 自动转换显示标签
 * - 适合多语言场景
 */
const LabelDictionaryDemo: React.FC = () => {
  const [status, setStatus] = useState<string>('processing');
  const [priority, setPriority] = useState<string>('normal');

  // 状态标签字典
  const statusDictionary = {
    processing: '进行中',
    finished: '已完成',
    failed: '已失败',
    cancelled: '已取消'
  };

  // 优先级标签字典
  const priorityDictionary = {
    low: '低优先级',
    normal: '普通优先级',
    high: '高优先级',
    urgent: '紧急优先级'
  };

  // 类型标签字典（带表情符号）
  const typeDictionary = {
    document: '📄 文档',
    image: '🖼️ 图片',
    video: '🎥 视频',
    audio: '🎵 音频'
  };

  return (
    <ConfigProvider>
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* 基础标签字典 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>
          状态过滤（标签字典）：
        </div>
        <div style={{ width: 'max-content' }}>
          <CustomSegmentedFilter
            value={status}
            onChange={setStatus}
            options={['processing', 'finished', 'failed', 'cancelled']}
            labelDictionary={statusDictionary}
          />
        </div>

        <Divider />

        {/* 优先级标签字典 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>
          优先级过滤（标签字典）：
        </div>
        <div style={{ width: 'max-content' }}>
          <CustomSegmentedFilter
            value={priority}
            onChange={setPriority}
            options={['low', 'normal', 'high', 'urgent']}
            labelDictionary={priorityDictionary}
          />
        </div>

        <Divider />

        {/* 带表情符号的标签字典 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>
          类型过滤（带表情符号）：
        </div>
        <div style={{ width: 'max-content' }}>
          <CustomSegmentedFilter
            options={['document', 'image', 'video', 'audio']}
            labelDictionary={typeDictionary}
          />
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default LabelDictionaryDemo;
