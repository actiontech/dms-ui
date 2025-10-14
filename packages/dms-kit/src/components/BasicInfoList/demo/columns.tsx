import React from 'react';
import { ConfigProvider } from '@actiontech/dms-kit';
import { Space } from 'antd';
import { BasicInfoList } from '@actiontech/dms-kit';

const BasicInfoListColumnsDemo: React.FC = () => {
  const data = [
    { key: '服务器名称', value: 'web-server-01' },
    { key: 'IP地址', value: '192.168.1.100' },
    { key: '操作系统', value: 'Ubuntu 20.04' },
    { key: 'CPU核心数', value: '8核' },
    { key: '内存大小', value: '16GB' },
    { key: '磁盘空间', value: '500GB' },
    { key: '运行状态', value: '正常' },
    { key: '最后更新', value: '2024-01-15 10:30:00' }
  ];

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <BasicInfoList title="2列布局" data={data} columnNumber={2} />

        <BasicInfoList title="4列布局" data={data} columnNumber={4} />
      </Space>
    </ConfigProvider>
  );
};

export default BasicInfoListColumnsDemo;
