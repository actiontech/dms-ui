import React, { useState } from 'react';
import { Space, message, Divider } from 'antd';
import { TestDatabaseConnectButton, ConfigProvider } from '@actiontech/dms-kit';

/**
 * 基础用法
 * - 展示测试成功和失败两种场景
 * - 自动显示测试状态和结果
 * - 失败时显示具体原因
 */
const BasicDemo: React.FC = () => {
  // 测试成功场景
  const [loading1, setLoading1] = useState(false);
  const [connectAble1, setConnectAble1] = useState<boolean>(false);
  const [connectDisableReason1, setConnectDisableReason1] =
    useState<string>('');

  // 测试失败场景
  const [loading2, setLoading2] = useState(false);
  const [connectAble2, setConnectAble2] = useState<boolean>(false);
  const [connectDisableReason2, setConnectDisableReason2] =
    useState<string>('');

  const handleTestSuccess = async () => {
    setLoading1(true);
    setConnectDisableReason1('');

    try {
      // 模拟成功的数据库连接测试
      await new Promise((resolve) => {
        setTimeout(() => resolve(true), 1500);
      });

      setConnectAble1(true);
      message.success('数据库连接测试成功');
    } catch (error) {
      setConnectAble1(false);
      setConnectDisableReason1(
        error instanceof Error ? error.message : '未知错误'
      );
      message.error('数据库连接测试失败');
    } finally {
      setLoading1(false);
    }
  };

  const handleTestFailure = async () => {
    setLoading2(true);
    setConnectDisableReason2('');

    try {
      // 模拟失败的数据库连接测试
      await new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('连接被拒绝: 数据库服务器无法访问 (10061)'));
        }, 1500);
      });

      setConnectAble2(true);
    } catch (error) {
      setConnectAble2(false);
      setConnectDisableReason2(
        error instanceof Error ? error.message : '未知错误'
      );
      message.error('数据库连接测试失败');
    } finally {
      setLoading2(false);
    }
  };

  return (
    <ConfigProvider>
      {/* 成功场景 */}
      <div style={{ marginBottom: '32px' }}>
        <h4 style={{ marginBottom: '12px' }}>测试成功场景</h4>
        <p style={{ marginBottom: '12px', color: '#666', fontSize: '13px' }}>
          模拟数据库连接成功，显示绿色成功提示
        </p>
        <TestDatabaseConnectButton
          onClickTestButton={handleTestSuccess}
          loading={loading1}
          connectAble={connectAble1}
          connectDisableReason={connectDisableReason1}
        />
      </div>

      <Divider />

      {/* 失败场景 */}
      <div>
        <h4 style={{ marginBottom: '12px' }}>测试失败场景</h4>
        <p style={{ marginBottom: '12px', color: '#666', fontSize: '13px' }}>
          模拟数据库连接失败，显示红色失败提示和具体错误原因
        </p>
        <TestDatabaseConnectButton
          onClickTestButton={handleTestFailure}
          loading={loading2}
          connectAble={connectAble2}
          connectDisableReason={connectDisableReason2}
        />
      </div>
    </ConfigProvider>
  );
};

export default BasicDemo;
