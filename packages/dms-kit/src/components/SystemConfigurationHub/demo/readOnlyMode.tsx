import React from 'react';
import {
  ConfigProvider,
  renderReadOnlyModeConfig,
  ReadOnlyConfigColumnsType
} from '@actiontech/dms-kit';
import { Tag, Space } from 'antd';

interface SystemInfo {
  version: string;
  buildTime: string;
  environment: string;
  nodeCount: number;
  lastRestart: string;
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
}

const ReadOnlyModeDemo = () => {
  const systemData: SystemInfo = {
    version: 'v2.4.0',
    buildTime: '2024-01-15 10:30:00',
    environment: 'production',
    nodeCount: 3,
    lastRestart: '2024-01-10 14:20:00',
    uptime: 432000, // 5 天的秒数
    memoryUsage: 75.6,
    cpuUsage: 45.2
  };

  const systemColumns: ReadOnlyConfigColumnsType<SystemInfo> = [
    {
      label: '系统版本',
      dataIndex: 'version',
      render: (val: string) => <Tag color="blue">{val}</Tag>
    },
    {
      label: '构建时间',
      dataIndex: 'buildTime'
    },
    {
      label: '运行环境',
      dataIndex: 'environment',
      render: (val: string) => {
        const color =
          val === 'production' ? 'red' : val === 'staging' ? 'orange' : 'green';
        return (
          <Tag color={color}>
            {val === 'production'
              ? '生产环境'
              : val === 'staging'
              ? '预发环境'
              : '开发环境'}
          </Tag>
        );
      }
    },
    {
      label: '集群节点数',
      dataIndex: 'nodeCount',
      render: (val: number) => `${val} 个节点`
    },
    {
      label: '最后重启时间',
      dataIndex: 'lastRestart'
    },
    {
      label: '运行时长',
      dataIndex: 'uptime',
      render: (val: number) => {
        const days = Math.floor(val / 86400);
        const hours = Math.floor((val % 86400) / 3600);
        const minutes = Math.floor((val % 3600) / 60);
        return `${days} 天 ${hours} 小时 ${minutes} 分钟`;
      }
    },
    {
      label: '内存使用率',
      dataIndex: 'memoryUsage',
      render: (val: number) => (
        <Space>
          <span>{val}%</span>
          <Tag color={val > 80 ? 'red' : val > 60 ? 'orange' : 'green'}>
            {val > 80 ? '高' : val > 60 ? '中' : '正常'}
          </Tag>
        </Space>
      )
    },
    {
      label: 'CPU 使用率',
      dataIndex: 'cpuUsage',
      render: (val: number) => (
        <Space>
          <span>{val}%</span>
          <Tag color={val > 80 ? 'red' : val > 60 ? '中' : '正常'}>
            {val > 80 ? '高' : val > 60 ? '中' : '正常'}
          </Tag>
        </Space>
      )
    }
  ];

  return (
    <ConfigProvider>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
        <h3>系统信息 (只读模式)</h3>
        <div
          style={{
            background: '#fafafa',
            border: '1px solid #d9d9d9',
            borderRadius: 6,
            padding: 16
          }}
        >
          {renderReadOnlyModeConfig({
            data: systemData,
            columns: systemColumns,
            modifyFlag: false // 强制只读模式
          })}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default ReadOnlyModeDemo;
