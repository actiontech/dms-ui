import React from 'react';
import { BasicTag } from '@actiontech/dms-kit';
import { ConfigProvider } from '@actiontech/dms-kit';
import { Space, Typography } from 'antd';

const { Title } = Typography;

const BasicTagStatusDemo = () => {
  const statusData = [
    { status: 'success', text: '成功', count: 12 },
    { status: 'processing', text: '处理中', count: 5 },
    { status: 'error', text: '失败', count: 2 },
    { status: 'default', text: '待处理', count: 8 }
  ];

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      success: 'green',
      processing: 'blue',
      error: 'red',
      default: 'default'
    };
    return colorMap[status] || 'default';
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <Title level={4}>状态标签</Title>
        <Space size={[0, 8]} wrap>
          {statusData.map((item) => (
            <BasicTag
              key={item.status}
              color={getStatusColor(item.status) as any}
            >
              {item.text} ({item.count})
            </BasicTag>
          ))}
        </Space>
      </div>
    </ConfigProvider>
  );
};

export default BasicTagStatusDemo;
