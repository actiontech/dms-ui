import React from 'react';
import { BasicInput, ConfigProvider } from '@actiontech/dms-kit';
import { LockOutlined, SearchOutlined } from '@actiontech/icons';

const AffixDemo = () => {
  return (
    <ConfigProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <BasicInput placeholder="请输入用户名" />
        <BasicInput prefix={<LockOutlined />} placeholder="请输入密码" />
        <BasicInput
          prefix={<SearchOutlined />}
          suffix="搜索"
          placeholder="请输入搜索关键词"
        />
      </div>
    </ConfigProvider>
  );
};

export default AffixDemo;
