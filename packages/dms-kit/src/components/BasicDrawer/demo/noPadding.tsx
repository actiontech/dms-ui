import React, { useState } from 'react';
import { BasicDrawer, BasicButton, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Card, Row, Col } from 'antd';

const BasicDrawerNoPaddingDemo = () => {
  const [normalVisible, setNormalVisible] = useState(false);
  const [noPaddingVisible, setNoPaddingVisible] = useState(false);

  return (
    <ConfigProvider>
      <Space>
        <BasicButton type="primary" onClick={() => setNormalVisible(true)}>
          标准内边距
        </BasicButton>
        <BasicButton type="primary" onClick={() => setNoPaddingVisible(true)}>
          无内边距模式
        </BasicButton>
      </Space>

      <BasicDrawer
        title="标准内边距抽屉"
        placement="right"
        visible={normalVisible}
        onClose={() => setNormalVisible(false)}
      >
        <p>这是标准内边距的抽屉，内容区域有 24px 的内边距。</p>
        <p>标准内边距提供了良好的视觉层次和阅读体验。</p>
        <p>适用于大多数内容展示场景。</p>
      </BasicDrawer>

      <BasicDrawer
        title="无内边距模式抽屉"
        placement="right"
        visible={noPaddingVisible}
        noBodyPadding={true}
        onClose={() => setNoPaddingVisible(false)}
      >
        <div style={{ padding: '0 24px' }}>
          <h3>自定义布局</h3>
          <p>这个抽屉使用了 noBodyPadding 模式，移除了默认的内边距。</p>
          <p>可以完全自定义内容的布局和间距。</p>
        </div>

        <Row gutter={[16, 16]} style={{ padding: '0 24px', marginTop: 16 }}>
          <Col span={12}>
            <Card title="卡片 1" size="small">
              <p>这是第一个卡片内容</p>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="卡片 2" size="small">
              <p>这是第二个卡片内容</p>
            </Card>
          </Col>
        </Row>

        <div
          style={{
            padding: '24px',
            backgroundColor: '#f5f5f5',
            margin: '16px 24px'
          }}
        >
          <p>这个区域使用了自定义的内边距和背景色。</p>
          <p>无内边距模式让布局更加灵活。</p>
        </div>
      </BasicDrawer>
    </ConfigProvider>
  );
};

export default BasicDrawerNoPaddingDemo;
