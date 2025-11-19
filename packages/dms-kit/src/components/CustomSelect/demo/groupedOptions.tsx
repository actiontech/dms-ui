import React, { useState } from 'react';
import { CustomSelect, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Divider } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';

/**
 * 分组选项
 * - 支持多级分组结构
 * - 搜索时在所有分组中过滤
 * - 支持分组单选和多选
 */
const GroupedOptionsDemo: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState<string>();
  const [selectedMultiple, setSelectedMultiple] = useState<string[]>([]);

  const groupedOptions = [
    {
      label: '用户管理',
      options: [
        { label: '张三', value: 'zhangsan' },
        { label: '李四', value: 'lisi' },
        { label: '王五', value: 'wangwu' },
        { label: '赵六', value: 'zhaoliu' }
      ]
    },
    {
      label: '数据库管理',
      options: [
        { label: 'MySQL', value: 'mysql' },
        { label: 'PostgreSQL', value: 'postgresql' },
        { label: 'Oracle', value: 'oracle' },
        { label: 'SQL Server', value: 'sqlserver' }
      ]
    },
    {
      label: '项目管理',
      options: [
        { label: '电商系统', value: 'ecommerce' },
        { label: 'CRM系统', value: 'crm' },
        { label: 'ERP系统', value: 'erp' },
        { label: '数据分析平台', value: 'analytics' }
      ]
    }
  ];

  return (
    <ConfigProvider>
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* 分组单选 */}
        <div style={{ color: '#666' }}>分组单选：</div>
        <CustomSelect
          prefix={<UserOutlined />}
          placeholder="请选择一个选项"
          options={groupedOptions}
          value={selectedValue}
          onChange={setSelectedValue}
          style={{ width: '400px' }}
        />

        <Divider />

        {/* 分组多选 */}
        <div style={{ color: '#666' }}>分组多选：</div>
        <CustomSelect
          mode="multiple"
          prefix={<TeamOutlined />}
          placeholder="选择多个选项"
          options={groupedOptions}
          value={selectedMultiple}
          onChange={setSelectedMultiple}
          style={{ width: '100%' }}
        />
        <div style={{ marginTop: '8px', color: '#666' }}>
          已选择 {selectedMultiple.length} 个选项
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default GroupedOptionsDemo;
