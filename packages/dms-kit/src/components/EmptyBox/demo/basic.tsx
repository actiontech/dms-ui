import React, { useState } from 'react';
import { Space, Switch, Card, Alert, Tag, Empty } from 'antd';
import { EmptyBox } from '@actiontech/dms-kit';

/**
 * ## 基础使用
 *
 * 演示 EmptyBox 的基本功能：
 * - 条件渲染：根据 if 属性控制子组件的渲染
 * - 默认节点：条件为 false 时显示替代内容
 */
const BasicDemo: React.FC = () => {
  const [showContent, setShowContent] = useState(true);
  const [showWithDefault, setShowWithDefault] = useState(false);

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      {/* 基本条件渲染 */}
      <Card title="基本条件渲染" size="small">
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <span>显示内容：</span>
            <Switch
              checked={showContent}
              onChange={setShowContent}
              style={{ marginLeft: 8 }}
            />
            <Tag
              color={showContent ? 'green' : 'default'}
              style={{ marginLeft: 8 }}
            >
              {showContent ? '显示' : '隐藏'}
            </Tag>
          </div>

          <EmptyBox if={showContent}>
            <Alert
              message="这是条件渲染的内容"
              description="当开关打开时，这段内容会渲染；关闭时完全不渲染（从 DOM 中移除）"
              type="success"
              showIcon
            />
          </EmptyBox>
        </Space>
      </Card>

      {/* 使用 defaultNode */}
      <Card title="使用默认节点" size="small">
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <span>显示主内容：</span>
            <Switch
              checked={showWithDefault}
              onChange={setShowWithDefault}
              style={{ marginLeft: 8 }}
            />
            <Tag
              color={showWithDefault ? 'green' : 'orange'}
              style={{ marginLeft: 8 }}
            >
              {showWithDefault ? '主内容' : '默认内容'}
            </Tag>
          </div>

          <EmptyBox
            if={showWithDefault}
            defaultNode={
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="主内容未加载，这是默认显示的内容"
              />
            }
          >
            <Alert
              message="这是主内容"
              description="条件满足时显示此内容，不满足时显示 defaultNode"
              type="info"
              showIcon
            />
          </EmptyBox>
        </Space>
      </Card>
    </Space>
  );
};

export default BasicDemo;
