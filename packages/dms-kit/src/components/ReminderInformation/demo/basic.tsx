import React, { useState } from 'react';
import { Card, Space, Button, message } from 'antd';
import { ReminderInformation, ConfigProvider } from '@actiontech/dms-kit';

const BasicDemo: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSuccess = () => {
    setShowSuccess(true);
    setShowError(false);
    message.success('操作成功！');
  };

  const handleError = () => {
    setShowError(true);
    setShowSuccess(false);
    message.error('操作失败！');
  };

  const reset = () => {
    setShowSuccess(false);
    setShowError(false);
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>基础用法</h3>

        <Card title="提醒信息基础功能" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>点击下方按钮查看不同状态的提醒信息：</p>
          </div>

          <Space style={{ marginBottom: '20px' }}>
            <Button type="primary" onClick={handleSuccess}>
              模拟成功操作
            </Button>
            <Button danger onClick={handleError}>
              模拟失败操作
            </Button>
            <Button onClick={reset}>重置状态</Button>
          </Space>

          <div
            style={{
              minHeight: '80px',
              border: '1px dashed #d9d9d9',
              borderRadius: '8px',
              padding: '20px'
            }}
          >
            {showSuccess && (
              <ReminderInformation
                status="success"
                message="操作已成功完成！数据已保存到系统中。"
              />
            )}

            {showError && (
              <ReminderInformation
                status="error"
                message="操作失败！请检查输入信息后重试。"
              />
            )}

            {!showSuccess && !showError && (
              <div style={{ textAlign: 'center', color: '#999' }}>
                点击上方按钮查看提醒信息
              </div>
            )}
          </div>
        </Card>

        <Card title="功能说明">
          <div style={{ marginBottom: '16px' }}>
            <h4>组件特点:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>
                <strong>状态反馈</strong>: 支持成功和错误两种状态类型
              </li>
              <li>
                <strong>图标显示</strong>: 自动根据状态显示对应的图标
              </li>
              <li>
                <strong>文本内容</strong>: 支持自定义提醒消息内容
              </li>
              <li>
                <strong>样式统一</strong>: 与设计系统保持一致的视觉风格
              </li>
              <li>
                <strong>响应式布局</strong>: 自动适配不同屏幕尺寸
              </li>
            </ul>
          </div>

          <div style={{ marginTop: '16px' }}>
            <h4>使用场景:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>表单提交后的结果反馈</li>
              <li>数据操作的状态提示</li>
              <li>系统配置的更新通知</li>
              <li>用户操作的实时反馈</li>
            </ul>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default BasicDemo;
