import React, { useState } from 'react';
import { Button, Divider } from 'antd';
import { SpinIndicator, ConfigProvider } from '@actiontech/dms-kit';
import { styled } from '@mui/material';
/**
 * 集成使用
 * - 按钮中使用
 * - 页面加载状态
 */

// 覆盖默认的绝对定位
const DemoWrapper = styled('div')`
  .custom-icon-spin-dot {
    position: static !important;
    margin: 0 !important;
  }
`;

const IntegrationDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleLoad = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
  };

  return (
    <ConfigProvider>
      <DemoWrapper>
        {/* 按钮中使用 */}
        <div style={{ marginBottom: '24px' }}>
          <Button
            type="primary"
            onClick={handleLoad}
            loading={loading}
            icon={
              loading ? <SpinIndicator width={16} height={20} /> : undefined
            }
          >
            {loading ? '加载中...' : '点击加载'}
          </Button>
        </div>

        <Divider />

        {/* 页面加载状态 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px',
            border: '1px dashed #d9d9d9',
            borderRadius: '8px'
          }}
        >
          {loading ? (
            <div style={{ textAlign: 'center', color: '#1890ff' }}>
              <SpinIndicator width={48} height={60} />
              <div style={{ marginTop: '16px', color: '#666' }}>加载中...</div>
            </div>
          ) : (
            <div style={{ color: '#666' }}>点击上方按钮查看加载效果</div>
          )}
        </div>
      </DemoWrapper>
    </ConfigProvider>
  );
};

export default IntegrationDemo;
