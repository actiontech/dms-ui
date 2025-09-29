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
  Tag,
  Alert,
  Select
} from 'antd';
import { EditText, ConfigProvider } from '@actiontech/dms-kit';
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  LockOutlined,
  UnlockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const EditModeDemo: React.FC = () => {
  const [editingMode, setEditingMode] = useState<'auto' | 'controlled'>('auto');
  const [controlledEditing, setControlledEditing] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  // 受控模式的数据
  const [controlledText, setControlledText] = useState('这是受控模式的文本');
  const [controlledEditingState, setControlledEditingState] = useState(false);

  // 自动模式的数据
  const [autoText, setAutoText] = useState('这是自动模式的文本');
  const [autoText2, setAutoText2] = useState('支持占位符的文本');

  // 处理受控模式的编辑状态变化
  const handleEditChange = (editing: boolean) => {
    setControlledEditingState(editing);
  };

  // 处理受控模式的文本变化
  const handleTextChange = (value: string) => {
    setControlledText(value);
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <Title level={3}>编辑模式</Title>
        <Paragraph>
          演示 EditText
          组件的不同编辑模式，包括自动模式和受控模式，以及编辑状态的控制。
        </Paragraph>

        <Card title="编辑模式配置" style={{ marginBottom: '20px' }}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <div style={{ marginBottom: '16px' }}>
                <Text strong>编辑模式:</Text>
                <Select
                  value={editingMode}
                  onChange={setEditingMode}
                  style={{ marginLeft: '8px', width: '120px' }}
                >
                  <Option value="auto">自动模式</Option>
                  <Option value="controlled">受控模式</Option>
                </Select>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ marginBottom: '16px' }}>
                <Text strong>禁用状态:</Text>
                <Switch
                  checked={disabled}
                  onChange={setDisabled}
                  style={{ marginLeft: '8px' }}
                />
                <Tag
                  color={disabled ? 'red' : 'green'}
                  style={{ marginLeft: '8px' }}
                >
                  {disabled ? '已禁用' : '已启用'}
                </Tag>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ marginBottom: '16px' }}>
                <Text strong>显示占位符:</Text>
                <Switch
                  checked={showPlaceholder}
                  onChange={setShowPlaceholder}
                  style={{ marginLeft: '8px' }}
                />
                <Tag
                  color={showPlaceholder ? 'green' : 'red'}
                  style={{ marginLeft: '8px' }}
                >
                  {showPlaceholder ? '显示' : '隐藏'}
                </Tag>
              </div>
            </Col>
          </Row>

          {editingMode === 'controlled' && (
            <div style={{ marginTop: '16px' }}>
              <Text strong>受控编辑状态:</Text>
              <Switch
                checked={controlledEditing}
                onChange={setControlledEditing}
                style={{ marginLeft: '8px' }}
              />
              <Tag
                color={controlledEditing ? 'green' : 'red'}
                style={{ marginLeft: '8px' }}
              >
                {controlledEditing ? '编辑中' : '显示中'}
              </Tag>
            </div>
          )}
        </Card>

        <Row gutter={[16, 16]}>
          {/* 左侧：自动模式 */}
          <Col span={12}>
            <Card
              title={
                <Space>
                  <EditOutlined />
                  <span>自动模式</span>
                  <Tag color="blue">默认</Tag>
                </Space>
              }
              style={{ marginBottom: '20px' }}
            >
              <div style={{ marginBottom: '16px' }}>
                <Text strong>基础文本编辑:</Text>
                <div style={{ marginTop: '8px' }}>
                  <EditText
                    value={autoText}
                    editable={{
                      onChange: setAutoText
                    }}
                    disabled={disabled}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <Text strong>带占位符的编辑:</Text>
                <div style={{ marginTop: '8px' }}>
                  <EditText
                    value={autoText2}
                    editable={{
                      onChange: setAutoText2
                    }}
                    disabled={disabled}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <Divider />

              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#f6ffed',
                  borderRadius: '4px'
                }}
              >
                <Text type="secondary">
                  <strong>自动模式特点:</strong>
                  <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
                    <li>点击文本自动进入编辑模式</li>
                    <li>失去焦点或按回车自动保存</li>
                    <li>按 ESC 键取消编辑</li>
                    <li>编辑状态由组件内部管理</li>
                  </ul>
                </Text>
              </div>
            </Card>
          </Col>

          {/* 右侧：受控模式 */}
          <Col span={12}>
            <Card
              title={
                <Space>
                  <SaveOutlined />
                  <span>受控模式</span>
                  <Tag color="green">可控</Tag>
                </Space>
              }
              style={{ marginBottom: '20px' }}
            >
              <div style={{ marginBottom: '16px' }}>
                <Text strong>受控文本编辑:</Text>
                <div style={{ marginTop: '8px' }}>
                  <EditText
                    value={controlledText}
                    editable={{
                      onChange: handleTextChange,
                      editing: controlledEditing,
                      onEnd: handleTextChange
                    }}
                    disabled={disabled}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <Text strong>编辑状态控制:</Text>
                <div style={{ marginTop: '8px' }}>
                  <Space>
                    <Button
                      type="primary"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => setControlledEditing(true)}
                      disabled={controlledEditing}
                    >
                      进入编辑
                    </Button>
                    <Button
                      size="small"
                      icon={<SaveOutlined />}
                      onClick={() => setControlledEditing(false)}
                      disabled={!controlledEditing}
                    >
                      保存
                    </Button>
                    <Button
                      size="small"
                      icon={<CloseOutlined />}
                      onClick={() => setControlledEditing(false)}
                      disabled={!controlledEditing}
                    >
                      取消
                    </Button>
                  </Space>
                </div>
              </div>

              <Divider />

              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#fff7e6',
                  borderRadius: '4px'
                }}
              >
                <Text type="secondary">
                  <strong>受控模式特点:</strong>
                  <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
                    <li>编辑状态由外部控制</li>
                    <li>可以精确控制何时进入/退出编辑</li>
                    <li>支持复杂的编辑逻辑</li>
                    <li>适合需要验证或确认的场景</li>
                  </ul>
                </Text>
              </div>
            </Card>
          </Col>
        </Row>

        <Card title="编辑状态监控">
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <div
                style={{
                  textAlign: 'center',
                  padding: '16px',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '8px'
                }}
              >
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#1890ff'
                  }}
                >
                  {editingMode}
                </div>
                <Text type="secondary">当前模式</Text>
              </div>
            </Col>
            <Col span={8}>
              <div
                style={{
                  textAlign: 'center',
                  padding: '16px',
                  backgroundColor: '#f6ffed',
                  borderRadius: '8px'
                }}
              >
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#52c41a'
                  }}
                >
                  {controlledEditingState ? '编辑中' : '显示中'}
                </div>
                <Text type="secondary">受控状态</Text>
              </div>
            </Col>
            <Col span={8}>
              <div
                style={{
                  textAlign: 'center',
                  padding: '16px',
                  backgroundColor: '#fff7e6',
                  borderRadius: '8px'
                }}
              >
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#faad14'
                  }}
                >
                  {disabled ? '已禁用' : '已启用'}
                </div>
                <Text type="secondary">组件状态</Text>
              </div>
            </Col>
          </Row>

          <Divider />

          <div
            style={{
              padding: '16px',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px'
            }}
          >
            <Text strong>当前文本内容:</Text>
            <Row gutter={[16, 16]} style={{ marginTop: '12px' }}>
              <Col span={12}>
                <div
                  style={{
                    padding: '8px',
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    border: '1px solid #d9d9d9'
                  }}
                >
                  <Text strong>自动模式:</Text>
                  <div style={{ marginTop: '4px' }}>
                    <Text>{autoText || '暂无内容'}</Text>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div
                  style={{
                    padding: '8px',
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    border: '1px solid #d9d9d9'
                  }}
                >
                  <Text strong>受控模式:</Text>
                  <div style={{ marginTop: '4px' }}>
                    <Text>{controlledText || '暂无内容'}</Text>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Card>

        <Divider />

        <div style={{ marginBottom: '16px' }}>
          <h4>编辑模式对比:</h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>
              <strong>自动模式</strong>: 适合简单的内联编辑，用户体验流畅
            </li>
            <li>
              <strong>受控模式</strong>: 适合需要精确控制的复杂编辑场景
            </li>
            <li>
              <strong>状态管理</strong>:
              自动模式由组件内部管理，受控模式由外部控制
            </li>
            <li>
              <strong>适用场景</strong>: 根据业务需求选择合适的编辑模式
            </li>
          </ul>
        </div>

        <Divider />

        <div style={{ marginBottom: '16px' }}>
          <h4>使用建议:</h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>对于简单的文本编辑，推荐使用自动模式</li>
            <li>对于需要验证、确认或复杂逻辑的编辑，使用受控模式</li>
            <li>合理使用禁用状态，避免用户误操作</li>
            <li>提供清晰的占位符文本，提升用户体验</li>
          </ul>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default EditModeDemo;
