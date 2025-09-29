import React from 'react';
import { BasicButton, ConfigProvider } from '@actiontech/dms-kit';
import { SettingOutlined } from '@ant-design/icons';

const NoBorderIconDemo = () => {
  return (
    <ConfigProvider>
      <div>
        <BasicButton noBorderIcon icon={<SettingOutlined />} />
        <span style={{ marginLeft: 16, color: '#666' }}>
          使用 noBorderIcon 属性可以移除图标按钮的边框和背景
        </span>
      </div>
    </ConfigProvider>
  );
};

export default NoBorderIconDemo;
