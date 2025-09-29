import React from 'react';
import { BasicResult, BasicButton, ConfigProvider } from '@actiontech/dms-kit';
import { Space } from 'antd';

const BasicResultEmptyDemo = () => {
  const handleCreateAction = () => {
    console.log('创建新项目');
  };

  const handleImportAction = () => {
    console.log('导入项目');
  };

  const handleRefreshAction = () => {
    console.log('刷新页面');
  };

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <BasicResult
          status="info"
          title="暂无数据"
          subTitle="当前没有找到任何数据，您可以创建新的数据或导入现有数据。"
          extra={[
            <BasicButton type="primary" key="create" onClick={handleCreateAction}>
              创建新项目
            </BasicButton>,
            <BasicButton key="import" onClick={handleImportAction}>
              导入项目
            </BasicButton>
          ]}
        />
        
        <BasicResult
          status="info"
          title="搜索结果为空"
          subTitle="没有找到与您的搜索条件匹配的结果，请尝试调整搜索条件。"
          extra={[
            <BasicButton key="refresh" onClick={handleRefreshAction}>
              刷新页面
            </BasicButton>,
            <BasicButton key="clear" onClick={() => console.log('清除搜索条件')}>
              清除搜索条件
            </BasicButton>
          ]}
        />
        
        <BasicResult
          status="info"
          title="权限不足"
          subTitle="您当前没有访问此功能的权限，请联系管理员获取相应权限。"
          extra={[
            <BasicButton type="primary" key="contact" onClick={() => console.log('联系管理员')}>
              联系管理员
            </BasicButton>,
            <BasicButton key="back" onClick={() => console.log('返回首页')}>
              返回首页
            </BasicButton>
          ]}
        />
        
        <BasicResult
          status="info"
          title="网络连接异常"
          subTitle="无法连接到服务器，请检查网络连接或稍后重试。"
          extra={[
            <BasicButton type="primary" key="retry" onClick={handleRefreshAction}>
              重试
            </BasicButton>,
            <BasicButton key="offline" onClick={() => console.log('离线模式')}>
              离线模式
            </BasicButton>
          ]}
        />
      </Space>
    </ConfigProvider>
  );
};

export default BasicResultEmptyDemo;
