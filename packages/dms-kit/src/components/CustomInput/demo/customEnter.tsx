import React, { useState } from 'react';
import { CustomInput, ConfigProvider } from '@actiontech/dms-kit';
import { message, Button, Space, Card } from 'antd';

const CustomEnterDemo: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [sqlValue, setSqlValue] = useState('');
  const [commandValue, setCommandValue] = useState('');

  const handleSearch = (value: string) => {
    if (!value.trim()) {
      message.warning('请输入搜索内容');
      return;
    }
    message.success(`执行搜索: ${value}`);
    setSearchValue(value);
  };

  const handleSqlExecute = (value: string) => {
    if (!value.trim()) {
      message.warning('请输入SQL语句');
      return;
    }
    if (!value.toLowerCase().includes('select')) {
      message.error('请输入有效的SELECT语句');
      return;
    }
    message.success(`执行SQL: ${value}`);
    setSqlValue(value);
  };

  const handleCommandExecute = (value: string) => {
    if (!value.trim()) {
      message.warning('请输入命令');
      return;
    }
    message.success(`执行命令: ${value}`);
    setCommandValue(value);
  };

  const clearAll = () => {
    setSearchValue('');
    setSqlValue('');
    setCommandValue('');
    message.info('已清空所有输入');
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>自定义回车处理示例</h3>

        <Card title="搜索功能" style={{ marginBottom: '16px' }}>
          <CustomInput
            prefix="🔍"
            placeholder="输入关键词后按回车搜索"
            onCustomPressEnter={handleSearch}
            style={{ width: '100%', marginBottom: '8px' }}
          />
          {searchValue && (
            <div style={{ color: '#52c41a', fontSize: '14px' }}>
              当前搜索: {searchValue}
            </div>
          )}
        </Card>

        <Card title="SQL执行" style={{ marginBottom: '16px' }}>
          <CustomInput
            prefix="SQL"
            placeholder="输入SELECT语句后按回车执行"
            onCustomPressEnter={handleSqlExecute}
            style={{ width: '100%', marginBottom: '8px' }}
          />
          {sqlValue && (
            <div style={{ color: '#1890ff', fontSize: '14px' }}>
              当前SQL: {sqlValue}
            </div>
          )}
        </Card>

        <Card title="命令执行" style={{ marginBottom: '16px' }}>
          <CustomInput
            prefix=">"
            placeholder="输入命令后按回车执行"
            onCustomPressEnter={handleCommandExecute}
            style={{ width: '100%', marginBottom: '8px' }}
          />
          {commandValue && (
            <div style={{ color: '#722ed1', fontSize: '14px' }}>
              当前命令: {commandValue}
            </div>
          )}
        </Card>

        <Space>
          <Button type="primary" onClick={clearAll}>
            清空所有
          </Button>
          <Button onClick={() => message.info('按回车键可以快速提交输入内容')}>
            查看说明
          </Button>
        </Space>
      </div>
    </ConfigProvider>
  );
};

export default CustomEnterDemo;
