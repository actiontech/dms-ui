import React, { useState } from 'react';
import { CustomSelect, ConfigProvider } from '@actiontech/dms-kit';
import { message, Space, Card, Tag } from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  DatabaseOutlined,
  ProjectOutlined
} from '@ant-design/icons';

const SearchFunctionDemo: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState<string>();
  const [searchValue, setSearchValue] = useState<string>('');

  const allOptions = [
    { label: '张三', value: 'zhangsan' },
    { label: '李四', value: 'lisi' },
    { label: '王五', value: 'wangwu' },
    { label: '赵六', value: 'zhaoliu' },
    { label: '钱七', value: 'qianqi' },
    { label: '孙八', value: 'sunba' },
    { label: '周九', value: 'zhoujiu' },
    { label: '吴十', value: 'wushi' },
    { label: 'MySQL', value: 'mysql' },
    { label: 'PostgreSQL', value: 'postgresql' },
    { label: 'Oracle', value: 'oracle' },
    { label: 'SQL Server', value: 'sqlserver' },
    { label: 'MongoDB', value: 'mongodb' },
    { label: 'Redis', value: 'redis' },
    { label: '电商系统', value: 'ecommerce' },
    { label: 'CRM系统', value: 'crm' },
    { label: 'ERP系统', value: 'erp' },
    { label: '数据分析平台', value: 'analytics' },
    { label: '移动应用', value: 'mobile' },
    { label: 'Web应用', value: 'web' }
  ];

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

  const handleChange = (value: string) => {
    setSelectedValue(value);
    message.success(`选择了: ${value}`);
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    console.log('搜索关键词:', value);
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>搜索功能</h3>

        <Card title="基础搜索功能" style={{ marginBottom: '16px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <CustomSelect
              prefix={<SearchOutlined />}
              placeholder="输入关键词搜索选项"
              options={allOptions}
              onChange={handleChange}
              onSearch={handleSearch}
              style={{ width: '400px' }}
            />
            <div style={{ fontSize: '14px', color: '#666' }}>
              当前选择: {selectedValue || '未选择'}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              搜索关键词: {searchValue || '无'}
            </div>
          </Space>
        </Card>

        <Card title="分组选项搜索" style={{ marginBottom: '16px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <CustomSelect
              prefix={<DatabaseOutlined />}
              placeholder="在分组中搜索选项"
              options={groupedOptions}
              onChange={handleChange}
              onSearch={handleSearch}
              style={{ width: '400px' }}
            />
            <div style={{ fontSize: '12px', color: '#999' }}>
              搜索功能会在所有分组中查找匹配的选项
            </div>
          </Space>
        </Card>

        <Card title="多选搜索" style={{ marginBottom: '16px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <CustomSelect
              mode="multiple"
              prefix={<UserOutlined />}
              placeholder="搜索并选择多个用户"
              options={allOptions.filter(
                (opt) =>
                  opt.label.includes('张') ||
                  opt.label.includes('李') ||
                  opt.label.includes('王') ||
                  opt.label.includes('赵')
              )}
              onChange={(values) => {
                console.log('多选值:', values);
                message.success(`选择了 ${values.length} 个用户`);
              }}
              onSearch={handleSearch}
              style={{ width: '400px' }}
            />
            <div style={{ fontSize: '12px', color: '#999' }}>
              只显示用户相关的选项，支持搜索和多选
            </div>
          </Space>
        </Card>

        <Card title="搜索功能特性" style={{ marginBottom: '16px' }}>
          <ul style={{ paddingLeft: '20px' }}>
            <li>
              <strong>自动聚焦</strong>: 下拉框打开时搜索输入框自动获得焦点
            </li>
            <li>
              <strong>实时过滤</strong>: 输入关键词时实时过滤选项
            </li>
            <li>
              <strong>分组搜索</strong>: 在分组选项中也能进行搜索
            </li>
            <li>
              <strong>大小写不敏感</strong>: 搜索不区分大小写
            </li>
            <li>
              <strong>模糊匹配</strong>: 支持部分关键词匹配
            </li>
            <li>
              <strong>搜索回调</strong>: 提供 onSearch 回调函数
            </li>
          </ul>
        </Card>

        <Card title="搜索使用技巧" style={{ marginBottom: '16px' }}>
          <ul style={{ paddingLeft: '20px' }}>
            <li>
              <strong>关键词搜索</strong>: 输入部分名称即可快速找到选项
            </li>
            <li>
              <strong>中文搜索</strong>: 支持中文关键词搜索
            </li>
            <li>
              <strong>英文搜索</strong>: 支持英文关键词搜索
            </li>
            <li>
              <strong>数字搜索</strong>: 支持数字关键词搜索
            </li>
            <li>
              <strong>组合搜索</strong>: 可以搜索多个关键词
            </li>
          </ul>
        </Card>

        <Card title="搜索场景示例">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <strong>用户搜索:</strong>
              <Tag color="blue">张</Tag>
              <Tag color="blue">李</Tag>
              <Tag color="blue">王</Tag>
              <Tag color="blue">赵</Tag>
            </div>
            <div>
              <strong>数据库搜索:</strong>
              <Tag color="green">MySQL</Tag>
              <Tag color="green">PostgreSQL</Tag>
              <Tag color="green">Oracle</Tag>
            </div>
            <div>
              <strong>项目搜索:</strong>
              <Tag color="purple">电商</Tag>
              <Tag color="purple">CRM</Tag>
              <Tag color="purple">ERP</Tag>
            </div>
            <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
              点击标签可以快速搜索对应的关键词
            </div>
          </Space>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default SearchFunctionDemo;
