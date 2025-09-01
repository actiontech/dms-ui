import React from 'react';
import { BasicResult, BasicButton, ConfigProvider } from '@actiontech/dms-kit';
import { Space } from 'antd';

const BasicResultWithActionsDemo = () => {
  const handlePrimaryAction = () => {
    console.log('主要操作被点击');
  };

  const handleSecondaryAction = () => {
    console.log('次要操作被点击');
  };

  const handleBackAction = () => {
    console.log('返回操作被点击');
  };

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <BasicResult
          status="success"
          title="提交成功"
          subTitle="您的表单已经成功提交，我们将在 24 小时内处理您的请求。"
          extra={[
            <BasicButton type="primary" key="primary" onClick={handlePrimaryAction}>
              查看详情
            </BasicButton>,
            <BasicButton key="secondary" onClick={handleSecondaryAction}>
              继续提交
            </BasicButton>
          ]}
        />
        
        <BasicResult
          status="error"
          title="提交失败"
          subTitle="很抱歉，表单提交失败，请检查信息后重试。"
          extra={[
            <BasicButton type="primary" key="primary" onClick={handlePrimaryAction}>
              重新提交
            </BasicButton>,
            <BasicButton key="secondary" onClick={handleSecondaryAction}>
              保存草稿
            </BasicButton>,
            <BasicButton key="back" onClick={handleBackAction}>
              返回修改
            </BasicButton>
          ]}
        />
        
        <BasicResult
          status="info"
          title="信息确认"
          subTitle="请确认以下信息是否正确，确认后系统将进行处理。"
          extra={[
            <BasicButton type="primary" key="confirm" onClick={handlePrimaryAction}>
              确认信息
            </BasicButton>,
            <BasicButton key="modify" onClick={handleSecondaryAction}>
              修改信息
            </BasicButton>
          ]}
        />
        
        <BasicResult
          status="warning"
          title="操作提醒"
          subTitle="请注意，此操作将影响多个相关数据，请谨慎操作。"
          extra={[
            <BasicButton type="primary" key="continue" onClick={handlePrimaryAction}>
              继续操作
            </BasicButton>,
            <BasicButton key="cancel" onClick={handleSecondaryAction}>
              取消操作
            </BasicButton>
          ]}
        />
      </Space>
    </ConfigProvider>
  );
};

export default BasicResultWithActionsDemo;
