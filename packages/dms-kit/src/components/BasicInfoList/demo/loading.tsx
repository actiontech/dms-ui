import React from 'react';
import { ConfigProvider } from '@actiontech/dms-kit';
import { Space, Button } from 'antd';
import { useState } from 'react';
import { BasicInfoList } from '@actiontech/dms-kit';

const BasicInfoListLoadingDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const mockLoadData = () => {
    setLoading(true);
    setData([]);

    // 模拟异步加载
    setTimeout(() => {
      const mockData = [
        { key: '用户ID', value: 'U001' },
        { key: '用户名', value: 'john_doe' },
        { key: '邮箱', value: 'john@example.com' },
        { key: '注册时间', value: '2024-01-01' },
        { key: '最后登录', value: '2024-01-15' },
        { key: '账户状态', value: '活跃' }
      ];
      setData(mockData);
      setLoading(false);
    }, 2000);
  };

  const clearData = () => {
    setData([]);
  };

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space>
          <Button type="primary" onClick={mockLoadData}>
            加载数据
          </Button>
          <Button onClick={clearData}>清空数据</Button>
        </Space>

        <BasicInfoList
          title="用户信息"
          data={data}
          columnNumber={3}
          loading={loading}
        />
      </Space>
    </ConfigProvider>
  );
};

export default BasicInfoListLoadingDemo;
