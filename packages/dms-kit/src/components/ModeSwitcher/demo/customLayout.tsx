import React, { useState } from 'react';
import { Card, Space, Typography, Divider, Row, Col, Switch } from 'antd';
import { ModeSwitcher, ConfigProvider } from '@actiontech/dms-kit';
import {
  AppstoreOutlined,
  BarsOutlined,
  TableOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TeamOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const CustomLayoutDemo: React.FC = () => {
  const [viewMode, setViewMode] = useState<string>('grid');
  const [timeMode, setTimeMode] = useState<string>('day');
  const [userMode, setUserMode] = useState<string>('single');
  const [compactMode, setCompactMode] = useState(false);

  // 视图模式选项 - 使用 colProps 控制列宽
  const viewOptions = [
    {
      label: '网格视图',
      value: 'grid',
      icon: <AppstoreOutlined />,
      colProps: { span: 8 }
    },
    {
      label: '列表视图',
      value: 'list',
      icon: <BarsOutlined />,
      colProps: { span: 8 }
    },
    {
      label: '表格视图',
      value: 'table',
      icon: <TableOutlined />,
      colProps: { span: 8 }
    }
  ];

  // 时间模式选项 - 不同列宽
  const timeOptions = [
    {
      label: '日视图',
      value: 'day',
      icon: <CalendarOutlined />,
      colProps: { span: 6 }
    },
    {
      label: '周视图',
      value: 'week',
      icon: <CalendarOutlined />,
      colProps: { span: 6 }
    },
    {
      label: '月视图',
      value: 'month',
      icon: <CalendarOutlined />,
      colProps: { span: 6 }
    },
    {
      label: '年视图',
      value: 'year',
      icon: <CalendarOutlined />,
      colProps: { span: 6 }
    }
  ];

  // 用户模式选项 - 自定义列宽
  const userOptions = [
    {
      label: '单用户',
      value: 'single',
      icon: <UserOutlined />,
      colProps: {
        xs: 24,
        sm: 12,
        md: 8,
        lg: 6
      }
    },
    {
      label: '多用户',
      value: 'multiple',
      icon: <TeamOutlined />,
      colProps: {
        xs: 24,
        sm: 12,
        md: 8,
        lg: 6
      }
    },
    {
      label: '管理员',
      value: 'admin',
      icon: <SettingOutlined />,
      colProps: {
        xs: 24,
        sm: 12,
        md: 8,
        lg: 6
      }
    },
    {
      label: '访客',
      value: 'guest',
      icon: <UserOutlined />,
      colProps: {
        xs: 24,
        sm: 12,
        md: 8,
        lg: 6
      }
    }
  ];

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>自定义布局</h3>

        <Card title="固定列宽布局" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>使用 colProps 控制每个选项的列宽，实现均匀分布：</p>
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
              当前视图模式: <strong>{viewMode}</strong>
            </Paragraph>
            <Paragraph>
              每个选项占用 8 列，在 24 列栅格系统中均匀分布。
            </Paragraph>
          </div>
        </Card>

        <Card title="不同列宽布局" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>为不同选项设置不同的列宽，适应内容长度：</p>
          </div>

          <ModeSwitcher
            options={timeOptions}
            value={timeMode}
            onChange={setTimeMode}
            defaultValue="day"
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
              当前时间模式: <strong>{timeMode}</strong>
            </Paragraph>
            <Paragraph>每个选项占用 6 列，支持 4 个选项的布局。</Paragraph>
          </div>
        </Card>

        <Card title="自定义列宽布局" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>使用自定义列宽，配置不同屏幕尺寸下的列数：</p>
          </div>

          <ModeSwitcher
            options={userOptions}
            value={userMode}
            onChange={setUserMode}
            defaultValue="single"
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
            <Paragraph>自定义列宽：xs(24) → sm(12) → md(8) → lg(6)</Paragraph>
            <Text type="secondary">调整浏览器窗口大小查看布局效果</Text>
          </div>
        </Card>

        <Card title="紧凑模式切换" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>通过 rowProps 控制整体布局的紧凑程度：</p>
          </div>

          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Space>
                <span>紧凑模式:</span>
                <Switch
                  checked={compactMode}
                  onChange={setCompactMode}
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                />
              </Space>
            </div>

            <ModeSwitcher
              options={viewOptions}
              value={viewMode}
              onChange={setViewMode}
              defaultValue="grid"
              rowProps={{
                gutter: compactMode ? [8, 8] : [16, 16],
                className: compactMode ? 'compact-mode' : ''
              }}
            />
          </Space>

          <Divider />

          <div
            style={{
              padding: '20px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px'
            }}
          >
            <Paragraph>
              紧凑模式: <strong>{compactMode ? '开启' : '关闭'}</strong>
            </Paragraph>
            <Paragraph>
              通过调整 gutter 和 className 实现不同的布局效果。
            </Paragraph>
          </div>
        </Card>

        <Card title="布局配置说明">
          <div style={{ marginBottom: '16px' }}>
            <h4>colProps 配置选项:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>
                <strong>span</strong>: 固定列宽，适用于等宽布局
              </li>
              <li>
                <strong>xs/sm/md/lg/xl</strong>: 自定义列宽，适用于不同屏幕尺寸
              </li>
              <li>
                <strong>offset</strong>: 列偏移，用于调整位置
              </li>
              <li>
                <strong>order</strong>: 列顺序，用于调整显示顺序
              </li>
            </ul>
          </div>

          <Divider />

          <div style={{ marginBottom: '16px' }}>
            <h4>rowProps 配置选项:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>
                <strong>gutter</strong>: 栅格间隔，控制选项之间的间距
              </li>
              <li>
                <strong>justify</strong>:
                水平排列方式（start/end/center/space-around/space-between）
              </li>
              <li>
                <strong>align</strong>: 垂直对齐方式（top/middle/bottom）
              </li>
              <li>
                <strong>className</strong>: 自定义类名，用于样式定制
              </li>
            </ul>
          </div>

          <div style={{ marginTop: '16px' }}>
            <h4>布局最佳实践:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>使用 24 列栅格系统，确保布局的一致性</li>
              <li>为不同屏幕尺寸配置自定义列宽</li>
              <li>合理使用 gutter 控制选项间距</li>
              <li>通过 className 实现自定义样式</li>
            </ul>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default CustomLayoutDemo;
