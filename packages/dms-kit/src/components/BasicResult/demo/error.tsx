import React from 'react';
import { BasicResult, BasicButton, ConfigProvider } from '@actiontech/dms-kit';
import { Space } from 'antd';

const BasicResultErrorDemo = () => {
  const handleRetryAction = () => {
    console.log('重试操作');
  };

  const handleReportAction = () => {
    console.log('报告问题');
  };

  const handleBackAction = () => {
    console.log('返回上一页');
  };

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <BasicResult
          status="500"
          title="服务器内部错误"
          subTitle="抱歉，服务器出现了问题，我们的技术团队正在积极处理。"
          extra={[
            <BasicButton type="primary" key="retry" onClick={handleRetryAction}>
              重试
            </BasicButton>,
            <BasicButton key="report" onClick={handleReportAction}>
              报告问题
            </BasicButton>
          ]}
        />
        
        <BasicResult
          status="403"
          title="访问被拒绝"
          subTitle="抱歉，您没有权限访问此页面，请联系管理员获取相应权限。"
          extra={[
            <BasicButton type="primary" key="contact" onClick={() => console.log('联系管理员')}>
              联系管理员
            </BasicButton>,
            <BasicButton key="back" onClick={handleBackAction}>
              返回上一页
            </BasicButton>
          ]}
        />
        
        <BasicResult
          status="404"
          title="页面不存在"
          subTitle="抱歉，您访问的页面不存在，可能已被删除或移动。"
          extra={[
            <BasicButton type="primary" key="home" onClick={() => console.log('返回首页')}>
              返回首页
            </BasicButton>,
            <BasicButton key="search" onClick={() => console.log('搜索页面')}>
              搜索页面
            </BasicButton>
          ]}
        />
        
        <BasicResult
          status="error"
          title="操作失败"
          subTitle="很抱歉，您的操作未能成功完成，请检查输入信息后重试。"
          extra={[
            <BasicButton type="primary" key="retry" onClick={handleRetryAction}>
              重试操作
            </BasicButton>,
            <BasicButton key="help" onClick={() => console.log('获取帮助')}>
              获取帮助
            </BasicButton>
          ]}
        />
        
        <BasicResult
          status="warning"
          title="操作警告"
          subTitle="请注意，此操作可能存在风险，请确认您了解相关影响。"
          extra={[
            <BasicButton type="primary" key="continue" onClick={() => console.log('继续操作')}>
              继续操作
            </BasicButton>,
            <BasicButton key="cancel" onClick={() => console.log('取消操作')}>
              取消操作
            </BasicButton>
          ]}
        />
      </Space>
    </ConfigProvider>
  );
};

export default BasicResultErrorDemo;
