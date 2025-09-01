import React, { useState } from 'react';
import { CustomSelect, ConfigProvider } from '@actiontech/dms-kit';
import { message, Space, Card, Tag } from 'antd';
import { UserOutlined, DatabaseOutlined, ProjectOutlined } from '@ant-design/icons';

const TagsModeDemo: React.FC = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedDatabases, setSelectedDatabases] = useState<string[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  const userOptions = [
    { label: '张三', value: 'zhangsan' },
    { label: '李四', value: 'lisi' },
    { label: '王五', value: 'wangwu' },
    { label: '赵六', value: 'zhaoliu' },
    { label: '钱七', value: 'qianqi' },
    { label: '孙八', value: 'sunba' }
  ];

  const databaseOptions = [
    { label: 'MySQL', value: 'mysql' },
    { label: 'PostgreSQL', value: 'postgresql' },
    { label: 'Oracle', value: 'oracle' },
    { label: 'SQL Server', value: 'sqlserver' },
    { label: 'MongoDB', value: 'mongodb' },
    { label: 'Redis', value: 'redis' }
  ];

  const projectOptions = [
    { label: '电商系统', value: 'ecommerce' },
    { label: 'CRM系统', value: 'crm' },
    { label: 'ERP系统', value: 'erp' },
    { label: '数据分析平台', value: 'analytics' },
    { label: '移动应用', value: 'mobile' },
    { label: 'Web应用', value: 'web' }
  ];

  const handleUserChange = (values: string[]) => {
    setSelectedUsers(values);
    message.success(`用户选择已更新: ${values.join(', ')}`);
  };

  const handleDatabaseChange = (values: string[]) => {
    setSelectedDatabases(values);
    message.success(`数据库选择已更新: ${values.join(', ')}`);
  };

  const handleProjectChange = (values: string[]) => {
    setSelectedProjects(values);
    message.success(`项目选择已更新: ${values.join(', ')}`);
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>标签模式</h3>
        
        <Card title="用户多选" style={{ marginBottom: '16px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <CustomSelect
              mode="multiple"
              prefix={<UserOutlined />}
              placeholder="选择多个用户"
              options={userOptions}
              onChange={handleUserChange}
              style={{ width: '100%' }}
            />
            <div style={{ marginTop: '8px' }}>
              <span style={{ marginRight: '8px', color: '#666' }}>已选择:</span>
              {selectedUsers.map(user => (
                <Tag key={user} color="blue" style={{ marginBottom: '4px' }}>
                  {userOptions.find(opt => opt.value === user)?.label}
                </Tag>
              ))}
            </div>
          </Space>
        </Card>

        <Card title="数据库多选" style={{ marginBottom: '16px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <CustomSelect
              mode="multiple"
              prefix={<DatabaseOutlined />}
              placeholder="选择多个数据库"
              options={databaseOptions}
              onChange={handleDatabaseChange}
              style={{ width: '100%' }}
            />
            <div style={{ marginTop: '8px' }}>
              <span style={{ marginRight: '8px', color: '#666' }}>已选择:</span>
              {selectedDatabases.map(db => (
                <Tag key={db} color="green" style={{ marginBottom: '4px' }}>
                  {databaseOptions.find(opt => opt.value === db)?.label}
                </Tag>
              ))}
            </div>
          </Space>
        </Card>

        <Card title="项目多选" style={{ marginBottom: '16px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <CustomSelect
              mode="multiple"
              prefix={<ProjectOutlined />}
              placeholder="选择多个项目"
              options={projectOptions}
              onChange={handleProjectChange}
              style={{ width: '100%' }}
            />
            <div style={{ marginTop: '8px' }}>
              <span style={{ marginRight: '8px', color: '#666' }}>已选择:</span>
              {selectedProjects.map(project => (
                <Tag key={project} color="purple" style={{ marginBottom: '4px' }}>
                  {projectOptions.find(opt => opt.value === project)?.label}
                </Tag>
              ))}
            </div>
          </Space>
        </Card>

        <Card title="标签模式特性" style={{ marginBottom: '16px' }}>
          <ul style={{ paddingLeft: '20px' }}>
            <li>支持多选模式，可以同时选择多个选项</li>
            <li>第一个标签会显示前缀图标</li>
            <li>后续标签使用分隔符显示</li>
            <li>支持搜索和过滤功能</li>
            <li>可以单独删除每个标签</li>
          </ul>
        </Card>

        <Card title="选择统计">
          <Space size="large">
            <div>
              <span style={{ color: '#666' }}>用户:</span>
              <span style={{ color: '#1890ff', fontWeight: 'bold', marginLeft: '8px' }}>
                {selectedUsers.length}
              </span>
            </div>
            <div>
              <span style={{ color: '#666' }}>数据库:</span>
              <span style={{ color: '#52c41a', fontWeight: 'bold', marginLeft: '8px' }}>
                {selectedDatabases.length}
              </span>
            </div>
            <div>
              <span style={{ color: '#666' }}>项目:</span>
              <span style={{ color: '#722ed1', fontWeight: 'bold', marginLeft: '8px' }}>
                {selectedProjects.length}
              </span>
            </div>
          </Space>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default TagsModeDemo;
