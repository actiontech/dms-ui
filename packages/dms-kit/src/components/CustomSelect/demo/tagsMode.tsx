import React, { useState } from 'react';
import { CustomSelect, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Tag, Divider } from 'antd';
import { UserOutlined, DatabaseOutlined } from '@ant-design/icons';

/**
 * 多选模式
 * - multiple 模式：只能选择已有选项
 * - tags 模式：可以输入自定义标签
 * - 第一个标签显示前缀
 */
const TagsModeDemo: React.FC = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedDatabases, setSelectedDatabases] = useState<string[]>([]);

  const userOptions = [
    { label: '张三', value: 'zhangsan' },
    { label: '李四', value: 'lisi' },
    { label: '王五', value: 'wangwu' },
    { label: '赵六', value: 'zhaoliu' }
  ];

  const databaseOptions = [
    { label: 'MySQL', value: 'mysql' },
    { label: 'PostgreSQL', value: 'postgresql' },
    { label: 'Oracle', value: 'oracle' },
    { label: 'SQL Server', value: 'sqlserver' }
  ];

  return (
    <ConfigProvider>
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* multiple 模式 */}
        <div style={{ color: '#666' }}>multiple 模式（只能选择已有选项）：</div>
        <CustomSelect
          mode="multiple"
          prefix={<UserOutlined />}
          placeholder="选择多个用户"
          options={userOptions}
          value={selectedUsers}
          onChange={setSelectedUsers}
          style={{ width: '100%' }}
        />
        <div style={{ marginTop: '8px' }}>
          <span style={{ marginRight: '8px', color: '#666' }}>
            已选择 {selectedUsers.length} 个:
          </span>
          {selectedUsers.map((user) => (
            <Tag key={user} color="blue">
              {userOptions.find((opt) => opt.value === user)?.label}
            </Tag>
          ))}
        </div>

        <Divider />

        {/* tags 模式 */}
        <div style={{ color: '#666' }}>tags 模式（可输入自定义标签）：</div>
        <CustomSelect
          mode="tags"
          prefix={<DatabaseOutlined />}
          placeholder="选择或输入数据库"
          options={databaseOptions}
          value={selectedDatabases}
          onChange={setSelectedDatabases}
          style={{ width: '100%' }}
        />
        <div style={{ marginTop: '8px' }}>
          <span style={{ marginRight: '8px', color: '#666' }}>
            已选择 {selectedDatabases.length} 个:
          </span>
          {selectedDatabases.map((db) => (
            <Tag key={db} color="green">
              {db}
            </Tag>
          ))}
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default TagsModeDemo;
