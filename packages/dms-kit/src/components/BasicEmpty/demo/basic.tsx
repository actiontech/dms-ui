import React, { useState } from 'react';
import { BasicEmpty, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Typography } from 'antd';

const { Title } = Typography;

/**
 * 展示不同状态
 * - 加载状态：loading = true
 * - 错误状态：errorInfo 存在
 * - 空状态：dataLength = 0
 */
const BasicEmptyDemo = () => {
  const [refreshCount, setRefreshCount] = useState(0);

  const handleRefresh = () => {
    setRefreshCount(refreshCount + 1);
  };

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={5}>加载状态</Title>
          <div
            style={{
              minHeight: 150,
              border: '1px solid #f0f0f0',
              borderRadius: 4,
              padding: 16
            }}
          >
            <BasicEmpty loading dataLength={0} />
          </div>
        </div>

        <div>
          <Title level={5}>错误状态（带刷新按钮）</Title>
          <div
            style={{
              minHeight: 150,
              border: '1px solid #f0f0f0',
              borderRadius: 4,
              padding: 16
            }}
          >
            <BasicEmpty
              errorTitle="网络连接失败"
              errorInfo="请检查网络连接后重试"
              dataLength={0}
              onRefresh={handleRefresh}
            />
          </div>
        </div>

        <div>
          <Title level={5}>空状态</Title>
          <div
            style={{
              minHeight: 150,
              border: '1px solid #f0f0f0',
              borderRadius: 4,
              padding: 16
            }}
          >
            <BasicEmpty dataLength={0} />
          </div>
        </div>

        <div>
          <Title level={5}>自定义空状态内容</Title>
          <div
            style={{
              minHeight: 150,
              border: '1px solid #f0f0f0',
              borderRadius: 4,
              padding: 16
            }}
          >
            <BasicEmpty emptyCont="暂无用户数据，请添加用户" dataLength={0} />
          </div>
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default BasicEmptyDemo;
