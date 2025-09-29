import React from 'react';
import { ConfigProvider } from '@actiontech/dms-kit';
import { CopyIcon } from '@actiontech/dms-kit';
import { Space, Typography, Card } from 'antd';

const { Text } = Typography;

const NoTooltipDemo: React.FC = () => {
  return (
    <ConfigProvider>
      <Space direction="vertical" size="large">
        <div>
          <Text>禁用提示（tooltips=false）：</Text>
          <CopyIcon text="禁用提示的复制内容" tooltips={false} />
        </div>

        <div>
          <Text>在卡片中使用（无提示）：</Text>
          <Card size="small" style={{ width: 300 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Text>配置项：</Text>
              <CopyIcon text="database.host=localhost" tooltips={false} />
            </div>
          </Card>
        </div>

        <div>
          <Text>在表格行中使用（无提示）：</Text>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              border: '1px solid #f0f0f0',
              borderRadius: '6px'
            }}
          >
            <Text>用户 ID：</Text>
            <CopyIcon text="user_12345" tooltips={false} />
          </div>
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default NoTooltipDemo;
