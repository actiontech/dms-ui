import React, { useState, useEffect } from 'react';
import {
  Card,
  Space,
  Typography,
  Divider,
  Switch,
  Button,
  Row,
  Col,
  Tag,
  Slider,
  Select
} from 'antd';
import { EmptyBox, ConfigProvider } from '@actiontech/dms-kit';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  RocketOutlined,
  HeartOutlined,
  StarOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const AnimationDemo: React.FC = () => {
  const [showComponent, setShowComponent] = useState(false);
  const [animationType, setAnimationType] = useState<
    'fade' | 'slide' | 'zoom' | 'bounce'
  >('fade');
  const [animationDuration, setAnimationDuration] = useState(300);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(2000);
  const [componentCount, setComponentCount] = useState(1);

  // 自动播放逻辑
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoPlay) {
      timer = setInterval(() => {
        setShowComponent((prev) => !prev);
      }, autoPlaySpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoPlay, autoPlaySpeed]);

  // 生成多个组件
  const generateComponents = () => {
    const components = [];
    for (let i = 0; i < componentCount; i++) {
      components.push(
        <Card
          key={i}
          title={
            <Space>
              {i === 0 && <RocketOutlined style={{ color: '#1890ff' }} />}
              {i === 1 && <HeartOutlined style={{ color: '#eb2f96' }} />}
              {i === 2 && <StarOutlined style={{ color: '#faad14' }} />}
              {i === 3 && <ThunderboltOutlined style={{ color: '#722ed1' }} />}
              <span>组件 {i + 1}</span>
            </Space>
          }
          size="small"
          style={{
            backgroundColor:
              i === 0
                ? '#f0f9ff'
                : i === 1
                ? '#fff0f6'
                : i === 2
                ? '#fff7e6'
                : '#f9f0ff',
            borderColor:
              i === 0
                ? '#1890ff'
                : i === 1
                ? '#eb2f96'
                : i === 2
                ? '#faad14'
                : '#722ed1',
            marginBottom: '16px'
          }}
        >
          <div style={{ padding: '16px' }}>
            <Paragraph>
              这是第 {i + 1} 个组件，展示了 EmptyBox 的动画效果。
            </Paragraph>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div>
                  <Text strong>组件ID:</Text>
                  <Tag color="blue" style={{ marginLeft: '8px' }}>
                    comp_{i + 1}
                  </Tag>
                </div>
                <div style={{ marginTop: '8px' }}>
                  <Text strong>动画类型:</Text>
                  <Tag color="green" style={{ marginLeft: '8px' }}>
                    {animationType}
                  </Tag>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <Text strong>动画时长:</Text>
                  <Tag color="orange" style={{ marginLeft: '8px' }}>
                    {animationDuration}ms
                  </Tag>
                </div>
                <div style={{ marginTop: '8px' }}>
                  <Text strong>状态:</Text>
                  <Tag
                    color={showComponent ? 'green' : 'red'}
                    style={{ marginLeft: '8px' }}
                  >
                    {showComponent ? '显示' : '隐藏'}
                  </Tag>
                </div>
              </Col>
            </Row>
          </div>
        </Card>
      );
    }
    return components;
  };

  // 动画样式
  const getAnimationStyle = () => {
    const baseStyle = {
      transition: `all ${animationDuration}ms ease-in-out`
    };

    switch (animationType) {
      case 'fade':
        return {
          ...baseStyle,
          opacity: showComponent ? 1 : 0,
          transform: 'scale(1)'
        };
      case 'slide':
        return {
          ...baseStyle,
          transform: showComponent ? 'translateX(0)' : 'translateX(-100%)',
          opacity: showComponent ? 1 : 0
        };
      case 'zoom':
        return {
          ...baseStyle,
          transform: showComponent ? 'scale(1)' : 'scale(0.8)',
          opacity: showComponent ? 1 : 0
        };
      case 'bounce':
        return {
          ...baseStyle,
          transform: showComponent ? 'translateY(0)' : 'translateY(-20px)',
          opacity: showComponent ? 1 : 0
        };
      default:
        return baseStyle;
    }
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <Title level={3}>动画效果</Title>
        <Paragraph>
          演示 EmptyBox 组件的动画效果，包括不同的动画类型和过渡效果。
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
                  <Option value="fade">淡入淡出</Option>
                  <Option value="slide">滑动</Option>
                  <Option value="zoom">缩放</Option>
                  <Option value="bounce">弹跳</Option>
                </Select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <Text strong>动画时长:</Text>
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
                <Text strong>组件数量:</Text>
                <Slider
                  min={1}
                  max={4}
                  step={1}
                  value={componentCount}
                  onChange={setComponentCount}
                  style={{ marginLeft: '8px', width: '150px' }}
                />
                <Text type="secondary" style={{ marginLeft: '8px' }}>
                  {componentCount} 个
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
                <Text strong>当前状态:</Text>
                <Tag
                  color={showComponent ? 'green' : 'red'}
                  style={{ marginLeft: '8px' }}
                >
                  {showComponent ? '显示' : '隐藏'}
                </Tag>
              </div>
            </Col>
          </Row>

          <Divider />

          <Space>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={() => setShowComponent(true)}
              disabled={showComponent}
            >
              显示组件
            </Button>
            <Button
              icon={<PauseCircleOutlined />}
              onClick={() => setShowComponent(false)}
              disabled={!showComponent}
            >
              隐藏组件
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setShowComponent(false);
                setTimeout(() => setShowComponent(true), 100);
              }}
            >
              重新加载
            </Button>
          </Space>
        </Card>

        <Card title="动画演示">
          <div style={{ marginBottom: '16px' }}>
            <p>调整上方配置，观察组件的动画效果：</p>
          </div>

          <div style={getAnimationStyle()}>
            <EmptyBox if={showComponent}>{generateComponents()}</EmptyBox>
          </div>

          {/* 状态提示 */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '20px',
              padding: '20px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px'
            }}
          >
            <Text type="secondary">
              动画类型: {animationType} | 时长: {animationDuration}ms |
              自动播放: {autoPlay ? '开启' : '关闭'}
            </Text>
          </div>
        </Card>

        <Divider />

        <div style={{ marginBottom: '16px' }}>
          <h4>动画类型说明:</h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>
              <strong>淡入淡出 (fade)</strong>: 透明度渐变，视觉效果柔和
            </li>
            <li>
              <strong>滑动 (slide)</strong>: 水平滑动效果，适合横向布局
            </li>
            <li>
              <strong>缩放 (zoom)</strong>: 大小缩放效果，增强视觉冲击力
            </li>
            <li>
              <strong>弹跳 (bounce)</strong>: 垂直弹跳效果，增加趣味性
            </li>
          </ul>
        </div>

        <Divider />

        <div style={{ marginBottom: '16px' }}>
          <h4>性能优化:</h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>使用 CSS transition 实现动画，性能更好</li>
            <li>合理设置动画时长，避免过长影响用户体验</li>
            <li>支持自动播放功能，适合展示和演示场景</li>
            <li>组件数量可配置，便于测试不同场景下的性能</li>
          </ul>
        </div>

        <Divider />

        <div style={{ marginBottom: '16px' }}>
          <h4>使用建议:</h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>根据应用风格选择合适的动画类型</li>
            <li>在移动端考虑使用较短的动画时长</li>
            <li>避免同时使用过多动画，可能影响性能</li>
            <li>为不同组件设置不同的动画效果，提升用户体验</li>
          </ul>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default AnimationDemo;
