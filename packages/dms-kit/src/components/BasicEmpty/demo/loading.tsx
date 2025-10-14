import React, { useState } from 'react';
import { BasicEmpty, ConfigProvider } from '@actiontech/dms-kit';
import { Button, Space, Card, Switch } from 'antd';

const LoadingEmptyDemo = () => {
  const [loading, setLoading] = useState(false);
  const [dataLength, setDataLength] = useState(0);

  const simulateLoading = () => {
    setLoading(true);
    setDataLength(0);

    // 模拟异步加载
    setTimeout(() => {
      setLoading(false);
      setDataLength(5);
    }, 3000);
  };

  const clearData = () => {
    setDataLength(0);
  };

  return (
    <ConfigProvider>
      <Card title="加载状态" style={{ width: '100%' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Space>
              <Button
                onClick={simulateLoading}
                type="primary"
                loading={loading}
              >
                模拟加载数据
              </Button>
              <Button onClick={clearData} disabled={loading}>
                清空数据
              </Button>
            </Space>
            <span style={{ marginLeft: 16 }}>
              加载状态: <Switch checked={loading} disabled />
              {loading ? ' 加载中...' : ' 已完成'}
            </span>
          </div>

          <div
            style={{
              minHeight: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <BasicEmpty loading={loading} dataLength={dataLength}>
              <div style={{ textAlign: 'center' }}>
                <h3>数据加载完成</h3>
                <p>共加载了 {dataLength} 条数据</p>
              </div>
            </BasicEmpty>
          </div>
        </Space>
      </Card>
    </ConfigProvider>
  );
};

export default LoadingEmptyDemo;

