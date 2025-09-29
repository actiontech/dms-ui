import React from 'react';
import { BasicTag } from '@actiontech/dms-kit';
import { ConfigProvider } from '@actiontech/dms-kit';
import { Space } from 'antd';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TagOutlined
} from '@ant-design/icons';

const BasicTagIconDemo = () => {
  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <Space size={[0, 8]} wrap>
          <BasicTag color="red" icon={<CheckCircleOutlined />}>
            已完成
          </BasicTag>

          <BasicTag color="orange" icon={<ExclamationCircleOutlined />}>
            有错误
          </BasicTag>

          <BasicTag color="gold" icon={<ClockCircleOutlined />}>
            处理中
          </BasicTag>

          <BasicTag color="blue" icon={<UserOutlined />}>
            用户标签
          </BasicTag>

          <BasicTag color="purple" icon={<TagOutlined />}>
            分类标签
          </BasicTag>
        </Space>
      </div>
    </ConfigProvider>
  );
};

export default BasicTagIconDemo;
