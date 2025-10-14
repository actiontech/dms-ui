import React, { useState } from 'react';
import { BasicModal, BasicButton, ConfigProvider } from '@actiontech/dms-kit';
import { Space } from 'antd';

const BasicModalSizesDemo = () => {
  const [smallVisible, setSmallVisible] = useState(false);
  const [largeVisible, setLargeVisible] = useState(false);

  return (
    <ConfigProvider>
      <Space>
        <BasicButton type="primary" onClick={() => setSmallVisible(true)}>
          小尺寸弹窗
        </BasicButton>
        <BasicButton type="primary" onClick={() => setLargeVisible(true)}>
          大尺寸弹窗
        </BasicButton>
      </Space>

      <BasicModal
        title="小尺寸弹窗"
        visible={smallVisible}
        size="small"
        onOk={() => setSmallVisible(false)}
        onCancel={() => setSmallVisible(false)}
      >
        <p>这是小尺寸弹窗 (480px)，适用于简单的信息展示和确认操作。</p>
        <p>内容较少时建议使用小尺寸弹窗。</p>
      </BasicModal>

      <BasicModal
        title="大尺寸弹窗"
        visible={largeVisible}
        size="large"
        onOk={() => setLargeVisible(false)}
        onCancel={() => setLargeVisible(false)}
      >
        <p>这是大尺寸弹窗 (960px)，适用于复杂的内容展示和表单操作。</p>
        <p>当需要展示更多内容或复杂表单时，建议使用大尺寸弹窗。</p>
        <p>大尺寸弹窗提供了更宽敞的空间，可以容纳更多的信息和交互元素。</p>
      </BasicModal>
    </ConfigProvider>
  );
};

export default BasicModalSizesDemo;
