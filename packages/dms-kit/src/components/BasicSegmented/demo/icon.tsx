import React, { useState } from 'react';
import { Space, Typography } from 'antd';
import {
  TableOutlined,
  AppstoreOutlined,
  BarsOutlined
} from '@ant-design/icons';
import { ConfigProvider, BasicSegmented } from '@actiontech/dms-kit';

const { Text } = Typography;

/**
 * 图标模式
 * - 图标 + 文字组合
 * - 纯图标模式（节省空间）
 */
const BasicSegmentedIconDemo: React.FC = () => {
  const [value, setValue] = useState<string | number>('table');

  const iconWithTextOptions = [
    {
      label: '表格视图',
      value: 'table',
      icon: <TableOutlined />
    },
    {
      label: '卡片视图',
      value: 'card',
      icon: <AppstoreOutlined />
    },
    {
      label: '列表视图',
      value: 'list',
      icon: <BarsOutlined />
    }
  ];

  const iconOnlyOptions = [
    { label: <TableOutlined />, value: 'table' },
    { label: <AppstoreOutlined />, value: 'card' },
    { label: <BarsOutlined />, value: 'list' }
  ];

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large">
        <Space>
          <Text>图标 + 文字：</Text>
          <BasicSegmented
            options={iconWithTextOptions}
            value={value}
            onChange={setValue}
          />
        </Space>

        <Space>
          <Text>纯图标模式：</Text>
          <BasicSegmented
            options={iconOnlyOptions}
            value={value}
            onChange={setValue}
          />
        </Space>

        <div style={{ width: 400 }}>
          <div style={{ marginBottom: 8 }}>
            <Text>Block 模式：</Text>
          </div>
          <BasicSegmented
            block
            options={iconWithTextOptions}
            value={value}
            onChange={setValue}
          />
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default BasicSegmentedIconDemo;
