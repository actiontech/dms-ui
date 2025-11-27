import React from 'react';
import { ConfigProvider, SensitiveDisplay } from '@actiontech/dms-kit';
import { Space, Typography, Descriptions } from 'antd';

const { Title } = Typography;

/**
 * 基础用法
 * - 默认隐藏敏感信息，显示加密图标
 * - 点击切换显示/隐藏状态
 * - 支持复制功能
 */
const BasicDemo: React.FC = () => {
  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={5}>基础示例</Title>
          <Descriptions column={1}>
            <Descriptions.Item label="API 密钥">
              <SensitiveDisplay text="sk-1234567890abcdef" />
            </Descriptions.Item>
            <Descriptions.Item label="访问令牌">
              <SensitiveDisplay text="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" />
            </Descriptions.Item>
            <Descriptions.Item label="数据库密码">
              <SensitiveDisplay text="MySecurePassword123!" />
            </Descriptions.Item>
          </Descriptions>
        </div>

        <div>
          <Title level={5}>超长文本（自动省略）</Title>
          <Descriptions column={1}>
            <Descriptions.Item label="私钥">
              <SensitiveDisplay text="-----BEGIN RSA PRIVATE KEY-----MIIEpQIBAAKCAQEA1234567890abcdef-----END RSA PRIVATE KEY-----" />
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default BasicDemo;
