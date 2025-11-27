import React, { useState } from 'react';
import { BasicDrawer, BasicButton, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Typography, Divider } from 'antd';

const { Title, Paragraph } = Typography;

/**
 * 基础用法
 * - 默认尺寸 (480px)
 * - 大尺寸 (720px)
 * - 无关闭图标
 * - 无内边距模式
 */
const BasicDrawerDemo = () => {
  const [openBasic, setOpenBasic] = useState(false);
  const [openLarge, setOpenLarge] = useState(false);
  const [openNoIcon, setOpenNoIcon] = useState(false);
  const [openNoPadding, setOpenNoPadding] = useState(false);

  return (
    <ConfigProvider>
      <Space wrap>
        <BasicButton type="primary" onClick={() => setOpenBasic(true)}>
          默认尺寸
        </BasicButton>
        <BasicButton onClick={() => setOpenLarge(true)}>
          大尺寸 (large)
        </BasicButton>
        <BasicButton onClick={() => setOpenNoIcon(true)}>
          无关闭图标
        </BasicButton>
        <BasicButton onClick={() => setOpenNoPadding(true)}>
          无内边距模式
        </BasicButton>
      </Space>

      {/* 默认尺寸 */}
      <BasicDrawer
        title="基础抽屉"
        open={openBasic}
        onClose={() => setOpenBasic(false)}
      >
        <Title level={5}>默认尺寸 (480px)</Title>
        <Paragraph>
          这是一个基础的抽屉示例，展示了 BasicDrawer 的基本用法。
        </Paragraph>
        <Paragraph>抽屉内容可以包含任何 React 组件和 HTML 元素。</Paragraph>
        <Paragraph>默认情况下，抽屉会从右侧滑出，宽度为 480px。</Paragraph>
      </BasicDrawer>

      {/* 大尺寸 */}
      <BasicDrawer
        title="大尺寸抽屉"
        size="large"
        open={openLarge}
        onClose={() => setOpenLarge(false)}
      >
        <Title level={5}>Large 尺寸 (720px)</Title>
        <Paragraph>
          适用于复杂表单、详细内容展示等需要更多空间的场景。
        </Paragraph>
        <Paragraph>通过 size="large" 设置，宽度为 720px。</Paragraph>
        <Divider />
        <Paragraph>
          你也可以通过 width 属性自定义任意宽度，例如：width={'{600}'}。
        </Paragraph>
      </BasicDrawer>

      {/* 无关闭图标 */}
      <BasicDrawer
        title="无关闭图标"
        showClosedIcon={false}
        open={openNoIcon}
        onClose={() => setOpenNoIcon(false)}
      >
        <Paragraph>
          设置 showClosedIcon={'{false}'} 可以隐藏自定义关闭图标。
        </Paragraph>
        <Paragraph>点击遮罩层或使用 ESC 键关闭抽屉。</Paragraph>
      </BasicDrawer>

      {/* 无内边距模式 */}
      <BasicDrawer
        title="无内边距模式"
        noBodyPadding
        open={openNoPadding}
        onClose={() => setOpenNoPadding(false)}
      >
        <div style={{ padding: '16px 24px', backgroundColor: '#f5f5f5' }}>
          <Paragraph>
            设置 noBodyPadding={'{true}'} 可以移除内容区域的默认内边距。
          </Paragraph>
        </div>
        <div style={{ padding: '16px 24px' }}>
          <Paragraph>这样你可以自由控制内容区域的布局和间距。</Paragraph>
        </div>
        <div style={{ padding: '16px 24px', backgroundColor: '#f5f5f5' }}>
          <Paragraph>例如创建分块布局，每块有不同的背景色。</Paragraph>
        </div>
      </BasicDrawer>
    </ConfigProvider>
  );
};

export default BasicDrawerDemo;
