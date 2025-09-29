import React, { useState } from 'react';
import { Card, Space, Switch, InputNumber, Input, Button, message } from 'antd';
import { TestDatabaseConnectButton, ConfigProvider } from '@actiontech/dms-kit';

const CustomConfigDemo: React.FC = () => {
  const [initHide, setInitHide] = useState(true);
  const [customTitle, setCustomTitle] = useState('测试数据库连接');
  const [testDelay, setTestDelay] = useState(2000);
  const [successRate, setSuccessRate] = useState(80);
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
          // 根据设置的成功率决定测试结果
          if (Math.random() * 100 < successRate) {
            resolve(true);
          } else {
            reject(new Error('连接失败: 模拟测试失败'));
          }
        }, testDelay);
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

  const resetTest = () => {
    setLoading(false);
    setConnectAble(null);
    setConnectDisableReason('');
    message.info('已重置测试状态');
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>自定义配置</h3>

        <Card title="配置参数" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <span style={{ marginRight: '8px' }}>初始隐藏结果:</span>
                <Switch
                  checked={initHide}
                  onChange={setInitHide}
                  checkedChildren="是"
                  unCheckedChildren="否"
                />
                <span style={{ marginLeft: '8px', color: '#666' }}>
                  {initHide ? '测试结果初始隐藏' : '测试结果初始显示'}
                </span>
              </div>

              <div>
                <span style={{ marginRight: '8px' }}>测试延迟 (毫秒):</span>
                <InputNumber
                  value={testDelay}
                  onChange={(value) => setTestDelay(value || 1000)}
                  min={500}
                  max={10000}
                  step={500}
                  style={{ width: 120 }}
                />
                <span style={{ marginLeft: '8px', color: '#666' }}>
                  模拟测试过程耗时
                </span>
              </div>

              <div>
                <span style={{ marginRight: '8px' }}>成功率 (%):</span>
                <InputNumber
                  value={successRate}
                  onChange={(value) => setSuccessRate(value || 50)}
                  min={0}
                  max={100}
                  step={10}
                  style={{ width: 120 }}
                />
                <span style={{ marginLeft: '8px', color: '#666' }}>
                  控制测试成功或失败的概率
                </span>
              </div>

              <div>
                <span style={{ marginRight: '8px' }}>自定义按钮标题:</span>
                <Input
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  style={{ width: 200 }}
                  placeholder="输入按钮标题"
                />
              </div>
            </Space>
          </div>
        </Card>

        <Card title="自定义配置演示" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <Space>
              <Button onClick={handleTestConnection} type="primary">
                开始测试
              </Button>
              <Button onClick={resetTest} type="default">
                重置测试
              </Button>
            </Space>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <p>当前配置:</p>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>
                初始隐藏结果: <strong>{initHide ? '是' : '否'}</strong>
              </li>
              <li>
                测试延迟: <strong>{testDelay}ms</strong>
              </li>
              <li>
                成功率: <strong>{successRate}%</strong>
              </li>
              <li>
                按钮标题: <strong>{customTitle}</strong>
              </li>
            </ul>
          </div>

          <TestDatabaseConnectButton
            initHide={initHide}
            onClickTestButton={handleTestConnection}
            loading={loading}
            connectAble={!!connectAble}
            connectDisableReason={connectDisableReason}
          />
        </Card>

        <Card title="配置说明" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h4>initHide 属性:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>
                <strong>true (默认)</strong>: 初始隐藏测试结果，只显示测试按钮
              </li>
              <li>
                <strong>false</strong>: 初始显示测试结果区域
              </li>
              <li>当用户第一次点击测试按钮后，结果区域会显示</li>
              <li>适合需要控制结果显示时机的场景</li>
            </ul>
          </div>

          <div style={{ marginTop: '16px' }}>
            <h4>其他配置属性:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>
                <strong>onClickTestButton</strong>:
                测试按钮点击回调，处理实际的测试逻辑
              </li>
              <li>
                <strong>loading</strong>: 控制按钮的加载状态
              </li>
              <li>
                <strong>connectAble</strong>: 测试结果，true 表示成功，false
                表示失败
              </li>
              <li>
                <strong>connectDisableReason</strong>: 失败原因描述
              </li>
            </ul>
          </div>
        </Card>

        <Card title="使用场景">
          <div style={{ marginBottom: '16px' }}>
            <h4>initHide 的使用场景:</h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}
            >
              <div>
                <h5>initHide={true} (推荐)</h5>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  <li>数据库配置页面</li>
                  <li>首次使用时的引导</li>
                  <li>需要用户主动触发测试</li>
                  <li>避免页面加载时显示空白结果</li>
                </ul>
              </div>
              <div>
                <h5>initHide={false}</h5>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  <li>测试结果需要持久显示</li>
                  <li>用户需要看到历史测试状态</li>
                  <li>结果区域有默认内容</li>
                  <li>需要立即显示测试状态</li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <h4>配置最佳实践:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>根据业务场景选择合适的 initHide 值</li>
              <li>提供清晰的配置说明和默认值</li>
              <li>支持动态配置，适应不同环境需求</li>
              <li>保持配置的简单性和可理解性</li>
              <li>提供合理的配置范围限制</li>
            </ul>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default CustomConfigDemo;
