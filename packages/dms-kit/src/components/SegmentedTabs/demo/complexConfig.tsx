import React, { useState, useMemo } from 'react';
import {
  Card,
  Space,
  Typography,
  Divider,
  Switch,
  InputNumber,
  Select,
  Row,
  Col,
  Button,
  Tag,
  Alert,
  Tabs
} from 'antd';
import { SegmentedTabs, ConfigProvider } from '@actiontech/dms-kit';
import {
  SettingOutlined,
  ReloadOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  DownloadOutlined,
  UploadOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const ComplexConfigDemo: React.FC = () => {
  const [activeKey, setActiveKey] = useState('tab1');
  const [tabPosition, setTabPosition] = useState<
    'top' | 'bottom' | 'left' | 'right'
  >('top');
  const [tabSize, setTabSize] = useState<'large' | 'middle' | 'small'>(
    'middle'
  );
  const [tabType, setTabType] = useState<'line' | 'card' | 'editable-card'>(
    'line'
  );
  const [centered, setCentered] = useState(false);
  const [addIcon, setAddIcon] = useState(true);
  const [destroyInactiveTabPane, setDestroyInactiveTabPane] = useState(false);
  const [hideAdd, setHideAdd] = useState(false);
  const [animated, setAnimated] = useState(true);
  const [tabBarGutter, setTabBarGutter] = useState(0);
  const [tabBarStyle, setTabBarStyle] = useState<'default' | 'custom'>(
    'default'
  );

  // 动态标签页数据
  const [dynamicTabs, setDynamicTabs] = useState([
    { value: 'tab1', label: '系统设置', closable: false },
    { value: 'tab2', label: '用户管理', closable: true },
    { value: 'tab3', label: '数据统计', closable: true },
    { value: 'tab4', label: '日志查看', closable: true }
  ]);

  // 添加新标签页
  const addTab = () => {
    const newValue = `tab${dynamicTabs.length + 1}`;
    const newTab = {
      value: newValue,
      label: `新标签 ${dynamicTabs.length + 1}`,
      closable: true
    };
    setDynamicTabs([...dynamicTabs, newTab]);
    setActiveKey(newValue);
  };

  // 移除标签页
  const removeTab = (targetValue: string) => {
    const targetIndex = dynamicTabs.findIndex(
      (tab) => tab.value === targetValue
    );
    const newTabs = dynamicTabs.filter((tab) => tab.value !== targetValue);

    if (newTabs.length && targetValue === activeKey) {
      const { value: newValue } =
        newTabs[targetIndex === newTabs.length ? targetIndex - 1 : targetIndex];
      setActiveKey(newValue);
    }

    setDynamicTabs(newTabs);
  };

  // 标签页内容生成器
  const generateTabContent = (key: string) => {
    const contentMap: { [key: string]: React.ReactNode } = {
      tab1: (
        <div style={{ padding: '20px', minHeight: '300px' }}>
          <Title level={4}>⚙️ 系统设置</Title>
          <Paragraph>
            这是系统设置标签页，展示了不可关闭的标签页配置。
          </Paragraph>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card title="基本配置" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>标签位置:</Text>
                    <Tag color="blue" style={{ marginLeft: '8px' }}>
                      {tabPosition}
                    </Tag>
                  </div>
                  <div>
                    <Text strong>标签大小:</Text>
                    <Tag color="green" style={{ marginLeft: '8px' }}>
                      {tabSize}
                    </Tag>
                  </div>
                  <div>
                    <Text strong>标签类型:</Text>
                    <Tag color="orange" style={{ marginLeft: '8px' }}>
                      {tabType}
                    </Tag>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="高级配置" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>居中对齐:</Text>
                    <Tag
                      color={centered ? 'green' : 'red'}
                      style={{ marginLeft: '8px' }}
                    >
                      {centered ? '开启' : '关闭'}
                    </Tag>
                  </div>
                  <div>
                    <Text strong>动画效果:</Text>
                    <Tag
                      color={animated ? 'green' : 'red'}
                      style={{ marginLeft: '8px' }}
                    >
                      {animated ? '开启' : '关闭'}
                    </Tag>
                  </div>
                  <div>
                    <Text strong>标签间距:</Text>
                    <Tag color="purple" style={{ marginLeft: '8px' }}>
                      {tabBarGutter}px
                    </Tag>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      ),
      tab2: (
        <div style={{ padding: '20px', minHeight: '300px' }}>
          <Title level={4}>👥 用户管理</Title>
          <Paragraph>
            用户管理标签页，支持关闭操作，展示动态标签页功能。
          </Paragraph>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <EyeOutlined style={{ fontSize: '64px', color: '#1890ff' }} />
            <div style={{ marginTop: '16px' }}>
              <Text type="secondary">当前标签页: {activeKey}</Text>
            </div>
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary">总标签数: {dynamicTabs.length}</Text>
            </div>
          </div>
        </div>
      ),
      tab3: (
        <div style={{ padding: '20px', minHeight: '300px' }}>
          <Title level={4}>📊 数据统计</Title>
          <Paragraph>数据统计标签页，展示复杂配置下的标签页表现。</Paragraph>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Card title="配置状态" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>添加图标:</Text>
                    <Tag color={addIcon ? 'green' : 'red'}>
                      {addIcon ? '显示' : '隐藏'}
                    </Tag>
                  </div>
                  <div>
                    <Text strong>隐藏添加:</Text>
                    <Tag color={hideAdd ? 'green' : 'red'}>
                      {hideAdd ? '是' : '否'}
                    </Tag>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="标签样式" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>样式类型:</Text>
                    <Tag color="blue">{tabBarStyle}</Tag>
                  </div>
                  <div>
                    <Text strong>销毁策略:</Text>
                    <Tag color={destroyInactiveTabPane ? 'orange' : 'green'}>
                      {destroyInactiveTabPane ? '立即销毁' : '保持状态'}
                    </Tag>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="操作按钮" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button
                    type="primary"
                    size="small"
                    icon={<DownloadOutlined />}
                  >
                    导出数据
                  </Button>
                  <Button size="small" icon={<UploadOutlined />}>
                    导入数据
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      ),
      tab4: (
        <div style={{ padding: '20px', minHeight: '300px' }}>
          <Title level={4}>📋 日志查看</Title>
          <Paragraph>
            日志查看标签页，展示标签页的高级功能和配置选项。
          </Paragraph>
          <Alert
            message="配置信息"
            description={`当前配置：位置=${tabPosition}, 大小=${tabSize}, 类型=${tabType}, 居中=${centered}, 动画=${animated}`}
            type="info"
            showIcon
            style={{ marginBottom: '16px' }}
          />
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <EditOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
            <div style={{ marginTop: '16px' }}>
              <Text type="secondary">这是一个可编辑的标签页</Text>
            </div>
          </div>
        </div>
      )
    };

    return (
      contentMap[key] || (
        <div style={{ padding: '20px', minHeight: '300px' }}>
          <Title level={4}>🆕 新标签页</Title>
          <Paragraph>
            这是一个动态添加的新标签页，展示了 SegmentedTabs 组件的灵活性。
          </Paragraph>
        </div>
      )
    );
  };

  // 标签页配置
  const tabItems = dynamicTabs.map((tab) => ({
    value: tab.value,
    label: tab.label,
    closable: tab.closable,
    children: generateTabContent(tab.value)
  }));

  // 标签栏样式
  const customTabBarStyle = useMemo(() => {
    if (tabBarStyle === 'custom') {
      return {
        background: '#f0f2f5',
        borderRadius: '8px',
        padding: '8px',
        marginBottom: '16px'
      };
    }
    return {};
  }, [tabBarStyle]);

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <Title level={3}>复杂配置</Title>
        <Paragraph>
          演示 SegmentedTabs
          组件的高级配置选项，包括动态标签页、样式定制和复杂交互。
        </Paragraph>

        <Card title="标签页配置" style={{ marginBottom: '20px' }}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <div style={{ marginBottom: '16px' }}>
                <Text strong>标签位置:</Text>
                <Select
                  value={tabPosition}
                  onChange={setTabPosition}
                  style={{ marginLeft: '8px', width: '100px' }}
                >
                  <Option value="top">顶部</Option>
                  <Option value="bottom">底部</Option>
                  <Option value="left">左侧</Option>
                  <Option value="right">右侧</Option>
                </Select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <Text strong>标签大小:</Text>
                <Select
                  value={tabSize}
                  onChange={setTabSize}
                  style={{ marginLeft: '8px', width: '100px' }}
                >
                  <Option value="large">大</Option>
                  <Option value="middle">中</Option>
                  <Option value="small">小</Option>
                </Select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <Text strong>标签类型:</Text>
                <Select
                  value={tabType}
                  onChange={setTabType}
                  style={{ marginLeft: '8px', width: '120px' }}
                >
                  <Option value="line">线条</Option>
                  <Option value="card">卡片</Option>
                  <Option value="editable-card">可编辑卡片</Option>
                </Select>
              </div>
            </Col>

            <Col span={8}>
              <div style={{ marginBottom: '16px' }}>
                <Text strong>居中对齐:</Text>
                <Switch
                  checked={centered}
                  onChange={setCentered}
                  style={{ marginLeft: '8px' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <Text strong>显示添加图标:</Text>
                <Switch
                  checked={addIcon}
                  onChange={setAddIcon}
                  style={{ marginLeft: '8px' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <Text strong>隐藏添加按钮:</Text>
                <Switch
                  checked={hideAdd}
                  onChange={setHideAdd}
                  style={{ marginLeft: '8px' }}
                />
              </div>
            </Col>

            <Col span={8}>
              <div style={{ marginBottom: '16px' }}>
                <Text strong>销毁非活动标签:</Text>
                <Switch
                  checked={destroyInactiveTabPane}
                  onChange={setDestroyInactiveTabPane}
                  style={{ marginLeft: '8px' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <Text strong>启用动画:</Text>
                <Switch
                  checked={animated}
                  onChange={setAnimated}
                  style={{ marginLeft: '8px' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <Text strong>标签间距:</Text>
                <InputNumber
                  min={0}
                  max={50}
                  value={tabBarGutter}
                  onChange={(value) => setTabBarGutter(value || 0)}
                  style={{ marginLeft: '8px', width: '60px' }}
                />
                <Text type="secondary" style={{ marginLeft: '4px' }}>
                  px
                </Text>
              </div>
            </Col>
          </Row>

          <Divider />

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div style={{ marginBottom: '16px' }}>
                <Text strong>标签栏样式:</Text>
                <Select
                  value={tabBarStyle}
                  onChange={setTabBarStyle}
                  style={{ marginLeft: '8px', width: '120px' }}
                >
                  <Option value="default">默认样式</Option>
                  <Option value="custom">自定义样式</Option>
                </Select>
              </div>
            </Col>
            <Col span={12}>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={addTab}
                  disabled={hideAdd}
                >
                  添加标签页
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    setDynamicTabs([
                      { value: 'tab1', label: '系统设置', closable: false },
                      { value: 'tab2', label: '用户管理', closable: true },
                      { value: 'tab3', label: '数据统计', closable: true },
                      { value: 'tab4', label: '日志查看', closable: true }
                    ]);
                    setActiveKey('tab1');
                  }}
                >
                  重置标签页
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card title="标签页演示">
          <div style={{ marginBottom: '16px' }}>
            <p>调整上方配置，观察标签页的变化效果：</p>
          </div>

          <SegmentedTabs
            activeKey={activeKey}
            onChange={setActiveKey}
            items={tabItems}
            animated={animated ? 'slide' : false}
          />

          <Divider />

          <div style={{ marginBottom: '16px' }}>
            <h4>配置特点:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>
                <strong>动态标签页</strong>: 支持动态添加、删除和编辑标签页
              </li>
              <li>
                <strong>位置灵活</strong>: 支持顶部、底部、左侧、右侧四种位置
              </li>
              <li>
                <strong>样式多样</strong>: 提供线条、卡片、可编辑卡片三种样式
              </li>
              <li>
                <strong>尺寸可选</strong>: 支持大、中、小三种尺寸规格
              </li>
            </ul>
          </div>

          <Divider />

          <div style={{ marginBottom: '16px' }}>
            <h4>高级功能:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>居中对齐选项，优化标签页布局</li>
              <li>自定义标签栏样式，支持主题定制</li>
              <li>标签间距控制，精确调整视觉效果</li>
              <li>销毁策略配置，平衡性能和用户体验</li>
            </ul>
          </div>

          <Divider />

          <div style={{ marginBottom: '16px' }}>
            <h4>使用建议:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>根据内容复杂度选择合适的标签类型</li>
              <li>在移动端考虑使用较小的标签尺寸</li>
              <li>动态标签页适合内容管理类应用</li>
              <li>自定义样式可以提升品牌一致性</li>
            </ul>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default ComplexConfigDemo;
