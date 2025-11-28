import React, { useState } from 'react';
import { Space, Tag, Divider, Switch } from 'antd';
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
    pending: 'Pending Review',
    approved: 'Approved',
    rejected: 'Rejected',
    cancelled: 'Cancelled',
    mysql: 'MySQL Database',
    postgresql: 'PostgreSQL Database',
    oracle: 'Oracle Database',
    sqlserver: 'SQL Server Database',
    mongodb: 'MongoDB Database'
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
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 语言切换控制 */}
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#f0f5ff',
            borderRadius: '4px'
          }}
        >
          <Space>
            <span>🌐 当前语言:</span>
            <Switch
              checked={useEnglish}
              onChange={setUseEnglish}
              checkedChildren="English"
              unCheckedChildren="中文"
            />
          </Space>
        </div>

        {/* 单选 */}
        <div>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>
            审核状态（单选）：
          </div>
          <div style={{ marginBottom: 12 }}>
            <Space>
              <span>当前状态:</span>
              <Tag color="blue">
                {currentLabels[selectedStatus as keyof typeof currentLabels]}
              </Tag>
            </Space>
          </div>
          <ToggleTokens
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={['pending', 'approved', 'rejected', 'cancelled']}
            labelDictionary={currentLabels}
            multiple={false}
          />
        </div>

        <Divider style={{ margin: '8px 0' }} />

        {/* 多选 */}
        <div>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>
            数据库类型（多选）：
          </div>
          <div style={{ marginBottom: 12 }}>
            <Space wrap>
              <span>已选中 {selectedTypes.length} 项:</span>
              {selectedTypes.length > 0 ? (
                selectedTypes.map((type) => (
                  <Tag key={type} color="blue">
                    {currentLabels[type as keyof typeof currentLabels]}
                  </Tag>
                ))
              ) : (
                <Tag>未选择</Tag>
              )}
            </Space>
          </div>
          <ToggleTokens
            value={selectedTypes}
            onChange={setSelectedTypes}
            options={['mysql', 'postgresql', 'oracle', 'sqlserver', 'mongodb']}
            labelDictionary={currentLabels}
            multiple={true}
          />
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default LabelDictionaryDemo;
