import React, { useState } from 'react';
import { CustomSelect, ConfigProvider } from '@actiontech/dms-kit';
import { message, Space, Card } from 'antd';
import { 
  UserOutlined, 
  DatabaseOutlined, 
  ProjectOutlined, 
  TeamOutlined,
  SettingOutlined 
} from '@ant-design/icons';

const WithPrefixDemo: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState<string>();

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

  const projectOptions = [
    { label: '电商系统', value: 'ecommerce' },
    { label: 'CRM系统', value: 'crm' },
    { label: 'ERP系统', value: 'erp' },
    { label: '数据分析平台', value: 'analytics' }
  ];

  const teamOptions = [
    { label: '开发团队', value: 'dev' },
    { label: '测试团队', value: 'test' },
    { label: '运维团队', value: 'ops' },
    { label: '产品团队', value: 'product' }
  ];

  const settingOptions = [
    { label: '系统配置', value: 'system' },
    { label: '用户配置', value: 'user' },
    { label: '安全配置', value: 'security' },
    { label: '网络配置', value: 'network' }
  ];

  const handleChange = (value: string) => {
    setSelectedValue(value);
    message.success(`选择了: ${value}`);
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>带前缀的选择器</h3>
        
        <Card title="图标前缀" style={{ marginBottom: '16px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <CustomSelect
              prefix={<UserOutlined />}
              placeholder="选择用户"
              options={userOptions}
              onChange={handleChange}
              style={{ width: '300px' }}
            />
            <CustomSelect
              prefix={<DatabaseOutlined />}
              placeholder="选择数据库"
              options={databaseOptions}
              onChange={handleChange}
              style={{ width: '300px' }}
            />
            <CustomSelect
              prefix={<ProjectOutlined />}
              placeholder="选择项目"
              options={projectOptions}
              onChange={handleChange}
              style={{ width: '300px' }}
            />
          </Space>
        </Card>

        <Card title="文本前缀" style={{ marginBottom: '16px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <CustomSelect
              prefix="团队:"
              placeholder="选择团队"
              options={teamOptions}
              onChange={handleChange}
              style={{ width: '300px' }}
            />
            <CustomSelect
              prefix="配置:"
              placeholder="选择配置类型"
              options={settingOptions}
              onChange={handleChange}
              style={{ width: '300px' }}
            />
          </Space>
        </Card>

        <Card title="自定义值前缀" style={{ marginBottom: '16px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <CustomSelect
              prefix={<UserOutlined />}
              valuePrefix={<TeamOutlined />}
              placeholder="选择用户（值前缀不同）"
              options={userOptions}
              onChange={handleChange}
              style={{ width: '300px' }}
            />
            <div style={{ fontSize: '12px', color: '#666' }}>
              说明：prefix 显示在选择器上，valuePrefix 显示在选项标签中
            </div>
          </Space>
        </Card>

        <Card title="混合前缀类型" style={{ marginBottom: '16px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <CustomSelect
              prefix="🔍"
              placeholder="搜索类型"
              options={[
                { label: '全文搜索', value: 'fulltext' },
                { label: '精确匹配', value: 'exact' },
                { label: '模糊搜索', value: 'fuzzy' }
              ]}
              onChange={handleChange}
              style={{ width: '300px' }}
            />
            <CustomSelect
              prefix={<SettingOutlined />}
              placeholder="系统设置"
              options={[
                { label: '界面设置', value: 'ui' },
                { label: '功能设置', value: 'feature' },
                { label: '权限设置', value: 'permission' }
              ]}
              onChange={handleChange}
              style={{ width: '300px' }}
            />
          </Space>
        </Card>

        <Card title="当前选择">
          <div style={{ fontSize: '14px', color: '#1890ff' }}>
            当前选择: {selectedValue || '未选择'}
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default WithPrefixDemo;
