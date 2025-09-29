import React, { useState } from 'react';
import {
  Card,
  Space,
  Typography,
  Divider,
  Button,
  Row,
  Col,
  Tag,
  Alert
} from 'antd';
import { EditText, ConfigProvider } from '@actiontech/dms-kit';
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  EyeOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const BasicDemo: React.FC = () => {
  const [userName, setUserName] = useState('张三');
  const [userEmail, setUserEmail] = useState('zhangsan@example.com');
  const [userBio, setUserBio] = useState(
    '前端开发工程师，专注于 React 和 TypeScript 开发'
  );
  const [companyName, setCompanyName] = useState('科技有限公司');

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <Title level={3}>基础使用</Title>
        <Paragraph>
          演示 EditText 组件的基本用法，包括文本编辑、状态管理和数据同步。
        </Paragraph>

        <Card title="用户信息编辑" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div style={{ marginBottom: '16px' }}>
                  <Text strong>用户名:</Text>
                  <div style={{ marginTop: '8px' }}>
                    <EditText
                      value={userName}
                      editable={{
                        onChange: setUserName
                      }}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: '16px' }}>
                  <Text strong>邮箱:</Text>
                  <div style={{ marginTop: '8px' }}>
                    <EditText
                      value={userEmail}
                      editable={{
                        onChange: setUserEmail
                      }}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </Col>
            </Row>

            <div style={{ marginBottom: '16px' }}>
              <Text strong>个人简介:</Text>
              <div style={{ marginTop: '8px' }}>
                <EditText
                  value={userBio}
                  editable={{
                    onChange: setUserBio
                  }}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Text strong>公司名称:</Text>
              <div style={{ marginTop: '8px' }}>
                <EditText
                  value={companyName}
                  editable={{
                    onChange: setCompanyName
                  }}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </Space>
        </Card>

        <Card title="编辑状态说明" style={{ marginBottom: '20px' }}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <div
                style={{
                  textAlign: 'center',
                  padding: '16px',
                  backgroundColor: '#f6ffed',
                  borderRadius: '8px'
                }}
              >
                <EditOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                <div style={{ marginTop: '8px' }}>
                  <Text strong>点击编辑</Text>
                </div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  点击文本进入编辑模式
                </Text>
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
                <SaveOutlined style={{ fontSize: '24px', color: '#faad14' }} />
                <div style={{ marginTop: '8px' }}>
                  <Text strong>保存更改</Text>
                </div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  按回车键或失去焦点保存
                </Text>
              </div>
            </Col>
            <Col span={8}>
              <div
                style={{
                  textAlign: 'center',
                  padding: '16px',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '8px'
                }}
              >
                <CloseOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                <div style={{ marginTop: '8px' }}>
                  <Text strong>取消编辑</Text>
                </div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  按 ESC 键取消编辑
                </Text>
              </div>
            </Col>
          </Row>
        </Card>

        <Card title="当前数据状态">
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <div
                style={{
                  textAlign: 'center',
                  padding: '16px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px'
                }}
              >
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#1890ff'
                  }}
                >
                  {userName}
                </div>
                <Text type="secondary">用户名</Text>
              </div>
            </Col>
            <Col span={6}>
              <div
                style={{
                  textAlign: 'center',
                  padding: '16px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px'
                }}
              >
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#52c41a'
                  }}
                >
                  {userEmail}
                </div>
                <Text type="secondary">邮箱</Text>
              </div>
            </Col>
            <Col span={6}>
              <div
                style={{
                  textAlign: 'center',
                  padding: '16px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px'
                }}
              >
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#faad14'
                  }}
                >
                  {companyName}
                </div>
                <Text type="secondary">公司</Text>
              </div>
            </Col>
            <Col span={6}>
              <div
                style={{
                  textAlign: 'center',
                  padding: '16px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px'
                }}
              >
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#722ed1'
                  }}
                >
                  {userBio.length}
                </div>
                <Text type="secondary">简介字符数</Text>
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
            <Text strong>个人简介预览:</Text>
            <div
              style={{
                marginTop: '8px',
                padding: '12px',
                backgroundColor: 'white',
                borderRadius: '4px',
                border: '1px solid #d9d9d9'
              }}
            >
              <Text>{userBio || '暂无简介'}</Text>
            </div>
          </div>
        </Card>

        <Divider />

        <div style={{ marginBottom: '16px' }}>
          <h4>功能特点:</h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>
              <strong>点击编辑</strong>: 点击文本即可进入编辑模式
            </li>
            <li>
              <strong>自动保存</strong>: 失去焦点或按回车键自动保存
            </li>
            <li>
              <strong>支持多行</strong>: 支持单行和多行文本编辑
            </li>
            <li>
              <strong>实时同步</strong>: 编辑内容实时同步到父组件
            </li>
          </ul>
        </div>

        <Divider />

        <div style={{ marginBottom: '16px' }}>
          <h4>使用场景:</h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>用户资料编辑：快速修改用户信息</li>
            <li>表格单元格编辑：内联编辑表格数据</li>
            <li>配置项修改：快速调整系统配置</li>
            <li>内容管理：编辑文章标题、描述等</li>
          </ul>
        </div>

        <Divider />

        <div style={{ marginBottom: '16px' }}>
          <h4>操作说明:</h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>
              <strong>进入编辑</strong>: 点击文本内容
            </li>
            <li>
              <strong>保存更改</strong>: 按回车键或失去焦点
            </li>
            <li>
              <strong>取消编辑</strong>: 按 ESC 键
            </li>
            <li>
              <strong>多行编辑</strong>: 支持自动换行和手动换行
            </li>
          </ul>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default BasicDemo;
