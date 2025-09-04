import React from 'react';
import { ConfigProvider } from '@actiontech/dms-kit';
import { CopyIcon } from '@actiontech/dms-kit';
import { Space, Typography } from 'antd';

const { Text } = Typography;

const BasicDemo: React.FC = () => {
  return (
    <ConfigProvider>
      <Space direction="vertical" size="large">
        <div>
          <Text>复制文本内容：</Text>
          <CopyIcon text="这是要复制的文本内容" />
        </div>

        <div>
          <Text>复制配置信息：</Text>
          <CopyIcon text="database_url=mysql://localhost:3306/dms" />
        </div>

        <div>
          <Text>复制 SQL 语句：</Text>
          <CopyIcon text="SELECT * FROM users WHERE status = 'active'" />
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default BasicDemo;
