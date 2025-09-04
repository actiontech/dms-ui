import React from 'react';
import { ConfigProvider } from '@actiontech/dms-kit';
import { Space } from 'antd';
import { BasicInfoList } from '@actiontech/dms-kit';

const BasicInfoListErrorDemo: React.FC = () => {
  const data = [
    { key: '数据库名称', value: 'production_db' },
    { key: '连接状态', value: '已连接' },
    { key: '版本信息', value: 'MySQL 8.0' }
  ];

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <BasicInfoList title="正常状态" data={data} columnNumber={3} />

        <BasicInfoList
          title="网络错误"
          data={data}
          columnNumber={3}
          errorInfo="网络连接失败，请检查网络设置"
          errorTitle="连接错误"
        />

        <BasicInfoList
          title="权限错误"
          data={data}
          columnNumber={3}
          errorInfo="没有访问权限，请联系管理员"
          errorTitle="权限不足"
        />
      </Space>
    </ConfigProvider>
  );
};

export default BasicInfoListErrorDemo;
