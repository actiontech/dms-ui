import React, { useState } from 'react';
import { BasicSegmented, ConfigProvider } from '@actiontech/dms-kit';
import {
  TableOutlined,
  AppstoreOutlined,
  BarsOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';

const WithIconSegmentedDemo = () => {
  const [value, setValue] = useState<string>('table');

  const options = [
    {
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <TableOutlined />
          <span>表格</span>
        </div>
      ),
      value: 'table'
    },
    {
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <AppstoreOutlined />
          <span>卡片</span>
        </div>
      ),
      value: 'card'
    },
    {
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <BarsOutlined />
          <span>列表</span>
        </div>
      ),
      value: 'list'
    },
    {
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <UnorderedListOutlined />
          <span>详情</span>
        </div>
      ),
      value: 'detail'
    }
  ];

  return (
    <ConfigProvider>
      <div>
        <BasicSegmented
          options={options}
          value={value}
          onChange={(v) => setValue(v as string)}
        />
        <div style={{ marginTop: 16 }}>
          当前视图: <strong>{value}</strong>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default WithIconSegmentedDemo;
