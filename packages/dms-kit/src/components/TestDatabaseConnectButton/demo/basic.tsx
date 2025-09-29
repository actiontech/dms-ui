import React, { useState } from 'react';
import { Card, Space, message } from 'antd';
import { TestDatabaseConnectButton, ConfigProvider } from '@actiontech/dms-kit';

const BasicDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [connectAble, setConnectAble] = useState<boolean | null>(null);
  const [connectDisableReason, setConnectDisableReason] = useState<string>('');

  const handleTestConnection = async () => {
    setLoading(true);
    setConnectAble(null);
    setConnectDisableReason('');

    try {
      // 模拟数据库连接测试
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 模拟 70% 成功率
          if (Math.random() > 0.3) {
            resolve(true);
          } else {
            reject(new Error('连接超时或网络异常'));
          }
        }, 2000);
      });

      setConnectAble(true);
      message.success('数据库连接测试成功！');
    } catch (error) {
      setConnectAble(false);
      setConnectDisableReason(
        error instanceof Error ? error.message : '未知错误'
      );
      message.error('数据库连接测试失败！');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>基础用法</h3>

        <Card title="数据库连接测试" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>点击下方按钮测试数据库连接，测试过程大约需要 2 秒。</p>
          </div>
          <TestDatabaseConnectButton
            onClickTestButton={handleTestConnection}
            loading={loading}
            connectAble={!!connectAble}
            connectDisableReason={connectDisableReason}
          />
        </Card>

        <Card title="测试状态说明">
          <div style={{ marginBottom: '16px' }}>
            <h4>组件状态说明:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>
                <strong>初始状态</strong>: 隐藏测试结果，只显示测试按钮
              </li>
              <li>
                <strong>测试中</strong>: 按钮显示 loading
                状态，下方显示"测试中..."
              </li>
              <li>
                <strong>测试成功</strong>: 显示绿色成功提示信息
              </li>
              <li>
                <strong>测试失败</strong>: 显示红色失败提示信息和具体原因
              </li>
            </ul>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <h4>当前状态:</h4>
            <Space>
              <span>Loading: {loading ? '是' : '否'}</span>
              <span>
                可连接:{' '}
                {connectAble === null ? '未知' : connectAble ? '是' : '否'}
              </span>
              {connectDisableReason && (
                <span>失败原因: {connectDisableReason}</span>
              )}
            </Space>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default BasicDemo;
