import React, { useState } from 'react';
import { BasicEmpty, ConfigProvider } from '@actiontech/dms-kit';
import { Button, Space, Card } from 'antd';

const BasicEmptyDemo = () => {
  const [dataLength, setDataLength] = useState(0);

  const addData = () => {
    setDataLength(dataLength + 1);
  };

  const removeData = () => {
    setDataLength(Math.max(0, dataLength - 1));
  };

  return (
    <ConfigProvider>
      <Card title="基础空状态组件" style={{ width: '100%' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Space>
              <Button onClick={addData} type="primary">
                添加数据
              </Button>
              <Button onClick={removeData} disabled={dataLength === 0}>
                减少数据
              </Button>
            </Space>
            <span style={{ marginLeft: 16 }}>
              当前数据量: <strong>{dataLength}</strong>
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
            <BasicEmpty dataLength={dataLength}>
              <div style={{ textAlign: 'center' }}>
                <h3>有数据时的内容</h3>
                <p>这里可以显示实际的数据内容</p>
              </div>
            </BasicEmpty>
          </div>
        </Space>
      </Card>
    </ConfigProvider>
  );
};

export default BasicEmptyDemo;

