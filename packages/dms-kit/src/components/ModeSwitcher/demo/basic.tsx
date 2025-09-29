import React, { useState } from 'react';
import { Card, Space, Typography, Divider } from 'antd';
import { ModeSwitcher, ConfigProvider } from '@actiontech/dms-kit';
import {
  AppstoreOutlined,
  BarsOutlined,
  TableOutlined,
  UserOutlined,
  SettingOutlined,
  DashboardOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const BasicDemo: React.FC = () => {
  const [viewMode, setViewMode] = useState<string>('grid');
  const [userMode, setUserMode] = useState<string>('view');

  // 视图模式选项
  const viewOptions = [
    {
      label: '网格视图',
      value: 'grid',
      icon: <AppstoreOutlined />
    },
    {
      label: '列表视图',
      value: 'list',
      icon: <BarsOutlined />
    },
    {
      label: '表格视图',
      value: 'table',
      icon: <TableOutlined />
    }
  ];

  // 用户模式选项
  const userOptions = [
    {
      label: '查看模式',
      value: 'view',
      icon: <UserOutlined />
    },
    {
      label: '编辑模式',
      value: 'edit',
      icon: <SettingOutlined />
    },
    {
      label: '管理模式',
      value: 'admin',
      icon: <DashboardOutlined />
    }
  ];

  // 简单字符串选项
  const simpleOptions = ['紧凑', '标准', '宽松'];

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>基础用法</h3>

        <Card title="视图模式切换" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>使用图标和文本的模式切换器：</p>
          </div>

          <ModeSwitcher
            options={viewOptions}
            value={viewMode}
            onChange={setViewMode}
            defaultValue="grid"
          />

          <Divider />

          <div
            style={{
              padding: '20px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px'
            }}
          >
            <Paragraph>
              当前选中的视图模式: <strong>{viewMode}</strong>
            </Paragraph>
            <Paragraph>这里会根据选中的模式显示不同的内容布局。</Paragraph>
          </div>
        </Card>

        <Card title="用户模式切换" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>不同用户权限的模式切换：</p>
          </div>

          <ModeSwitcher
            options={userOptions}
            value={userMode}
            onChange={setUserMode}
            defaultValue="view"
          />

          <Divider />

          <div
            style={{
              padding: '20px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px'
            }}
          >
            <Paragraph>
              当前用户模式: <strong>{userMode}</strong>
            </Paragraph>
            <Paragraph>不同模式提供不同的功能和权限。</Paragraph>
          </div>
        </Card>

        <Card title="简单文本选项" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>使用字符串数组的简单选项：</p>
          </div>

          <ModeSwitcher options={simpleOptions} defaultValue="标准" />

          <Divider />

          <div
            style={{
              padding: '20px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px'
            }}
          >
            <Paragraph>
              布局密度选项，适用于调整页面元素的间距和大小。
            </Paragraph>
          </div>
        </Card>

        <Card title="功能说明">
          <div style={{ marginBottom: '16px' }}>
            <h4>组件特点:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>
                <strong>模式切换</strong>: 支持不同模式之间的切换
              </li>
              <li>
                <strong>图标支持</strong>: 每个选项可以配置独立的图标
              </li>
              <li>
                <strong>状态管理</strong>: 支持受控和非受控模式
              </li>
              <li>
                <strong>栅格布局</strong>: 基于 Ant Design 栅格系统
              </li>
              <li>
                <strong>选中指示</strong>: 清晰的选中状态显示
              </li>
            </ul>
          </div>

          <div style={{ marginTop: '16px' }}>
            <h4>使用场景:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>视图模式切换（列表、网格、卡片等）</li>
              <li>功能模式选择（查看、编辑、管理等）</li>
              <li>主题模式切换（明暗、色彩等）</li>
              <li>布局模式调整（紧凑、标准、宽松等）</li>
            </ul>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default BasicDemo;
