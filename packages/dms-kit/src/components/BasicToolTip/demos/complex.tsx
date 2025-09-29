import React from 'react';
import { BasicToolTip } from '@actiontech/dms-kit';
import { ConfigProvider } from '@actiontech/dms-kit';
import { Button, List, Tag, Space } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const BasicToolTipComplexDemo = () => {
  const userInfo = (
    <div>
      <h4 style={{ margin: '0 0 8px 0', color: '#1890ff' }}>用户信息</h4>
      <List
        size="small"
        dataSource={[
          { label: '用户名', value: 'admin' },
          { label: '角色', value: '系统管理员' },
          { label: '权限', value: '全部权限' },
          { label: '状态', value: '在线' }
        ]}
        renderItem={(item) => (
          <List.Item style={{ padding: '4px 0', border: 'none' }}>
            <span style={{ color: '#666', marginRight: '8px' }}>
              {item.label}:
            </span>
            <span>{item.value}</span>
          </List.Item>
        )}
      />
    </div>
  );

  const systemStatus = (
    <div>
      <h4 style={{ margin: '0 0 8px 0', color: '#52c41a' }}>系统状态</h4>
      <Space direction="vertical" size="small">
        <div>
          <Tag color="green">CPU: 正常</Tag>
          <Tag color="green">内存: 正常</Tag>
        </div>
        <div>
          <Tag color="blue">网络: 正常</Tag>
          <Tag color="green">磁盘: 正常</Tag>
        </div>
      </Space>
    </div>
  );

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <Space size="large">
          <BasicToolTip
            title={userInfo}
            titleWidth={300}
            prefixIcon={<InfoCircleOutlined />}
          >
            <Button type="primary">用户信息</Button>
          </BasicToolTip>

          <BasicToolTip
            title={systemStatus}
            titleWidth={250}
            prefixIcon={<InfoCircleOutlined />}
          >
            <Button>系统状态</Button>
          </BasicToolTip>
        </Space>
      </div>
    </ConfigProvider>
  );
};

export default BasicToolTipComplexDemo;
