import React from 'react';
import { BasicResult, ConfigProvider } from '@actiontech/dms-kit';
import { Space } from 'antd';

const BasicResultStatusesDemo = () => {
  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <BasicResult
          status="success"
          title="操作成功"
          subTitle="您的操作已经成功完成，请查看结果。"
        />
        
        <BasicResult
          status="error"
          title="操作失败"
          subTitle="很抱歉，操作未能成功完成，请重试。"
        />
        
        <BasicResult
          status="info"
          title="信息提示"
          subTitle="这是一条重要的信息提示，请仔细阅读。"
        />
        
        <BasicResult
          status="warning"
          title="警告提示"
          subTitle="请注意，您的操作可能存在风险。"
        />
        
        <BasicResult
          status="404"
          title="页面不存在"
          subTitle="抱歉，您访问的页面不存在。"
        />
        
        <BasicResult
          status="403"
          title="无权限访问"
          subTitle="抱歉，您没有权限访问此页面。"
        />
        
        <BasicResult
          status="500"
          title="服务器错误"
          subTitle="抱歉，服务器出现了问题，请稍后重试。"
        />
      </Space>
    </ConfigProvider>
  );
};

export default BasicResultStatusesDemo;
