import React, { useState } from 'react';
import { BasicEmpty, ConfigProvider } from '@actiontech/dms-kit';
import { Button, Space, Card, Switch, message } from 'antd';

const WithRefreshEmptyDemo = () => {
  const [loading, setLoading] = useState(false);
  const [dataLength, setDataLength] = useState(0);
  const [showRefresh, setShowRefresh] = useState(true);

  const handleRefresh = () => {
    setLoading(true);
    message.info('正在刷新数据...');
    
    // 模拟刷新数据
    setTimeout(() => {
      const newDataLength = Math.floor(Math.random() * 10) + 1;
      setDataLength(newDataLength);
      setLoading(false);
      message.success(`刷新成功，获取到 ${newDataLength} 条数据`);
    }, 2000);
  };

  const clearData = () => {
    setDataLength(0);
    message.info('数据已清空');
  };

  return (
    <ConfigProvider>
      <Card title="带刷新按钮" style={{ width: '100%' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Space>
              <Button onClick={handleRefresh} type="primary" loading={loading}>
                手动刷新
              </Button>
              <Button onClick={clearData} disabled={loading}>
                清空数据
              </Button>
            </Space>
            <span style={{ marginLeft: 16 }}>
              显示刷新按钮: <Switch checked={showRefresh} onChange={setShowRefresh} />
            </span>
          </div>

          <div style={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BasicEmpty
              loading={loading}
              dataLength={dataLength}
              onRefresh={showRefresh ? handleRefresh : undefined}
            >
              <div style={{ textAlign: 'center' }}>
                <h3>数据列表</h3>
                <p>当前共有 {dataLength} 条数据</p>
                <Space>
                  <Button size="small" onClick={handleRefresh}>
                    刷新数据
                  </Button>
                  <Button size="small" onClick={clearData}>
                    清空数据
                  </Button>
                </Space>
              </div>
            </BasicEmpty>
          </div>

          <div style={{ fontSize: 12, color: '#999' }}>
            提示：当 dataLength 为 0 且 onRefresh 存在时，会自动显示刷新按钮
          </div>
        </Space>
      </Card>
    </ConfigProvider>
  );
};

export default WithRefreshEmptyDemo;

