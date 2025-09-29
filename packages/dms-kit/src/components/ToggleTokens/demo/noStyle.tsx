import React, { useState } from 'react';
import { Card, Space, Tag, Divider } from 'antd';
import { ToggleTokens, ConfigProvider } from '@actiontech/dms-kit';

const NoStyleDemo: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'work'
  ]);
  const [selectedTags, setSelectedTags] = useState<string[]>(['urgent']);
  const [selectedStatus, setSelectedStatus] = useState<string>('active');

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>无样式模式</h3>

        <Card title="分类选择 (无样式)" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginRight: '8px' }}>当前选中:</span>
            {selectedCategories.length > 0 ? (
              selectedCategories.map((category) => (
                <Tag
                  key={category}
                  color="blue"
                  style={{ marginBottom: '4px' }}
                >
                  {category}
                </Tag>
              ))
            ) : (
              <Tag color="default">无选择</Tag>
            )}
          </div>
          <ToggleTokens
            value={selectedCategories}
            onChange={setSelectedCategories}
            options={[
              { label: '工作', value: 'work' },
              { label: '个人', value: 'personal' },
              { label: '学习', value: 'study' },
              { label: '娱乐', value: 'entertainment' }
            ]}
            multiple={true}
            noStyle={true}
          />

          <Divider />

          <div>
            <h4>无样式模式特点:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>清空所有默认样式</li>
              <li>用户可以通过 CSS 类进行完全自定义</li>
              <li>提供最大的样式自定义自由度</li>
              <li>适合需要特殊样式的场景</li>
            </ul>
          </div>
        </Card>

        <Card title="标签选择 (无样式)" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginRight: '8px' }}>当前选中:</span>
            {selectedTags.length > 0 ? (
              selectedTags.map((tag) => (
                <Tag key={tag} color="green" style={{ marginBottom: '4px' }}>
                  {tag}
                </Tag>
              ))
            ) : (
              <Tag color="default">无选择</Tag>
            )}
          </div>
          <ToggleTokens
            value={selectedTags}
            onChange={setSelectedTags}
            options={[
              { label: '紧急', value: 'urgent' },
              { label: '重要', value: 'important' },
              { label: '普通', value: 'normal' },
              { label: '低优先级', value: 'low' }
            ]}
            multiple={true}
            noStyle={true}
          />
        </Card>

        <Card title="状态选择 (无样式)">
          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginRight: '8px' }}>当前选中:</span>
            <Tag color="orange">{selectedStatus}</Tag>
          </div>
          <ToggleTokens
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={[
              { label: '活跃', value: 'active' },
              { label: '暂停', value: 'paused' },
              { label: '完成', value: 'completed' },
              { label: '取消', value: 'cancelled' }
            ]}
            multiple={false}
            noStyle={true}
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
              {`noStyle={true} // 启用无样式模式

// 清空所有默认样式
// 可以通过 CSS 类进行完全自定义
// 支持单选和多选模式`}
            </pre>
          </div>

          <div style={{ marginTop: '16px' }}>
            <h4>自定义样式示例:</h4>
            <pre
              style={{
                backgroundColor: '#f5f5f5',
                padding: '12px',
                borderRadius: '4px'
              }}
            >
              {`/* 自定义无样式令牌的样式 */
.toggle-token-item-no-style {
  padding: 8px 16px;
  margin: 4px;
  border: 2px dashed #d9d9d9;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.toggle-token-item-no-style:hover {
  border-color: #1890ff;
  background-color: #f0f8ff;
}

.toggle-token-item-no-style-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toggle-token-item-checked {
  border-color: #52c41a;
  background-color: #f6ffed;
}`}
            </pre>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default NoStyleDemo;
