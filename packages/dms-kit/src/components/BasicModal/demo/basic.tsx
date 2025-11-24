import React, { useState } from 'react';
import { BasicModal, BasicButton, ConfigProvider } from '@actiontech/dms-kit';
import { Space } from 'antd';

/**
 * 基础用法
 * - 简单的弹窗展示
 * - 支持不同尺寸预设
 * - 支持自定义宽度
 */
const BasicModalDemo = () => {
  const [smallVisible, setSmallVisible] = useState(false);
  const [largeVisible, setLargeVisible] = useState(false);
  const [customVisible, setCustomVisible] = useState(false);
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLoadingOk = () => {
    setLoading(true);
    // 模拟异步操作
    setTimeout(() => {
      setLoading(false);
      setLoadingVisible(false);
    }, 2000);
  };

  return (
    <ConfigProvider>
      <Space>
        <BasicButton type="primary" onClick={() => setSmallVisible(true)}>
          小尺寸弹窗 (480px)
        </BasicButton>
        <BasicButton type="primary" onClick={() => setLargeVisible(true)}>
          大尺寸弹窗 (960px)
        </BasicButton>
        <BasicButton type="primary" onClick={() => setCustomVisible(true)}>
          自定义宽度 (600px)
        </BasicButton>
        <BasicButton type="primary" onClick={() => setLoadingVisible(true)}>
          加载状态弹窗
        </BasicButton>
      </Space>

      <BasicModal
        title="小尺寸弹窗"
        open={smallVisible}
        size="small"
        onOk={() => setSmallVisible(false)}
        onCancel={() => setSmallVisible(false)}
      >
        <p>这是一个小尺寸弹窗 (480px)，适用于简单内容展示。</p>
        <p>弹窗内容可以包含任何 React 组件和 HTML 元素。</p>
      </BasicModal>

      <BasicModal
        title="大尺寸弹窗"
        open={largeVisible}
        size="large"
        onOk={() => setLargeVisible(false)}
        onCancel={() => setLargeVisible(false)}
      >
        <p>这是一个大尺寸弹窗 (960px)，适用于复杂内容或详细信息展示。</p>
        <p>例如：复杂表单、详细配置、数据详情等场景。</p>
      </BasicModal>

      <BasicModal
        title="自定义宽度弹窗"
        open={customVisible}
        width={600}
        onOk={() => setCustomVisible(false)}
        onCancel={() => setCustomVisible(false)}
      >
        <p>通过 width 属性可以自定义弹窗宽度。</p>
        <p>当前宽度为 600px，覆盖了 size 属性的预设值。</p>
      </BasicModal>

      <BasicModal
        title="提交中"
        open={loadingVisible}
        confirmLoading={loading}
        onOk={handleLoadingOk}
        onCancel={() => setLoadingVisible(false)}
        okText="提交"
      >
        <p>点击提交按钮后，按钮会显示加载状态。</p>
        <p>这可以防止用户重复提交操作。</p>
      </BasicModal>
    </ConfigProvider>
  );
};

export default BasicModalDemo;
