import React from 'react';
import { BasicResult, ConfigProvider } from '@actiontech/dms-kit';
import { Button, Space } from 'antd';

/**
 * 基础用法
 * - 展示操作结果
 * - 提供操作按钮引导用户下一步
 */
const BasicResultDemo = () => {
  return (
    <ConfigProvider>
      <Space direction="vertical" style={{ width: '100%' }}>
        <BasicResult
          status="success"
          title="提交成功"
          subTitle="订单编号：2024112401，预计 2-3 个工作日内完成审核。"
          extra={[
            <Button type="primary" key="console">
              返回首页
            </Button>,
            <Button key="buy">查看订单</Button>
          ]}
        />

        <BasicResult
          status="error"
          title="提交失败"
          subTitle="请检查并修改以下信息后，再次提交。"
          extra={[
            <Button type="primary" key="retry">
              重新提交
            </Button>,
            <Button key="back">返回修改</Button>
          ]}
        />
      </Space>
    </ConfigProvider>
  );
};

export default BasicResultDemo;
