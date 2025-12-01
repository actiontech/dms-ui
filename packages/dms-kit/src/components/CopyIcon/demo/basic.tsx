import React from 'react';
import { ConfigProvider, CopyIcon } from '@actiontech/dms-kit';
import { Space, Typography, message } from 'antd';

const { Text, Title } = Typography;

/**
 * 基础用法
 * - 点击图标复制文本
 * - 复制成功显示 CheckOutlined 图标
 * - 禁用提示
 * - 复制完成回调
 */
const BasicDemo: React.FC = () => {
  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={5}>默认用法</Title>
          <Space direction="vertical">
            <Space>
              <Text>复制文本：</Text>
              <CopyIcon text="这是要复制的文本内容" />
            </Space>
            <Space>
              <Text>复制配置：</Text>
              <CopyIcon text="database_url=mysql://localhost:3306/dms" />
            </Space>
            <Space>
              <Text>复制 SQL：</Text>
              <CopyIcon text="SELECT * FROM users WHERE status = 'active'" />
            </Space>
          </Space>
        </div>

        <div>
          <Title level={5}>禁用提示</Title>
          <Space>
            <Text>复制时不显示提示：</Text>
            <CopyIcon text="无提示的复制内容" tooltips={false} />
          </Space>
        </div>

        <div>
          <Title level={5}>自定义提示</Title>
          <Space>
            <Text>复制成功显示自定义提示：</Text>
            <CopyIcon text="自定义提示的内容" tooltips="已复制到剪贴板！" />
          </Space>
        </div>

        <div>
          <Title level={5}>复制完成回调</Title>
          <Space>
            <Text>复制成功后显示 Message：</Text>
            <CopyIcon
              text="复制成功的内容"
              onCopyComplete={() => message.success('复制成功！')}
            />
          </Space>
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default BasicDemo;
