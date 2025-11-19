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
      <div style={{ padding: '24px' }}>
        {/* 语言切换控制 */}
        <div
          style={{
            marginBottom: '24px',
            padding: '16px',
            backgroundColor: '#f0f5ff',
            borderRadius: '4px',
            border: '1px solid #adc6ff'
          }}
        >
          <Space size="large">
            <span style={{ fontSize: '14px', fontWeight: 500 }}>
              🌐 当前语言:
            </span>
            <Switch
              checked={useEnglish}
              onChange={setUseEnglish}
              checkedChildren="English"
              unCheckedChildren="中文"
            />
            <span style={{ fontSize: '13px', color: '#666' }}>
              切换语言查看标签字典的国际化效果
            </span>
          </Space>
        </div>

        {/* 单选 - 字符串选项 */}
        <div style={{ marginBottom: '32px' }}>
          <h4 style={{ marginBottom: '12px' }}>审核状态 (单选 + 字符串选项)</h4>
          <div style={{ marginBottom: '12px' }}>
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

        <Divider />

        {/* 多选 - 字符串选项 */}
        <div>
          <h4 style={{ marginBottom: '12px' }}>
            数据库类型 (多选 + 字符串选项)
          </h4>
          <div style={{ marginBottom: '12px' }}>
            <Space wrap>
              <span>已选中 {selectedTypes.length} 项:</span>
              {selectedTypes.length > 0 ? (
                selectedTypes.map((type) => (
                  <Tag key={type} color="green">
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

          <div
            style={{
              marginTop: '20px',
              padding: '16px',
              borderRadius: '4px',
              border: '1px solid #ffe58f'
            }}
          >
            <h4 style={{ marginTop: 0, marginBottom: '12px' }}>标签字典特点</h4>
            <ul
              style={{
                margin: 0,
                marginBottom: '16px',
                paddingLeft: '20px',
                fontSize: '13px'
              }}
            >
              <li>支持字符串选项的自动标签转换</li>
              <li>支持对象选项的 label 属性转换</li>
              <li>主要用于国际化（i18n）场景</li>
              <li>提供统一的标签管理，避免硬编码</li>
              <li>支持动态切换语言</li>
            </ul>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default LabelDictionaryDemo;
