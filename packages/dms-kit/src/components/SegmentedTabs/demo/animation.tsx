import React, { useState } from 'react';
import {
  Card,
  Space,
  Typography,
  Divider,
  Select,
  Switch,
  Slider,
  Row,
  Col,
  Button,
  Tag
} from 'antd';
import { SegmentedTabs, ConfigProvider } from '@actiontech/dms-kit';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  RocketOutlined,
  ThunderboltOutlined,
  HeartOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const AnimationDemo: React.FC = () => {
  const [activeKey, setActiveKey] = useState('tab1');
  const [animationType, setAnimationType] = useState<'slide' | 'fade' | 'zoom'>(
    'slide'
  );
  const [animationDuration, setAnimationDuration] = useState(300);
  const [enableAnimation, setEnableAnimation] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(2000);

  // 自动播放逻辑
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoPlay && enableAnimation) {
      timer = setInterval(() => {
        setActiveKey((prev) => {
          const keys = ['tab1', 'tab2', 'tab3', 'tab4'];
          const currentIndex = keys.indexOf(prev);
          return keys[(currentIndex + 1) % keys.length];
        });
      }, autoPlaySpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoPlay, autoPlaySpeed, enableAnimation]);

  // 动画配置
  const animationConfig = {
    type: animationType,
    duration: animationDuration,
    enabled: enableAnimation
  };

  // 标签页配置
  const tabItems = [
    {
      value: 'tab1',
      label: (
        <Space>
          <RocketOutlined />
          <span>火箭模式</span>
        </Space>
      ),
      children: (
        <div style={{ padding: '20px', minHeight: '200px' }}>
          <Title level={4}>🚀 火箭模式</Title>
          <Paragraph>
            这是火箭模式的标签页内容，展示了快速、流畅的动画效果。
          </Paragraph>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <RocketOutlined style={{ fontSize: '64px', color: '#1890ff' }} />
            <div style={{ marginTop: '16px' }}>
              <Text type="secondary">动画类型: {animationType}</Text>
            </div>
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary">持续时间: {animationDuration}ms</Text>
            </div>
          </div>
        </div>
      )
    },
    {
      value: 'tab2',
      label: (
        <Space>
          <ThunderboltOutlined />
          <span>闪电模式</span>
        </Space>
      ),
      children: (
        <div style={{ padding: '20px', minHeight: '200px' }}>
          <Title level={4}>⚡ 闪电模式</Title>
          <Paragraph>
            闪电模式提供极速的切换体验，适合需要快速响应的场景。
          </Paragraph>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <ThunderboltOutlined
              style={{ fontSize: '64px', color: '#faad14' }}
            />
            <div style={{ marginTop: '16px' }}>
              <Text type="secondary">
                当前状态: {autoPlay ? '自动播放中' : '手动控制'}
              </Text>
            </div>
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary">播放速度: {autoPlaySpeed}ms</Text>
            </div>
          </div>
        </div>
      )
    },
    {
      value: 'tab3',
      label: (
        <Space>
          <HeartOutlined />
          <span>爱心模式</span>
        </Space>
      ),
      children: (
        <div style={{ padding: '20px', minHeight: '200px' }}>
          <Title level={4}>💖 爱心模式</Title>
          <Paragraph>
            爱心模式带来温暖、柔和的切换体验，适合温馨的应用场景。
          </Paragraph>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <HeartOutlined style={{ fontSize: '64px', color: '#eb2f96' }} />
            <div style={{ marginTop: '16px' }}>
              <Text type="secondary">
                动画状态: {enableAnimation ? '已启用' : '已禁用'}
              </Text>
            </div>
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary">当前标签: {activeKey}</Text>
            </div>
          </div>
        </div>
      )
    },
    {
      value: 'tab4',
      label: (
        <Space>
          <ReloadOutlined />
          <span>循环模式</span>
        </Space>
      ),
      children: (
        <div style={{ padding: '20px', minHeight: '200px' }}>
          <Title level={4}>🔄 循环模式</Title>
          <Paragraph>
            循环模式展示标签页的自动切换功能，可以设置不同的切换速度。
          </Paragraph>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <ReloadOutlined style={{ fontSize: '64px', color: '#52c41a' }} />
            <div style={{ marginTop: '16px' }}>
              <Text type="secondary">
                自动播放: {autoPlay ? '开启' : '关闭'}
              </Text>
            </div>
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary">切换间隔: {autoPlaySpeed}ms</Text>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <Title level={3}>动画效果</Title>
        <Paragraph>
          演示 SegmentedTabs
          组件的各种动画效果，包括切换动画、自动播放和性能优化。
        </Paragraph>

        <Card title="动画配置" style={{ marginBottom: '20px' }}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div style={{ marginBottom: '16px' }}>
                <Text strong>动画类型:</Text>
                <Select
                  value={animationType}
                  onChange={setAnimationType}
                  style={{ marginLeft: '8px', width: '120px' }}
                >
                  <Option value="slide">滑动 (slide)</Option>
                  <Option value="fade">淡入淡出 (fade)</Option>
                  <Option value="zoom">缩放 (zoom)</Option>
                </Select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <Text strong>动画持续时间:</Text>
                <Slider
                  min={100}
                  max={1000}
                  step={50}
                  value={animationDuration}
                  onChange={setAnimationDuration}
                  style={{ marginLeft: '8px', width: '150px' }}
                />
                <Text type="secondary" style={{ marginLeft: '8px' }}>
                  {animationDuration}ms
                </Text>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <Text strong>启用动画:</Text>
                <Switch
                  checked={enableAnimation}
                  onChange={setEnableAnimation}
                  style={{ marginLeft: '8px' }}
                />
                <Text type="secondary" style={{ marginLeft: '8px' }}>
                  {enableAnimation ? '已启用' : '已禁用'}
                </Text>
              </div>
            </Col>

            <Col span={12}>
              <div style={{ marginBottom: '16px' }}>
                <Text strong>自动播放:</Text>
                <Switch
                  checked={autoPlay}
                  onChange={setAutoPlay}
                  style={{ marginLeft: '8px' }}
                />
                <Text type="secondary" style={{ marginLeft: '8px' }}>
                  {autoPlay ? '开启' : '关闭'}
                </Text>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <Text strong>播放速度:</Text>
                <Slider
                  min={1000}
                  max={5000}
                  step={500}
                  value={autoPlaySpeed}
                  onChange={setAutoPlaySpeed}
                  style={{ marginLeft: '8px', width: '150px' }}
                />
                <Text type="secondary" style={{ marginLeft: '8px' }}>
                  {autoPlaySpeed}ms
                </Text>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <Text strong>当前标签:</Text>
                <Tag color="blue" style={{ marginLeft: '8px' }}>
                  {activeKey}
                </Tag>
              </div>
            </Col>
          </Row>

          <Divider />

          <Space>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={() => setAutoPlay(true)}
              disabled={autoPlay}
            >
              开始自动播放
            </Button>
            <Button
              icon={<PauseCircleOutlined />}
              onClick={() => setAutoPlay(false)}
              disabled={!autoPlay}
            >
              停止自动播放
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => setActiveKey('tab1')}
            >
              重置到第一个标签
            </Button>
          </Space>
        </Card>

        <Card title="动画演示">
          <div style={{ marginBottom: '16px' }}>
            <p>调整上方配置，观察标签页切换的动画效果：</p>
          </div>

          <SegmentedTabs
            activeKey={activeKey}
            onChange={setActiveKey}
            items={tabItems}
            animated={enableAnimation ? animationType : false}
          />

          <Divider />

          <div style={{ marginBottom: '16px' }}>
            <h4>动画特点:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>
                <strong>滑动动画</strong>: 标签内容平滑滑动切换，适合横向布局
              </li>
              <li>
                <strong>淡入淡出</strong>: 内容透明度渐变，视觉效果柔和
              </li>
              <li>
                <strong>缩放动画</strong>: 内容缩放切换，增强视觉冲击力
              </li>
              <li>
                <strong>自动播放</strong>: 支持定时自动切换，适合展示场景
              </li>
            </ul>
          </div>

          <Divider />

          <div style={{ marginBottom: '16px' }}>
            <h4>性能优化:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>动画可以完全禁用，提升性能</li>
              <li>支持自定义动画时长，平衡效果和性能</li>
              <li>自动播放功能可控制，避免不必要的资源消耗</li>
              <li>动画配置实时生效，便于调试和优化</li>
            </ul>
          </div>

          <Divider />

          <div style={{ marginBottom: '16px' }}>
            <h4>使用建议:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>在移动端考虑使用较短的动画时长</li>
              <li>根据内容类型选择合适的动画效果</li>
              <li>自动播放功能适合展示和演示场景</li>
              <li>在性能敏感的场景下可以禁用动画</li>
            </ul>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default AnimationDemo;
