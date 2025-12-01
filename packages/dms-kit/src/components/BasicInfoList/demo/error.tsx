import React, { useState } from 'react';
import { ConfigProvider, BasicInfoList } from '@actiontech/dms-kit';
import { Space, Button } from 'antd';

/**
 * 错误和加载状态
 * - 加载状态展示
 * - 错误状态处理
 * - 空数据状态
 */
const BasicInfoListErrorDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const data = [
    { key: '数据库名称', value: 'production_db' },
    { key: '连接状态', value: '已连接' },
    { key: '版本信息', value: 'MySQL 8.0' },
    { key: '字符集', value: 'utf8mb4' },
    { key: '端口', value: '3306' }
  ];

  const handleLoadData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Button onClick={handleLoadData} style={{ marginBottom: 16 }}>
            模拟加载数据
          </Button>
          <BasicInfoList
            title="加载状态"
            data={data}
            columnNumber={3}
            loading={loading}
          />
        </div>

        <BasicInfoList
          title="网络错误"
          data={data}
          columnNumber={3}
          errorInfo="网络连接失败，请检查网络设置后重试"
          errorTitle="连接错误"
        />

        <BasicInfoList
          title="权限错误"
          data={data}
          columnNumber={3}
          errorInfo="没有访问权限，请联系管理员获取权限"
          errorTitle="权限不足"
        />

        <BasicInfoList title="空数据状态" data={[]} columnNumber={3} />
      </Space>
    </ConfigProvider>
  );
};

export default BasicInfoListErrorDemo;
