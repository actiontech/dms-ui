import React, { useState } from 'react';
import { Card, Space, Button, Table, List, Avatar, message } from 'antd';
import { SpinIndicator, ConfigProvider } from '@actiontech/dms-kit';

const IntegrationDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  // 模拟数据
  const mockData = [
    { id: 1, name: '用户管理', status: 'active', users: 1250 },
    { id: 2, name: '角色管理', status: 'active', users: 89 },
    { id: 3, name: '权限管理', status: 'active', users: 156 },
    { id: 4, name: '系统设置', status: 'maintenance', users: 0 },
    { id: 5, name: '日志管理', status: 'active', users: 2341 }
  ];

  const handleLoadData = async () => {
    setLoading(true);
    setData([]);

    // 模拟异步数据加载
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setData(mockData);
    setLoading(false);
    message.success('数据加载完成！');
  };

  const handleRefresh = async () => {
    setLoading(true);

    // 模拟数据刷新
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setData([...mockData].sort(() => Math.random() - 0.5));
    setLoading(false);
    message.success('数据已刷新！');
  };

  const columns = [
    {
      title: '模块名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span style={{ color: status === 'active' ? '#52c41a' : '#faad14' }}>
          {status === 'active' ? '活跃' : '维护中'}
        </span>
      )
    },
    {
      title: '用户数量',
      dataIndex: 'users',
      key: 'users'
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Button size="small" type="link">
          查看详情
        </Button>
      )
    }
  ];

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>集成使用</h3>

        <Card title="按钮集成" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>在按钮中集成加载指示器，提供更好的用户体验：</p>
          </div>

          <Space>
            <Button
              type="primary"
              onClick={handleLoadData}
              loading={loading}
              icon={
                loading ? <SpinIndicator width={16} height={20} /> : undefined
              }
            >
              {loading ? '加载中...' : '加载数据'}
            </Button>

            <Button
              onClick={handleRefresh}
              loading={loading}
              icon={
                loading ? <SpinIndicator width={16} height={20} /> : undefined
              }
            >
              {loading ? '刷新中...' : '刷新数据'}
            </Button>
          </Space>
        </Card>

        <Card title="列表集成" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>在列表组件中使用加载指示器：</p>
          </div>

          {loading ? (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
              <SpinIndicator width={48} height={60} />
              <div style={{ marginTop: '16px', color: '#666' }}>
                正在加载模块列表...
              </div>
            </div>
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={data}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button size="small" type="link">
                      编辑
                    </Button>,
                    <Button size="small" type="link" danger>
                      删除
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{
                          backgroundColor:
                            item.status === 'active' ? '#52c41a' : '#faad14'
                        }}
                      >
                        {item.name.charAt(0)}
                      </Avatar>
                    }
                    title={item.name}
                    description={`状态: ${
                      item.status === 'active' ? '活跃' : '维护中'
                    } | 用户数: ${item.users}`}
                  />
                </List.Item>
              )}
            />
          )}
        </Card>

        <Card title="页面级加载" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>在页面级别使用大型加载指示器：</p>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '200px',
              border: '1px dashed #d9d9d9',
              borderRadius: '8px',
              padding: '40px'
            }}
          >
            {loading ? (
              <div style={{ textAlign: 'center' }}>
                <SpinIndicator width={64} height={80} />
                <div
                  style={{ marginTop: '24px', fontSize: '16px', color: '#666' }}
                >
                  页面加载中，请稍候...
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '16px', color: '#52c41a' }}>
                  ✅ 页面加载完成
                </div>
                <div style={{ marginTop: '8px', color: '#666' }}>
                  所有数据已准备就绪
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card title="集成使用说明">
          <div style={{ marginBottom: '16px' }}>
            <h4>集成方式:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>
                <strong>按钮集成</strong>: 在按钮的 icon 属性中使用，配合
                loading 状态
              </li>
              <li>
                <strong>表格集成</strong>: 通过 locale.emptyText
                自定义空数据时的加载状态
              </li>
              <li>
                <strong>列表集成</strong>: 在列表容器中条件渲染加载状态
              </li>
              <li>
                <strong>页面集成</strong>: 在页面容器中使用大型加载指示器
              </li>
            </ul>
          </div>

          <div style={{ marginTop: '16px' }}>
            <h4>最佳实践:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>根据容器大小选择合适的加载指示器尺寸</li>
              <li>配合文字说明，让用户了解当前状态</li>
              <li>保持加载状态的一致性，避免多个加载指示器同时显示</li>
              <li>合理设置加载时间，避免用户等待过久</li>
              <li>提供加载进度或状态信息，增强用户体验</li>
            </ul>
          </div>

          <div style={{ marginTop: '16px' }}>
            <h4>常见应用场景:</h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}
            >
              <div>
                <h5>数据加载</h5>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  <li>表格数据加载</li>
                  <li>列表数据获取</li>
                  <li>搜索结果显示</li>
                  <li>分页数据切换</li>
                </ul>
              </div>
              <div>
                <h5>操作反馈</h5>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  <li>表单提交</li>
                  <li>文件上传</li>
                  <li>数据导出</li>
                  <li>系统操作</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default IntegrationDemo;
