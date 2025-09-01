import React from 'react';
import { ConfigProvider } from '@actiontech/dms-kit';
import { Tag, Progress, Button, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { BasicInfoList } from '@actiontech/dms-kit';

const BasicInfoListComplexDemo: React.FC = () => {
  const data = [
    {
      key: '任务状态',
      value: (
        <Tag color="green" icon={<CheckCircleOutlined />}>
          已完成
        </Tag>
      )
    },
    {
      key: '完成进度',
      value: <Progress percent={85} size="small" />
    },
    {
      key: '优先级',
      value: <Tag color="red">高</Tag>
    },
    {
      key: '负责人',
      value: (
        <div>
          <span>李四</span>
          <Button type="link" size="small" style={{ marginLeft: 8 }}>
            查看详情
          </Button>
        </div>
      )
    },
    {
      key: '最后更新',
      value: (
        <div>
          <div>2024-01-15 14:30:00</div>
          <small style={{ color: '#999' }}>2小时前</small>
        </div>
      )
    },
    {
      key: '操作',
      value: (
        <Space>
          <Button size="small" type="primary">
            编辑
          </Button>
          <Button size="small" danger>
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <ConfigProvider>
      <BasicInfoList title="任务详情" data={data} columnNumber={3} />
    </ConfigProvider>
  );
};

export default BasicInfoListComplexDemo;
