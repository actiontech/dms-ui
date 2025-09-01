import React, { useState } from 'react';
import { BasicModal, BasicButton, ConfigProvider } from '@actiontech/dms-kit';

const BasicModalDemo = () => {
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <ConfigProvider>
      <BasicButton type="primary" onClick={showModal}>
        打开弹窗
      </BasicButton>
      <BasicModal
        title="基础弹窗"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>这是一个基础的弹窗示例，展示了 BasicModal 的基本用法。</p>
        <p>弹窗内容可以包含任何 React 组件和 HTML 元素。</p>
      </BasicModal>
    </ConfigProvider>
  );
};

export default BasicModalDemo;
