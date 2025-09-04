import React from 'react';
import {
  ConfigItem,
  ConfigProvider,
  BasicSelect,
  BasicSwitch
} from '@actiontech/dms-kit';
import { useBoolean } from 'ahooks';
import { Tag, Space } from 'antd';

const ConfigItemCustomDemo = () => {
  const [fieldVisible1, { setTrue: showField1, setFalse: hideField1 }] =
    useBoolean(false);
  const [fieldVisible2, { setTrue: showField2, setFalse: hideField2 }] =
    useBoolean(false);

  return (
    <ConfigProvider>
      <div
        style={{
          width: 600,
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}
      >
        {/* 自定义标签内容 */}
        <ConfigItem
          label={
            <Space>
              数据库类型
              <Tag color="blue">必填</Tag>
            </Space>
          }
          descNode="MySQL 8.0"
          inputNode={
            <BasicSelect
              style={{ width: 200 }}
              defaultValue="mysql"
              options={[
                { label: 'MySQL 8.0', value: 'mysql' },
                { label: 'PostgreSQL 13', value: 'postgresql' },
                { label: 'Oracle 19c', value: 'oracle' }
              ]}
            />
          }
          fieldVisible={fieldVisible1}
          showField={showField1}
          hideField={hideField1}
        />

        {/* 开关类型的配置项 */}
        <ConfigItem
          label="启用 SSL 连接"
          descNode="已启用"
          inputNode={
            <Space>
              <BasicSwitch defaultChecked />
              <span style={{ color: '#666' }}>推荐启用以提高安全性</span>
            </Space>
          }
          fieldVisible={fieldVisible2}
          showField={showField2}
          hideField={hideField2}
        />
      </div>
    </ConfigProvider>
  );
};

export default ConfigItemCustomDemo;
