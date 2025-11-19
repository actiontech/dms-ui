import React, { useState } from 'react';
import { CustomInput, ConfigProvider } from '@actiontech/dms-kit';
import { message, Space, Divider } from 'antd';

/**
 * 自定义回车处理
 * - 搜索场景：按回车触发搜索
 * - SQL执行场景：按回车执行SQL
 * - 命令执行场景：按回车执行命令
 * - 带验证的回车处理
 */
const CustomEnterDemo: React.FC = () => {
  const [searchResult, setSearchResult] = useState('');
  const [sqlResult, setSqlResult] = useState('');

  // 搜索场景
  const handleSearch = (value: string) => {
    if (!value.trim()) {
      message.warning('请输入搜索内容');
      return;
    }
    setSearchResult(value);
    message.success(`搜索: ${value}`);
  };

  // SQL执行场景（带验证）
  const handleSqlExecute = (value: string) => {
    if (!value.trim()) {
      message.warning('请输入SQL语句');
      return;
    }
    if (!value.toLowerCase().includes('select')) {
      message.error('请输入有效的SELECT语句');
      return;
    }
    setSqlResult(value);
    message.success('SQL执行成功');
  };

  // 命令执行场景
  const handleCommandExecute = (value: string) => {
    if (!value.trim()) {
      message.warning('请输入命令');
      return;
    }
    message.success(`执行命令: ${value}`);
  };

  return (
    <ConfigProvider>
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* 搜索场景 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>
          搜索场景（按回车触发搜索）：
        </div>
        <CustomInput
          prefix="🔍"
          placeholder="输入关键词后按回车搜索"
          onCustomPressEnter={handleSearch}
          style={{ width: '400px' }}
        />
        {searchResult && (
          <div style={{ color: '#52c41a', fontSize: '14px', marginTop: '4px' }}>
            当前搜索: {searchResult}
          </div>
        )}

        <Divider />

        {/* SQL执行场景（带验证） */}
        <div style={{ color: '#666', marginBottom: '8px' }}>
          SQL执行场景（带验证，只允许SELECT语句）：
        </div>
        <CustomInput
          prefix="SQL"
          placeholder="输入SELECT语句后按回车执行"
          onCustomPressEnter={handleSqlExecute}
          style={{ width: '400px' }}
        />
        {sqlResult && (
          <div style={{ color: '#1890ff', fontSize: '14px', marginTop: '4px' }}>
            已执行: {sqlResult}
          </div>
        )}

        <Divider />

        {/* 命令执行场景 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>
          命令执行场景（按回车执行命令）：
        </div>
        <CustomInput
          prefix=">"
          placeholder="输入命令后按回车执行"
          onCustomPressEnter={handleCommandExecute}
          style={{ width: '400px' }}
        />
      </Space>
    </ConfigProvider>
  );
};

export default CustomEnterDemo;
