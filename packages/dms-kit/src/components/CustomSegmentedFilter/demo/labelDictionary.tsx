import React, { useState } from 'react';
import { Card, Space, Tag, Divider } from 'antd';
import { CustomSegmentedFilter, ConfigProvider } from '@actiontech/dms-kit';

const LabelDictionaryDemo: React.FC = () => {
  const [status, setStatus] = useState<string>('all');
  const [priority, setPriority] = useState<string>('normal');

  // 状态标签字典
  const statusDictionary = {
    all: '全部',
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

  // 任务类型标签字典
  const taskTypeDictionary = {
    data_sync: '数据同步',
    backup: '数据备份',
    restore: '数据恢复',
    migration: '数据迁移',
    cleanup: '数据清理'
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>标签字典支持</h3>

        <Card title="状态过滤（使用标签字典）" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginRight: '8px' }}>当前选中:</span>
            <Tag color="blue">
              {statusDictionary[status as keyof typeof statusDictionary] ||
                status}
            </Tag>
          </div>
          <CustomSegmentedFilter
            value={status}
            onChange={setStatus}
            options={['all', 'processing', 'finished', 'failed', 'cancelled']}
            labelDictionary={statusDictionary}
          />

          <Divider />

          <div>
            <h4>标签字典配置:</h4>
            <pre
              style={{
                backgroundColor: '#f5f5f5',
                padding: '12px',
                borderRadius: '4px'
              }}
            >
              {`const statusDictionary = {
  all: '全部',
  processing: '进行中',
  finished: '已完成',
  failed: '已失败',
  cancelled: '已取消'
};`}
            </pre>
          </div>
        </Card>

        <Card
          title="优先级过滤（使用标签字典）"
          style={{ marginBottom: '20px' }}
        >
          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginRight: '8px' }}>当前选中:</span>
            <Tag color="green">
              {priorityDictionary[
                priority as keyof typeof priorityDictionary
              ] || priority}
            </Tag>
          </div>
          <CustomSegmentedFilter
            value={priority}
            onChange={setPriority}
            options={['low', 'normal', 'high', 'urgent']}
            labelDictionary={priorityDictionary}
          />

          <Divider />

          <div>
            <h4>标签字典配置:</h4>
            <pre
              style={{
                backgroundColor: '#f5f5f5',
                padding: '12px',
                borderRadius: '4px'
              }}
            >
              {`const priorityDictionary = {
  low: '低优先级',
  normal: '普通优先级',
  high: '高优先级',
  urgent: '紧急优先级'
};`}
            </pre>
          </div>
        </Card>

        <Card title="任务类型过滤（使用标签字典）">
          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginRight: '8px' }}>当前选中:</span>
            <Tag color="orange">请选择</Tag>
          </div>
          <CustomSegmentedFilter
            options={['data_sync', 'backup', 'restore', 'migration', 'cleanup']}
            labelDictionary={taskTypeDictionary}
            withAll={true}
          />

          <Divider />

          <div>
            <h4>标签字典配置:</h4>
            <pre
              style={{
                backgroundColor: '#f5f5f5',
                padding: '12px',
                borderRadius: '4px'
              }}
            >
              {`const taskTypeDictionary = {
  data_sync: '数据同步',
  backup: '数据备份',
  restore: '数据恢复',
  migration: '数据迁移',
  cleanup: '数据清理'
};`}
            </pre>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default LabelDictionaryDemo;
