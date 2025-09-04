import React, { useState } from 'react';
import { BasicModal, BasicButton, ConfigProvider } from '@actiontech/dms-kit';

const BasicModalCustomWidthDemo = () => {
  const [customVisible, setCustomVisible] = useState(false);

  return (
    <ConfigProvider>
      <BasicButton type="primary" onClick={() => setCustomVisible(true)}>
        自定义宽度弹窗
      </BasicButton>

      <BasicModal
        title="自定义宽度弹窗"
        visible={customVisible}
        width={600}
        onOk={() => setCustomVisible(false)}
        onCancel={() => setCustomVisible(false)}
      >
        <p>这个弹窗使用了自定义宽度 600px，覆盖了预设的尺寸。</p>
        <p>当预设尺寸不满足需求时，可以通过 width 属性设置任意宽度。</p>
        <p>自定义宽度适用于特殊的布局需求，如侧边栏弹窗、宽屏内容展示等。</p>
      </BasicModal>
    </ConfigProvider>
  );
};

export default BasicModalCustomWidthDemo;
