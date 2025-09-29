import React, { useState } from 'react';
import { Space } from 'antd';
import {
  TableOutlined,
  AppstoreOutlined,
  BarsOutlined,
  FileTextOutlined,
  PictureOutlined
} from '@ant-design/icons';
import { ConfigProvider, BasicSegmented } from '@actiontech/dms-kit';

const BasicSegmentedIconDemo: React.FC = () => {
  const [value, setValue] = useState<string | number>('table');

  const iconOptions = [
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
    },
    {
      label: '文档视图',
      value: 'document',
      icon: <FileTextOutlined />
    },
    {
      label: '图片视图',
      value: 'picture',
      icon: <PictureOutlined />
    }
  ];

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large">
        <BasicSegmented
          options={iconOptions}
          value={value}
          onChange={setValue}
        />

        <div>
          当前选择: <strong>{value}</strong>
        </div>

        <div>
          <h4>仅图标模式</h4>
          <BasicSegmented
            options={[
              { label: <TableOutlined />, value: 'table' },
              { label: <AppstoreOutlined />, value: 'card' },
              { label: <BarsOutlined />, value: 'list' }
            ]}
            value={value}
            onChange={setValue}
          />
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default BasicSegmentedIconDemo;
