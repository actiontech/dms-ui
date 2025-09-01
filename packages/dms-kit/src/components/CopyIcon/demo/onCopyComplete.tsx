import React from 'react';
import { ConfigProvider } from '@actiontech/dms-kit';
import { message, notification } from 'antd';
import { CopyIcon } from '@actiontech/dms-kit';
import { Space, Typography, Card } from 'antd';

const { Text } = Typography;

const OnCopyCompleteDemo: React.FC = () => {
  const handleCopyComplete = (event?: React.MouseEvent<HTMLDivElement>) => {
    message.success('复制完成！');
    console.log('复制完成事件:', event);
  };

  const handleApiKeyCopyComplete = () => {
    notification.success({
      message: 'API 密钥已复制',
      description: '密钥已安全复制到剪贴板，请注意保护信息安全',
      duration: 4
    });
  };

  const handleConfigCopyComplete = () => {
    message.info('配置信息已复制，可在配置文件中使用');
  };

  const handleLogCopyComplete = () => {
    message.warning('日志内容已复制，请及时处理相关问题');
  };

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large">
        <div>
          <Text>基础复制完成回调：</Text>
          <CopyIcon text="基础复制内容" onCopyComplete={handleCopyComplete} />
        </div>

        <div>
          <Text>API 密钥复制完成：</Text>
          <CopyIcon
            text="sk-1234567890abcdef"
            onCopyComplete={handleApiKeyCopyComplete}
          />
        </div>

        <div>
          <Text>配置信息复制完成：</Text>
          <CopyIcon
            text="database.host=localhost\ndatabase.port=3306\ndatabase.name=dms"
            onCopyComplete={handleConfigCopyComplete}
          />
        </div>

        <div>
          <Text>日志内容复制完成：</Text>
          <CopyIcon
            text="ERROR: Connection timeout to database server"
            onCopyComplete={handleLogCopyComplete}
          />
        </div>

        <Card size="small" style={{ width: 400 }}>
          <Text strong>复制统计：</Text>
          <div style={{ marginTop: 8 }}>
            <Text>点击上方任意复制按钮，查看控制台输出和消息提示</Text>
          </div>
        </Card>
      </Space>
    </ConfigProvider>
  );
};

export default OnCopyCompleteDemo;
