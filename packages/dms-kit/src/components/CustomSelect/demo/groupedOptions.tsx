import React, { useState } from 'react';
import { CustomSelect, ConfigProvider } from '@actiontech/dms-kit';
import { message, Space, Card } from 'antd';
import {
  UserOutlined,
  DatabaseOutlined,
  ProjectOutlined,
  TeamOutlined
} from '@ant-design/icons';

const GroupedOptionsDemo: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState<string>();

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
    },
    {
      label: '团队管理',
      options: [
        { label: '开发团队', value: 'dev' },
        { label: '测试团队', value: 'test' },
        { label: '运维团队', value: 'ops' },
        { label: '产品团队', value: 'product' }
      ]
    }
  ];

  const handleChange = (value: string) => {
    setSelectedValue(value);
    message.success(`选择了: ${value}`);
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>分组选项</h3>

        <Card title="基础分组选择器" style={{ marginBottom: '16px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <CustomSelect
              placeholder="请选择一个选项"
              options={groupedOptions}
              onChange={handleChange}
              style={{ width: '400px' }}
            />
            <div style={{ fontSize: '14px', color: '#666' }}>
              当前选择: {selectedValue || '未选择'}
            </div>
          </Space>
        </Card>

        <Card title="带前缀的分组选择器" style={{ marginBottom: '16px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <CustomSelect
              prefix={<UserOutlined />}
              placeholder="选择用户或项目"
              options={groupedOptions}
              onChange={handleChange}
              style={{ width: '400px' }}
            />
            <div style={{ fontSize: '14px', color: '#666' }}>
              当前选择: {selectedValue || '未选择'}
            </div>
          </Space>
        </Card>

        <Card title="多选分组选择器" style={{ marginBottom: '16px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <CustomSelect
              mode="multiple"
              prefix={<TeamOutlined />}
              placeholder="选择多个选项"
              options={groupedOptions}
              onChange={(values) => {
                console.log('多选值:', values);
                message.success(`选择了 ${values.length} 个选项`);
              }}
              style={{ width: '400px' }}
            />
          </Space>
        </Card>

        <Card title="复杂分组结构" style={{ marginBottom: '16px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <CustomSelect
              prefix={<ProjectOutlined />}
              placeholder="选择项目或数据库"
              options={[
                {
                  label: '核心项目',
                  options: [
                    { label: '用户中心', value: 'user-center' },
                    { label: '订单系统', value: 'order-system' },
                    { label: '支付系统', value: 'payment-system' }
                  ]
                },
                {
                  label: '数据库集群',
                  options: [
                    { label: '主库-MySQL', value: 'master-mysql' },
                    { label: '从库-MySQL', value: 'slave-mysql' },
                    { label: '读写分离', value: 'read-write-split' }
                  ]
                },
                {
                  label: '缓存系统',
                  options: [
                    { label: 'Redis主节点', value: 'redis-master' },
                    { label: 'Redis从节点', value: 'redis-slave' },
                    { label: 'Redis集群', value: 'redis-cluster' }
                  ]
                }
              ]}
              onChange={handleChange}
              style={{ width: '400px' }}
            />
          </Space>
        </Card>

        <Card title="分组选项特性" style={{ marginBottom: '16px' }}>
          <ul style={{ paddingLeft: '20px' }}>
            <li>
              <strong>层次结构</strong>: 支持多级分组，每个分组可以有独立的标签
            </li>
            <li>
              <strong>搜索过滤</strong>: 搜索功能会在所有分组中查找匹配的选项
            </li>
            <li>
              <strong>前缀显示</strong>: 分组标签和选项都可以显示前缀
            </li>
            <li>
              <strong>多选支持</strong>: 分组选择器支持单选和多选模式
            </li>
            <li>
              <strong>样式统一</strong>: 分组标签使用特殊的样式类名
            </li>
          </ul>
        </Card>

        <Card title="使用场景">
          <ul style={{ paddingLeft: '20px' }}>
            <li>
              <strong>组织架构</strong>: 按部门、团队分组显示人员
            </li>
            <li>
              <strong>系统分类</strong>: 按功能模块分组显示系统
            </li>
            <li>
              <strong>数据分类</strong>: 按类型分组显示数据项
            </li>
            <li>
              <strong>权限管理</strong>: 按角色分组显示权限
            </li>
            <li>
              <strong>配置管理</strong>: 按类别分组显示配置项
            </li>
          </ul>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default GroupedOptionsDemo;
