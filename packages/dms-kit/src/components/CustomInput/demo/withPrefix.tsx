import React from 'react';
import { CustomInput, ConfigProvider } from '@actiontech/dms-kit';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { message } from 'antd';

const WithPrefixDemo: React.FC = () => {
  const handleCustomPressEnter = (value: string) => {
    message.success(`输入的值: ${value}`);
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>图标前缀</h3>
        <div style={{ marginBottom: '16px' }}>
          <CustomInput
            prefix={<UserOutlined />}
            placeholder="请输入用户名"
            onCustomPressEnter={handleCustomPressEnter}
            style={{ width: '300px', marginBottom: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <CustomInput
            prefix={<LockOutlined />}
            placeholder="请输入密码"
            type="password"
            onCustomPressEnter={handleCustomPressEnter}
            style={{ width: '300px', marginBottom: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <CustomInput
            prefix={<MailOutlined />}
            placeholder="请输入邮箱"
            onCustomPressEnter={handleCustomPressEnter}
            style={{ width: '300px', marginBottom: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <CustomInput
            prefix={<PhoneOutlined />}
            placeholder="请输入手机号"
            onCustomPressEnter={handleCustomPressEnter}
            style={{ width: '300px' }}
          />
        </div>

        <h3>文本前缀</h3>
        <div style={{ marginBottom: '16px' }}>
          <CustomInput
            prefix="项目:"
            placeholder="请输入项目名称"
            onCustomPressEnter={handleCustomPressEnter}
            style={{ width: '300px', marginBottom: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <CustomInput
            prefix="数据库:"
            placeholder="请输入数据库名称"
            onCustomPressEnter={handleCustomPressEnter}
            style={{ width: '300px', marginBottom: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <CustomInput
            prefix="SQL:"
            placeholder="请输入SQL语句"
            onCustomPressEnter={handleCustomPressEnter}
            style={{ width: '300px' }}
          />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default WithPrefixDemo;
