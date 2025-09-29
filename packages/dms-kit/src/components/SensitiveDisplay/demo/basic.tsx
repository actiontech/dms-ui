import React from 'react';
import { ConfigProvider } from '@actiontech/dms-kit';
import { Space, Typography, Card } from 'antd';
import { SensitiveDisplay } from '@actiontech/dms-kit';

const { Text, Title } = Typography;

const BasicDemo: React.FC = () => {
  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card size="small">
          <Title level={5}>基础敏感信息显示</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text>API 密钥：</Text>
              <SensitiveDisplay text="sk-1234567890abcdef" />
            </div>

            <div>
              <Text>访问令牌：</Text>
              <SensitiveDisplay text="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" />
            </div>

            <div>
              <Text>数据库密码：</Text>
              <SensitiveDisplay text="MySecurePassword123!" />
            </div>
          </Space>
        </Card>

        <Card size="small">
          <Title level={5}>使用说明</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>操作方式：</Text>
            </div>
            <div>
              <Text>• 默认状态：显示加密图标，隐藏实际内容</Text>
            </div>
            <div>
              <Text>• 点击图标：显示实际内容</Text>
            </div>
            <div>
              <Text>• 再次点击：隐藏内容，恢复加密图标</Text>
            </div>
            <div>
              <Text>• 悬停提示：显示操作说明</Text>
            </div>
            <div>
              <Text>• 复制功能：支持复制敏感信息</Text>
            </div>
          </Space>
        </Card>

        <Card size="small">
          <Title level={5}>适用场景</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>推荐使用场景：</Text>
            </div>
            <div>
              <Text>• API 密钥和访问令牌的展示</Text>
            </div>
            <div>
              <Text>• 数据库连接密码</Text>
            </div>
            <div>
              <Text>• 用户敏感信息</Text>
            </div>
            <div>
              <Text>• 系统配置中的敏感参数</Text>
            </div>
            <div>
              <Text>• 加密证书和私钥</Text>
            </div>
          </Space>
        </Card>
      </Space>
    </ConfigProvider>
  );
};

export default BasicDemo;
