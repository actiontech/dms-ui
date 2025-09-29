import React, { useState } from 'react';
import {
  Card,
  Space,
  Typography,
  Divider,
  Switch,
  Button,
  Row,
  Col,
  Tag
} from 'antd';
import { EmptyBox, ConfigProvider } from '@actiontech/dms-kit';
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  UserOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const BasicDemo: React.FC = () => {
  const [showUserInfo, setShowUserInfo] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showStatistics, setShowStatistics] = useState(true);

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <Title level={3}>基础使用</Title>
        <Paragraph>
          演示 EmptyBox 组件的基本用法，通过开关控制不同组件的显示和隐藏。
        </Paragraph>

        <Card title="控制面板" style={{ marginBottom: '20px' }}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Space>
                <Text strong>用户信息:</Text>
                <Switch
                  checked={showUserInfo}
                  onChange={setShowUserInfo}
                  checkedChildren={<EyeOutlined />}
                  unCheckedChildren={<EyeInvisibleOutlined />}
                />
                <Tag color={showUserInfo ? 'green' : 'red'}>
                  {showUserInfo ? '显示' : '隐藏'}
                </Tag>
              </Space>
            </Col>
            <Col span={8}>
              <Space>
                <Text strong>系统设置:</Text>
                <Switch
                  checked={showSettings}
                  onChange={setShowSettings}
                  checkedChildren={<EyeOutlined />}
                  unCheckedChildren={<EyeInvisibleOutlined />}
                />
                <Tag color={showSettings ? 'green' : 'red'}>
                  {showSettings ? '显示' : '隐藏'}
                </Tag>
              </Space>
            </Col>
            <Col span={8}>
              <Space>
                <Text strong>数据统计:</Text>
                <Switch
                  checked={showStatistics}
                  onChange={setShowStatistics}
                  checkedChildren={<EyeOutlined />}
                  unCheckedChildren={<EyeInvisibleOutlined />}
                />
                <Tag color={showStatistics ? 'green' : 'red'}>
                  {showStatistics ? '显示' : '隐藏'}
                </Tag>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card title="组件渲染演示">
          <Space direction="vertical" style={{ width: '100%' }}>
            {/* 用户信息组件 */}
            <EmptyBox if={showUserInfo}>
              <Card
                title={
                  <Space>
                    <UserOutlined />
                    <span>用户信息</span>
                  </Space>
                }
                size="small"
                style={{ backgroundColor: '#f6ffed', borderColor: '#52c41a' }}
              >
                <div style={{ padding: '16px' }}>
                  <Paragraph>
                    这是用户信息组件，当开关打开时会显示，关闭时会完全隐藏。
                  </Paragraph>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <div>
                        <Text strong>用户名:</Text>
                        <Text style={{ marginLeft: '8px' }}>张三</Text>
                      </div>
                      <div style={{ marginTop: '8px' }}>
                        <Text strong>邮箱:</Text>
                        <Text style={{ marginLeft: '8px' }}>
                          zhangsan@example.com
                        </Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div>
                        <Text strong>角色:</Text>
                        <Tag color="blue" style={{ marginLeft: '8px' }}>
                          管理员
                        </Tag>
                      </div>
                      <div style={{ marginTop: '8px' }}>
                        <Text strong>状态:</Text>
                        <Tag color="green" style={{ marginLeft: '8px' }}>
                          活跃
                        </Tag>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </EmptyBox>

            {/* 系统设置组件 */}
            <EmptyBox if={showSettings}>
              <Card
                title={
                  <Space>
                    <SettingOutlined />
                    <span>系统设置</span>
                  </Space>
                }
                size="small"
                style={{ backgroundColor: '#fff7e6', borderColor: '#faad14' }}
              >
                <div style={{ padding: '16px' }}>
                  <Paragraph>
                    这是系统设置组件，展示了 EmptyBox 的条件渲染功能。
                  </Paragraph>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Text strong>主题模式:</Text>
                      <Tag color="blue" style={{ marginLeft: '8px' }}>
                        浅色
                      </Tag>
                    </div>
                    <div>
                      <Text strong>语言设置:</Text>
                      <Tag color="green" style={{ marginLeft: '8px' }}>
                        中文
                      </Tag>
                    </div>
                    <div>
                      <Text strong>通知设置:</Text>
                      <Tag color="orange" style={{ marginLeft: '8px' }}>
                        开启
                      </Tag>
                    </div>
                  </Space>
                </div>
              </Card>
            </EmptyBox>

            {/* 数据统计组件 */}
            <EmptyBox if={showStatistics}>
              <Card
                title="数据统计"
                size="small"
                style={{ backgroundColor: '#f0f9ff', borderColor: '#1890ff' }}
              >
                <div style={{ padding: '16px' }}>
                  <Paragraph>
                    这是数据统计组件，使用 EmptyBox 控制显示状态。
                  </Paragraph>
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#1890ff'
                          }}
                        >
                          1,234
                        </div>
                        <Text type="secondary">总用户数</Text>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#52c41a'
                          }}
                        >
                          89%
                        </div>
                        <Text type="secondary">活跃率</Text>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#faad14'
                          }}
                        >
                          56
                        </div>
                        <Text type="secondary">今日新增</Text>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </EmptyBox>

            {/* 状态提示 */}
            <div
              style={{
                textAlign: 'center',
                padding: '20px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px'
              }}
            >
              <Text type="secondary">
                当前显示组件:
                {showUserInfo && (
                  <Tag color="green" style={{ marginLeft: '8px' }}>
                    用户信息
                  </Tag>
                )}
                {showSettings && (
                  <Tag color="orange" style={{ marginLeft: '8px' }}>
                    系统设置
                  </Tag>
                )}
                {showStatistics && (
                  <Tag color="blue" style={{ marginLeft: '8px' }}>
                    数据统计
                  </Tag>
                )}
                {!showUserInfo && !showSettings && !showStatistics && (
                  <Tag color="red" style={{ marginLeft: '8px' }}>
                    无组件显示
                  </Tag>
                )}
              </Text>
            </div>
          </Space>
        </Card>

        <Divider />

        <div style={{ marginBottom: '16px' }}>
          <h4>功能特点:</h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>
              <strong>条件渲染</strong>: 根据布尔值控制组件的显示/隐藏
            </li>
            <li>
              <strong>实时响应</strong>: 条件变化时立即更新渲染状态
            </li>
            <li>
              <strong>性能优化</strong>: 条件不满足时完全不渲染，节省资源
            </li>
            <li>
              <strong>灵活控制</strong>: 支持多个独立的条件控制
            </li>
          </ul>
        </div>

        <Divider />

        <div style={{ marginBottom: '16px' }}>
          <h4>使用场景:</h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>根据用户权限显示/隐藏功能模块</li>
            <li>根据数据状态控制组件渲染</li>
            <li>实现动态的界面布局</li>
            <li>优化应用性能，避免不必要的渲染</li>
          </ul>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default BasicDemo;
