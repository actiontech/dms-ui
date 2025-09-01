import React from 'react';
import { ConfigProvider } from '@actiontech/dms-kit';
import { BasicInfoList } from '@actiontech/dms-kit';

const BasicInfoListBasicDemo: React.FC = () => {
  const data = [
    { key: '项目名称', value: 'DMS 数据管理系统' },
    { key: '项目版本', value: 'v2.1.0' },
    { key: '创建时间', value: '2024-01-15' },
    { key: '项目状态', value: '进行中' },
    { key: '负责人', value: '张三' },
    { key: '团队规模', value: '15人' }
  ];

  return (
    <ConfigProvider>
      <BasicInfoList title="项目基本信息" data={data} columnNumber={3} />
    </ConfigProvider>
  );
};

export default BasicInfoListBasicDemo;
