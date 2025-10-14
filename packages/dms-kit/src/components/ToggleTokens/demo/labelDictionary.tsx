import React, { useState } from 'react';
import { Card, Space, Tag, Divider, Switch } from 'antd';
import { ToggleTokens, ConfigProvider } from '@actiontech/dms-kit';

const LabelDictionaryDemo: React.FC = () => {
  const [useEnglish, setUseEnglish] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('pending');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    'mysql',
    'postgresql'
  ]);

  // 英文标签字典
  const englishLabels = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    cancelled: 'Cancelled',
    mysql: 'MySQL',
    postgresql: 'PostgreSQL',
    oracle: 'Oracle',
    sqlserver: 'SQL Server',
    mongodb: 'MongoDB'
  };

  // 中文标签字典
  const chineseLabels = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝',
    cancelled: '已取消',
    mysql: 'MySQL 数据库',
    postgresql: 'PostgreSQL 数据库',
    oracle: 'Oracle 数据库',
    sqlserver: 'SQL Server 数据库',
    mongodb: 'MongoDB 数据库'
  };

  // 当前使用的标签字典
  const currentLabels = useEnglish ? englishLabels : chineseLabels;

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>标签字典支持</h3>

        <Card title="语言切换" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <Space>
              <span>当前语言:</span>
              <Switch
                checked={useEnglish}
                onChange={setUseEnglish}
                checkedChildren="English"
                unCheckedChildren="中文"
              />
            </Space>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <p>
              切换语言查看标签字典的效果。标签字典主要用于国际化场景，可以自动转换字符串选项的标签显示。
            </p>
          </div>
        </Card>

        <Card title="状态选择 (字符串选项)" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginRight: '8px' }}>当前选中:</span>
            <Tag color="blue">
              {currentLabels[selectedStatus as keyof typeof currentLabels]}
            </Tag>
          </div>
          <ToggleTokens
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={['pending', 'approved', 'rejected', 'cancelled']}
            labelDictionary={currentLabels}
            multiple={false}
          />

          <Divider />

          <div>
            <h4>字符串选项 + 标签字典:</h4>
            <pre
              style={{
                backgroundColor: '#f5f5f5',
                padding: '12px',
                borderRadius: '4px'
              }}
            >
              {`// 使用字符串数组作为选项
options={['pending', 'approved', 'rejected', 'cancelled']}

// 通过 labelDictionary 自动转换标签
labelDictionary={{
  pending: '待审核',
  approved: '已通过',
  rejected: '已拒绝',
  cancelled: '已取消'
}}`}
            </pre>
          </div>
        </Card>

        <Card
          title="数据库类型选择 (字符串选项)"
          style={{ marginBottom: '20px' }}
        >
          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginRight: '8px' }}>当前选中:</span>
            {selectedTypes.length > 0 ? (
              selectedTypes.map((type) => (
                <Tag key={type} color="green" style={{ marginBottom: '4px' }}>
                  {currentLabels[type as keyof typeof currentLabels]}
                </Tag>
              ))
            ) : (
              <Tag color="default">无选择</Tag>
            )}
          </div>
          <ToggleTokens
            value={selectedTypes}
            onChange={setSelectedTypes}
            options={['mysql', 'postgresql', 'oracle', 'sqlserver', 'mongodb']}
            labelDictionary={currentLabels}
            multiple={true}
          />
        </Card>

        <Card title="混合选项类型">
          <div style={{ marginBottom: '16px' }}>
            <p>
              标签字典也可以与对象选项一起使用，自动转换对象中的 label 属性：
            </p>
          </div>
          <ToggleTokens
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={[
              {
                label: 'pending',
                value: 'pending',
                className: 'status-pending'
              },
              {
                label: 'approved',
                value: 'approved',
                className: 'status-approved'
              },
              {
                label: 'rejected',
                value: 'rejected',
                className: 'status-rejected'
              }
            ]}
            labelDictionary={currentLabels}
            multiple={false}
          />

          <Divider />

          <div>
            <h4>标签字典特点:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>支持字符串选项的自动标签转换</li>
              <li>支持对象选项的 label 属性转换</li>
              <li>主要用于国际化场景</li>
              <li>提供统一的标签管理</li>
              <li>支持动态切换语言</li>
            </ul>
          </div>

          <div style={{ marginTop: '16px' }}>
            <h4>配置说明:</h4>
            <pre
              style={{
                backgroundColor: '#f5f5f5',
                padding: '12px',
                borderRadius: '4px'
              }}
            >
              {`labelDictionary={currentLabels} // 标签字典

// 自动转换字符串选项的标签
// 自动转换对象选项的 label 属性
// 支持动态切换和更新`}
            </pre>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default LabelDictionaryDemo;
