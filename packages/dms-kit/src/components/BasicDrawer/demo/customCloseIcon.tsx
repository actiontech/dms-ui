import React, { useState } from 'react';
import { BasicDrawer, BasicButton, ConfigProvider } from '@actiontech/dms-kit';
import { Space } from 'antd';

const BasicDrawerCustomCloseIconDemo = () => {
  const [withIconVisible, setWithIconVisible] = useState(false);
  const [withoutIconVisible, setWithoutIconVisible] = useState(false);

  return (
    <ConfigProvider>
      <Space>
        <BasicButton type="primary" onClick={() => setWithIconVisible(true)}>
          显示关闭图标
        </BasicButton>
        <BasicButton type="primary" onClick={() => setWithoutIconVisible(true)}>
          隐藏关闭图标
        </BasicButton>
      </Space>

      <BasicDrawer
        title="显示关闭图标"
        placement="right"
        visible={withIconVisible}
        showClosedIcon={true}
        onClose={() => setWithIconVisible(false)}
      >
        <p>这个抽屉显示了自定义的关闭图标。</p>
        <p>关闭图标位于右上角，点击可以关闭抽屉。</p>
        <p>默认情况下，showClosedIcon 为 true，会显示关闭图标。</p>
      </BasicDrawer>

      <BasicDrawer
        title="隐藏关闭图标"
        placement="right"
        visible={withoutIconVisible}
        showClosedIcon={false}
        onClose={() => setWithoutIconVisible(false)}
      >
        <p>这个抽屉隐藏了关闭图标。</p>
        <p>当 showClosedIcon 设置为 false 时，不会显示关闭图标。</p>
        <p>用户仍然可以通过点击遮罩层或按 ESC 键来关闭抽屉。</p>
        <p>适用于需要自定义关闭逻辑的场景。</p>
      </BasicDrawer>
    </ConfigProvider>
  );
};

export default BasicDrawerCustomCloseIconDemo;
