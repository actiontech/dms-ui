import React from 'react';
import { Card, Space, Button, Typography } from 'antd';
import { PageHeader, ConfigProvider } from '@actiontech/dms-kit';
import {
  PlusOutlined,
  DownloadOutlined,
  ReloadOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const BasicDemo: React.FC = () => {
  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>基础用法</h3>

        <Card title="页面头部基础功能" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>页面头部组件用于显示页面标题和操作按钮：</p>
          </div>

          <PageHeader
            title="用户管理"
            extra={
              <Space>
                <Button icon={<PlusOutlined />} type="primary">
                  添加用户
                </Button>
                <Button icon={<DownloadOutlined />}>导出数据</Button>
                <Button icon={<ReloadOutlined />}>刷新</Button>
              </Space>
            }
          />

          <div
            style={{
              padding: '20px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              marginTop: '20px'
            }}
          >
            <Paragraph>
              这里是页面的主要内容区域。页面头部组件会显示在内容区域的顶部，
              提供清晰的页面标题和常用的操作按钮。
            </Paragraph>
          </div>
        </Card>

        <Card title="不同标题类型" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>页面头部支持不同类型的标题内容：</p>
          </div>

          <PageHeader
            title={
              <Title level={3} style={{ margin: 0 }}>
                系统配置
              </Title>
            }
            extra={<Button type="primary">保存配置</Button>}
          />

          <div
            style={{
              padding: '20px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              marginTop: '20px'
            }}
          >
            <Paragraph>
              支持使用 Typography
              组件自定义标题样式，可以设置不同的标题级别和样式。
            </Paragraph>
          </div>
        </Card>

        <Card title="功能说明">
          <div style={{ marginBottom: '16px' }}>
            <h4>组件特点:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>
                <strong>标题显示</strong>: 左侧显示页面标题，支持任意 React 节点
              </li>
              <li>
                <strong>额外内容</strong>: 右侧显示操作按钮、链接等额外内容
              </li>
              <li>
                <strong>布局灵活</strong>: 自动处理标题和额外内容的对齐和间距
              </li>
              <li>
                <strong>样式统一</strong>: 与设计系统保持一致的视觉风格
              </li>
              <li>
                <strong>响应式设计</strong>: 自动适配不同屏幕尺寸
              </li>
            </ul>
          </div>

          <div style={{ marginTop: '16px' }}>
            <h4>使用场景:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>数据列表页面的标题和操作按钮</li>
              <li>表单页面的标题和保存、取消按钮</li>
              <li>详情页面的标题和编辑、删除按钮</li>
              <li>设置页面的标题和配置相关按钮</li>
            </ul>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default BasicDemo;
