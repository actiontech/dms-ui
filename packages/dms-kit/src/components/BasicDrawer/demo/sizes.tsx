import React, { useState } from 'react';
import { BasicDrawer, BasicButton, ConfigProvider } from '@actiontech/dms-kit';
import { Space } from 'antd';

const BasicDrawerSizesDemo = () => {
  const [defaultVisible, setDefaultVisible] = useState(false);
  const [largeVisible, setLargeVisible] = useState(false);

  return (
    <ConfigProvider>
      <Space>
        <BasicButton type="primary" onClick={() => setDefaultVisible(true)}>
          默认尺寸抽屉
        </BasicButton>
        <BasicButton type="primary" onClick={() => setLargeVisible(true)}>
          大尺寸抽屉
        </BasicButton>
      </Space>

      <BasicDrawer
        title="默认尺寸抽屉"
        placement="right"
        visible={defaultVisible}
        size="default"
        onClose={() => setDefaultVisible(false)}
      >
        <p>这是默认尺寸抽屉 (480px)，适用于简单的配置面板和信息展示。</p>
        <p>内容较少时建议使用默认尺寸抽屉。</p>
        <p>默认尺寸抽屉提供了合适的空间，不会占用过多的屏幕空间。</p>
      </BasicDrawer>

      <BasicDrawer
        title="大尺寸抽屉"
        placement="right"
        visible={largeVisible}
        size="large"
        onClose={() => setLargeVisible(false)}
      >
        <p>这是大尺寸抽屉 (720px)，适用于复杂的内容展示和表单操作。</p>
        <p>当需要展示更多内容或复杂表单时，建议使用大尺寸抽屉。</p>
        <p>大尺寸抽屉提供了更宽敞的空间，可以容纳更多的信息和交互元素。</p>
        <p>特别适合需要多列布局或复杂表单的场景。</p>
      </BasicDrawer>
    </ConfigProvider>
  );
};

export default BasicDrawerSizesDemo;
