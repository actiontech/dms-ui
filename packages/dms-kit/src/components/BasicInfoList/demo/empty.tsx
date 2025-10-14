import React from 'react';
import { ConfigProvider } from '@actiontech/dms-kit';
import { Space } from 'antd';
import { BasicInfoList } from '@actiontech/dms-kit';

const BasicInfoListEmptyDemo: React.FC = () => {
  const emptyData: any[] = [];

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <BasicInfoList title="空数据状态" data={emptyData} columnNumber={3} />

        <BasicInfoList title="无标题空状态" data={emptyData} columnNumber={3} />
      </Space>
    </ConfigProvider>
  );
};

export default BasicInfoListEmptyDemo;
