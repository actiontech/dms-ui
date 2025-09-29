import React, { useState } from 'react';
import { Card, Space, Typography, Divider, Row, Col } from 'antd';
import { ModeSwitcher, ConfigProvider } from '@actiontech/dms-kit';
import { 
  SunOutlined, 
  MoonOutlined,
  DesktopOutlined,
  MobileOutlined,
  TabletOutlined,
  CloudOutlined,
  DatabaseOutlined,
  ApiOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const IconModeDemo: React.FC = () => {
  const [themeMode, setThemeMode] = useState<string>('light');
  const [deviceMode, setDeviceMode] = useState<string>('desktop');
  const [serviceMode, setServiceMode] = useState<string>('cloud');

  // 主题模式选项
  const themeOptions = [
    {
      label: '浅色主题',
      value: 'light',
      icon: <SunOutlined style={{ fontSize: '18px' }} />
    },
    {
      label: '深色主题',
      value: 'dark',
      icon: <MoonOutlined style={{ fontSize: '18px' }} />
    },
    {
      label: '跟随系统',
      value: 'auto',
      icon: <DesktopOutlined style={{ fontSize: '18px' }} />
    }
  ];

  // 设备模式选项
  const deviceOptions = [
    {
      label: '桌面端',
      value: 'desktop',
      icon: <DesktopOutlined style={{ fontSize: '18px' }} />
    },
    {
      label: '移动端',
      value: 'mobile',
      icon: <MobileOutlined style={{ fontSize: '18px' }} />
    },
    {
      label: '平板端',
      value: 'tablet',
      icon: <TabletOutlined style={{ fontSize: '18px' }} />
    }
  ];

  // 服务模式选项
  const serviceOptions = [
    {
      label: '云端服务',
      value: 'cloud',
      icon: <CloudOutlined style={{ fontSize: '18px' }} />
    },
    {
      label: '本地服务',
      value: 'local',
      icon: <DatabaseOutlined style={{ fontSize: '18px' }} />
    },
    {
      label: 'API 服务',
      value: 'api',
      icon: <ApiOutlined style={{ fontSize: '18px' }} />
    },
    {
      label: '自定义配置',
      value: 'custom',
      icon: <SettingOutlined style={{ fontSize: '18px' }} />
    }
  ];

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>图标模式</h3>
        
        <Card title="主题模式切换" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>使用图标表示不同主题模式的切换器：</p>
          </div>
          
          <ModeSwitcher
            options={themeOptions}
            value={themeMode}
            onChange={setThemeMode}
            defaultValue="light"
          />
          
          <Divider />
          
          <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <Paragraph>
              当前主题模式: <strong>{themeMode}</strong>
            </Paragraph>
            <Paragraph>
              图标帮助用户快速识别不同的主题选项，提升用户体验。
            </Paragraph>
          </div>
        </Card>

        <Card title="设备模式切换" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>不同设备类型的模式切换：</p>
          </div>
          
          <ModeSwitcher
            options={deviceOptions}
            value={deviceMode}
            onChange={setDeviceMode}
            defaultValue="desktop"
          />
          
          <Divider />
          
          <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <Paragraph>
              当前设备模式: <strong>{deviceMode}</strong>
            </Paragraph>
            <Paragraph>
              根据设备类型调整界面布局和交互方式。
            </Paragraph>
          </div>
        </Card>

        <Card title="服务模式切换" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p>多种服务模式的切换选择：</p>
          </div>
          
          <ModeSwitcher
            options={serviceOptions}
            value={serviceMode}
            onChange={setServiceMode}
            defaultValue="cloud"
          />
          
          <Divider />
          
          <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <Paragraph>
              当前服务模式: <strong>{serviceMode}</strong>
            </Paragraph>
            <Paragraph>
              选择不同的服务部署和配置模式。
            </Paragraph>
          </div>
        </Card>

        <Card title="图标设计说明">
          <div style={{ marginBottom: '16px' }}>
            <h4>图标使用原则:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>
                <strong>语义化</strong>: 图标应该与模式含义相关
              </li>
              <li>
                <strong>一致性</strong>: 使用统一的图标风格和大小
              </li>
              <li>
                <strong>可识别性</strong>: 图标应该容易理解和识别
              </li>
              <li>
                <strong>视觉平衡</strong>: 图标与文本保持视觉平衡
              </li>
            </ul>
          </div>
          
          <div style={{ marginTop: '16px' }}>
            <h4>图标模式优势:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>提升用户识别速度</li>
              <li>增强界面的视觉吸引力</li>
              <li>减少文字阅读负担</li>
              <li>支持国际化场景</li>
            </ul>
          </div>
          
          <div style={{ marginTop: '16px' }}>
            <h4>使用建议:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>选择有意义的图标，避免使用抽象符号</li>
              <li>保持图标大小一致，建议使用 16-20px</li>
              <li>考虑图标的颜色和主题适配</li>
              <li>为图标添加适当的 tooltip 说明</li>
            </ul>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default IconModeDemo;
