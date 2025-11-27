import React from 'react';
import { ConfigProvider, BasicInfoList } from '@actiontech/dms-kit';
import { Space, Tag, Button } from 'antd';

/**
 * 基础用法
 * - 展示结构化信息列表
 * - 支持自定义列数
 * - value 可以是 ReactNode，支持标签、按钮等复杂内容
 */
const BasicInfoListBasicDemo: React.FC = () => {
  const basicData = [
    { key: '项目名称', value: 'DMS 数据管理系统' },
    { key: '项目版本', value: 'v2.1.0' },
    { key: '创建时间', value: '2024-01-15' },
    { key: '项目状态', value: <Tag color="green">进行中</Tag> },
    { key: '负责人', value: '张三' },
    { key: '团队规模', value: '15人' }
  ];

  const twoColumnData = [
    { key: '数据库类型', value: 'MySQL' },
    { key: '数据库版本', value: '8.0.32' },
    { key: '连接地址', value: '192.168.1.100:3306' },
    { key: '连接状态', value: <Tag color="success">已连接</Tag> }
  ];

  const fourColumnData = [
    { key: 'CPU', value: '45%' },
    { key: '内存', value: '62%' },
    { key: '磁盘', value: '78%' },
    { key: '网络', value: '23 Mbps' },
    { key: '活跃连接', value: '156' },
    { key: '慢查询', value: '3' },
    { key: '错误日志', value: '0' },
    { key: '运行时长', value: '15天' }
  ];

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <BasicInfoList
          title="基础信息（3列）"
          data={basicData}
          columnNumber={3}
        />

        <BasicInfoList
          title="数据库信息（2列）"
          data={twoColumnData}
          columnNumber={2}
        />

        <BasicInfoList
          title="系统监控（4列）"
          data={fourColumnData}
          columnNumber={4}
        />

        <BasicInfoList
          title="带操作按钮"
          data={basicData}
          columnNumber={3}
          extra={<Button type="link">编辑</Button>}
        />
      </Space>
    </ConfigProvider>
  );
};

export default BasicInfoListBasicDemo;
