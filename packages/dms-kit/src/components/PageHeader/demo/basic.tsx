import React from 'react';
import { PageHeader, ConfigProvider } from '@actiontech/dms-kit';

const BasicDemo: React.FC = () => {
  return (
    <ConfigProvider>
      <PageHeader title="用户管理" />
    </ConfigProvider>
  );
};

export default BasicDemo;
