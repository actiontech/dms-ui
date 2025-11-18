import React, { useState } from 'react';
import { ModeSwitcher, ConfigProvider } from '@actiontech/dms-kit';
import {
  AppstoreOutlined,
  BarsOutlined,
  TableOutlined
} from '@ant-design/icons';

const CustomLayoutDemo: React.FC = () => {
  const [viewMode, setViewMode] = useState<string>('grid');

  const options = [
    {
      label: '网格视图',
      value: 'grid',
      colProps: {
        span: 6
      },
      icon: <AppstoreOutlined />
    },
    {
      label: '列表视图',
      value: 'list',
      colProps: {
        span: 6
      },
      icon: <BarsOutlined />
    },
    {
      label: '表格视图',
      value: 'table',
      colProps: {
        span: 6
      },
      icon: <TableOutlined />
    }
  ];

  return (
    <ConfigProvider>
      <ModeSwitcher
        rowProps={{ gutter: 20 }}
        options={options}
        defaultValue={viewMode}
        value={viewMode}
        onChange={setViewMode}
      />
    </ConfigProvider>
  );
};

export default CustomLayoutDemo;
