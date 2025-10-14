import React, { useState } from 'react';
import { Card, Space, Button, message } from 'antd';
import { TestDatabaseConnectButton, ConfigProvider } from '@actiontech/dms-kit';

const TestStatesDemo: React.FC = () => {
  const [testStates, setTestStates] = useState<
    {
      id: number;
      loading: boolean;
      connectAble: boolean | null;
      connectDisableReason: string;
      name: string;
    }[]
  >([
    {
      id: 1,
      loading: false,
      connectAble: null,
      connectDisableReason: '',
      name: 'MySQL 主库'
    },
    {
      id: 2,
      loading: false,
      connectAble: null,
      connectDisableReason: '',
      name: 'MySQL 从库'
    },
    {
      id: 3,
      loading: false,
      connectAble: null,
      connectDisableReason: '',
      name: 'PostgreSQL 数据库'
    }
  ]);

  const handleTestConnection = async (id: number) => {
    const stateIndex = testStates.findIndex((state) => state.id === id);
    if (stateIndex === -1) return;

    // 设置加载状态
    setTestStates((prev) =>
      prev.map((state, index) =>
        index === stateIndex
          ? {
              ...state,
              loading: true,
              connectAble: null,
              connectDisableReason: ''
            }
          : state
      )
    );

    try {
      // 模拟数据库连接测试
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 模拟不同的成功率
          const successRate = id === 1 ? 0.9 : id === 2 ? 0.7 : 0.5;
          if (Math.random() > 1 - successRate) {
            resolve(true);
          } else {
            reject(
              new Error(
                `连接失败: ${
                  id === 1 ? '网络超时' : id === 2 ? '认证失败' : '服务不可用'
                }`
              )
            );
          }
        }, 1500 + Math.random() * 1000);
      });

      // 测试成功
      setTestStates((prev) =>
        prev.map((state, index) =>
          index === stateIndex
            ? { ...state, loading: false, connectAble: true }
            : state
        )
      );
      message.success(`${testStates[stateIndex].name} 连接测试成功！`);
    } catch (error) {
      // 测试失败
      setTestStates((prev) =>
        prev.map((state, index) =>
          index === stateIndex
            ? {
                ...state,
                loading: false,
                connectAble: false,
                connectDisableReason:
                  error instanceof Error ? error.message : '未知错误'
              }
            : state
        )
      );
      message.error(`${testStates[stateIndex].name} 连接测试失败！`);
    }
  };

  const resetAllTests = () => {
    setTestStates((prev) =>
      prev.map((state) => ({
        ...state,
        loading: false,
        connectAble: null,
        connectDisableReason: ''
      }))
    );
    message.info('已重置所有测试状态');
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>测试状态管理</h3>

        <Card title="多数据库连接测试" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <Space>
              <Button onClick={resetAllTests} type="default">
                重置所有测试
              </Button>
              <span style={{ color: '#666' }}>
                点击下方按钮测试不同数据库的连接状态
              </span>
            </Space>
          </div>

          {testStates.map((state, index) => (
            <div key={state.id} style={{ marginBottom: '20px' }}>
              <h4>{state.name}</h4>
              <TestDatabaseConnectButton
                onClickTestButton={() => handleTestConnection(state.id)}
                loading={state.loading}
                connectAble={!!state.connectAble}
                connectDisableReason={state.connectDisableReason}
              />
            </div>
          ))}
        </Card>

        <Card title="状态说明" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h4>测试状态流程:</h4>
            <ol style={{ margin: 0, paddingLeft: '20px' }}>
              <li>
                <strong>初始状态</strong>: 所有数据库都未测试，显示测试按钮
              </li>
              <li>
                <strong>测试中</strong>: 点击测试按钮后，按钮显示 loading
                状态，下方显示"测试中..."
              </li>
              <li>
                <strong>测试完成</strong>: 根据测试结果显示成功或失败信息
              </li>
              <li>
                <strong>状态保持</strong>:
                测试结果会保持显示，直到下次测试或重置
              </li>
            </ol>
          </div>
        </Card>

        <Card title="状态管理特点">
          <div style={{ marginBottom: '16px' }}>
            <h4>组件状态管理特性:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>
                <strong>独立状态</strong>: 每个测试按钮维护独立的状态
              </li>
              <li>
                <strong>状态持久化</strong>: 测试结果会保持显示
              </li>
              <li>
                <strong>批量重置</strong>: 支持一键重置所有测试状态
              </li>
              <li>
                <strong>错误处理</strong>: 自动处理测试过程中的异常情况
              </li>
              <li>
                <strong>用户反馈</strong>: 提供清晰的测试状态反馈
              </li>
            </ul>
          </div>

          <div style={{ marginTop: '16px' }}>
            <h4>最佳实践:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>在父组件中统一管理测试状态</li>
              <li>提供重置功能，方便用户重新测试</li>
              <li>为每个数据库连接提供清晰的标识</li>
              <li>合理控制测试频率，避免过度请求</li>
            </ul>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default TestStatesDemo;
