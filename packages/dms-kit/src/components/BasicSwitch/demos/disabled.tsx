import React, { useState } from 'react';
import { BasicSwitch, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Typography } from 'antd';

const { Text } = Typography;

const BasicSwitchDisabledDemo = () => {
  const [adminMode, setAdminMode] = useState(false);
  const [userRole, setUserRole] = useState('user');

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <Space direction="vertical" size="large">
          <div>
            <BasicSwitch
              checked={adminMode}
              onChange={setAdminMode}
              disabled={userRole !== 'admin'}
            />
            <span style={{ marginLeft: '8px' }}>
              管理员模式 {userRole !== 'admin' && '(需要管理员权限)'}
            </span>
          </div>

          <div>
            <BasicSwitch checked={true} disabled />
            <span style={{ marginLeft: '8px', color: '#999' }}>
              系统功能 (不可修改)
            </span>
          </div>

          <div>
            <BasicSwitch checked={false} disabled />
            <span style={{ marginLeft: '8px', color: '#999' }}>
              维护模式 (暂时禁用)
            </span>
          </div>
        </Space>
      </div>
    </ConfigProvider>
  );
};

export default BasicSwitchDisabledDemo;
