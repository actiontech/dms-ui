import React, { useState } from 'react';
import { BasicEmpty, ConfigProvider } from '@actiontech/dms-kit';
import { Button, Space, Card, Select, Input } from 'antd';

const ErrorEmptyDemo = () => {
  const [errorInfo, setErrorInfo] = useState<string>('');
  const [errorTitle, setErrorTitle] = useState<string>('');
  const [customError, setCustomError] = useState<string>('');

  const errorTypes = [
    {
      label: '网络错误',
      value: 'network',
      title: '网络连接失败',
      info: '请检查网络连接后重试'
    },
    {
      label: '权限错误',
      value: 'permission',
      title: '权限不足',
      info: '您没有访问此资源的权限'
    },
    {
      label: '服务器错误',
      value: 'server',
      title: '服务器异常',
      info: '服务器内部错误，请稍后重试'
    },
    {
      label: '自定义错误',
      value: 'custom',
      title: errorTitle,
      info: customError
    }
  ];

  const setError = (type: string) => {
    const error = errorTypes.find((e) => e.value === type);
    if (error) {
      setErrorInfo(error.info);
      setErrorTitle(error.title);
    }
  };

  const clearError = () => {
    setErrorInfo('');
    setErrorTitle('');
  };

  return (
    <ConfigProvider>
      <Card title="错误状态" style={{ width: '100%' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Space>
              <Select
                placeholder="选择错误类型"
                style={{ width: 150 }}
                onChange={setError}
                options={errorTypes.slice(0, 3)}
              />
              <Button onClick={clearError}>清除错误</Button>
            </Space>
          </div>

          <div>
            <Space>
              <Input
                placeholder="自定义错误标题"
                value={errorTitle}
                onChange={(e) => setErrorTitle(e.target.value)}
                style={{ width: 200 }}
              />
              <Input
                placeholder="自定义错误信息"
                value={customError}
                onChange={(e) => setCustomError(e.target.value)}
                style={{ width: 200 }}
              />
              <Button
                onClick={() => setError('custom')}
                disabled={!errorTitle || !customError}
              >
                设置自定义错误
              </Button>
            </Space>
          </div>

          <div
            style={{
              minHeight: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <BasicEmpty
              errorInfo={errorInfo}
              errorTitle={errorTitle}
              dataLength={0}
            />
          </div>
        </Space>
      </Card>
    </ConfigProvider>
  );
};

export default ErrorEmptyDemo;

