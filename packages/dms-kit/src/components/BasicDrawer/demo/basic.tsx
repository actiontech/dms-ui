import React, { useState } from 'react';
import { BasicDrawer, BasicButton, ConfigProvider } from '@actiontech/dms-kit';

const BasicDrawerDemo = () => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <ConfigProvider>
      <BasicButton type="primary" onClick={showDrawer}>
        打开抽屉
      </BasicButton>

      <BasicDrawer
        title="基础抽屉"
        placement="right"
        visible={visible}
        onClose={onClose}
      >
        <p>这是一个基础的抽屉示例，展示了 BasicDrawer 的基本用法。</p>
        <p>抽屉内容可以包含任何 React 组件和 HTML 元素。</p>
        <p>默认情况下，抽屉会从右侧滑出，宽度为 480px。</p>
      </BasicDrawer>
    </ConfigProvider>
  );
};

export default BasicDrawerDemo;
