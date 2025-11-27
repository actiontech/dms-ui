import React, { useState } from 'react';
import { BasicDrawer, BasicButton, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Form, Input, Typography, Divider } from 'antd';

const { Title, Paragraph } = Typography;

/**
 * 展示不同场景
 * - 基础用法：默认尺寸 (480px)
 * - 大尺寸：large 尺寸 (720px)
 * - 自定义关闭图标：showClosedIcon 控制
 * - 无内边距模式：noBodyPadding 便于自定义布局
 * - 表单场景：实际应用示例
 */
const BasicDrawerDemo = () => {
  const [openBasic, setOpenBasic] = useState(false);
  const [openLarge, setOpenLarge] = useState(false);
  const [openNoIcon, setOpenNoIcon] = useState(false);
  const [openNoPadding, setOpenNoPadding] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [form] = Form.useForm();

  const handleFormSubmit = () => {
    form.validateFields().then((values) => {
      console.log('表单提交:', values);
      setOpenForm(false);
      form.resetFields();
    });
  };

  return (
    <ConfigProvider>
      <Space wrap>
        <BasicButton type="primary" onClick={() => setOpenBasic(true)}>
          基础用法
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
        <BasicButton onClick={() => setOpenForm(true)}>表单抽屉</BasicButton>
      </Space>

      {/* 基础用法 */}
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
          你也可以通过 width 属性自定义任意宽度，例如：width="600"。
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

      {/* 表单抽屉 */}
      <BasicDrawer
        title="新建用户"
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          form.resetFields();
        }}
        maskClosable={false}
        destroyOnClose
        footer={
          <Space style={{ float: 'right' }}>
            <BasicButton onClick={() => setOpenForm(false)}>取消</BasicButton>
            <BasicButton type="primary" onClick={handleFormSubmit}>
              提交
            </BasicButton>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            label="手机号"
            name="phone"
            rules={[{ required: true, message: '请输入手机号' }]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea rows={4} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </BasicDrawer>
    </ConfigProvider>
  );
};

export default BasicDrawerDemo;
