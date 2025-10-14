import React from 'react';
import { BasicResult, ConfigProvider } from '@actiontech/dms-kit';

const BasicResultDemo = () => {
  return (
    <ConfigProvider>
      <BasicResult
        status="success"
        title="操作成功"
        subTitle="您的操作已经成功完成，请查看结果。"
      />
    </ConfigProvider>
  );
};

export default BasicResultDemo;
