import React from 'react';
import { BasicButton, ConfigProvider } from '@actiontech/dms-kit';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const IconButtonDemo = () => {
  return (
    <ConfigProvider>
      <div style={{ display: 'flex', gap: 8 }}>
        <BasicButton icon={<PlusOutlined />} />
        <BasicButton icon={<EditOutlined />} />
        <BasicButton icon={<DeleteOutlined />} />
        <BasicButton noBorderIcon icon={<PlusOutlined />} />
      </div>
    </ConfigProvider>
  );
};

export default IconButtonDemo;
