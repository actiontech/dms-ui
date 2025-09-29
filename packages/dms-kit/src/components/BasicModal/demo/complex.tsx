import React, { useState } from 'react';
import { BasicModal, BasicButton, ConfigProvider } from '@actiontech/dms-kit';
import { Tabs, Table, Tag, Progress } from 'antd';

const BasicModalComplexDemo = () => {
  const [visible, setVisible] = useState(false);

  const dataSource = [
    {
      key: '1',
      name: '数据库 A',
      status: 'running',
      progress: 85,
      tags: ['MySQL', '生产环境']
    },
    {
      key: '2',
      name: '数据库 B',
      status: 'stopped',
      progress: 0,
      tags: ['PostgreSQL', '测试环境']
    },
    {
      key: '3',
      name: '数据库 C',
      status: 'maintenance',
      progress: 45,
      tags: ['MongoDB', '开发环境']
    }
  ];

  const columns = [
    {
      title: '数据库名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          running: { color: 'green', text: '运行中' },
          stopped: { color: 'red', text: '已停止' },
          maintenance: { color: 'orange', text: '维护中' }
        };
        const { color, text } = statusMap[status as keyof typeof statusMap];
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => <Progress percent={progress} size="small" />
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <>
          {tags.map(tag => (
            <Tag key={tag} style={{ marginBottom: 4 }}>{tag}</Tag>
          ))}
        </>
      )
    }
  ];

  return (
    <ConfigProvider>
      <BasicButton type="primary" onClick={() => setVisible(true)}>
        复杂内容弹窗
      </BasicButton>

      <BasicModal
        title="数据库管理面板"
        visible={visible}
        size="large"
        width={1000}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        okText="保存配置"
        cancelText="关闭"
      >
        <Tabs
          defaultActiveKey="overview"
          items={[
            {
              key: 'overview',
              label: '概览',
              children: (
                <div>
                  <h3>系统概览</h3>
                  <p>当前系统运行状态良好，共有 3 个数据库实例。</p>
                  <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>3</div>
                      <div>总数据库数</div>
                    </div>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>1</div>
                      <div>运行中</div>
                    </div>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{ fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>1</div>
                      <div>维护中</div>
                    </div>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ff4d4f' }}>1</div>
                      <div>已停止</div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              key: 'databases',
              label: '数据库列表',
              children: (
                <div>
                  <h3>数据库实例</h3>
                  <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                    size="small"
                  />
                </div>
              )
            },
            {
              key: 'settings',
              label: '配置设置',
              children: (
                <div>
                  <h3>系统配置</h3>
                  <p>这里可以配置各种系统参数和选项。</p>
                  <p>包括数据库连接池、缓存策略、日志级别等。</p>
                </div>
              )
            }
          ]}
        />
      </BasicModal>
    </ConfigProvider>
  );
};

export default BasicModalComplexDemo;
