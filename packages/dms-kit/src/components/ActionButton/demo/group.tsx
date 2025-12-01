import React from 'react';
import { ActionButtonGroup, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Typography } from 'antd';
import {
  SearchOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined
} from '@actiontech/icons';

const { Text } = Typography;

const ActionButtonGroupDemo = () => {
  const handleEdit = () => {
    console.log('编辑');
  };

  const handleDelete = () => {
    console.log('删除');
  };

  const handleCopy = () => {
    console.log('复制');
  };

  const actions = [
    {
      key: 'edit',
      text: '查看',
      icon: <SearchOutlined />,
      onClick: handleEdit
    },
    {
      key: 'copy',
      text: '通过',
      icon: <CheckCircleOutlined />,
      onClick: handleCopy
    },
    {
      key: 'delete',
      actionType: 'confirm' as const,
      text: '拒绝',
      icon: <CloseCircleOutlined />,
      danger: true,
      confirm: {
        title: '确定要拒绝这条记录吗？',
        onConfirm: handleDelete
      }
    }
  ];

  const disabledActions = [
    {
      key: 'edit',
      actionType: 'tooltip' as const,
      text: '查看',
      icon: <SearchOutlined />,
      disabled: true,
      tooltip: {
        title: '没有查看权限'
      }
    },
    {
      key: 'delete',
      actionType: 'tooltip' as const,
      text: '拒绝',
      icon: <CloseCircleOutlined />,
      disabled: true,
      tooltip: {
        title: '没有拒绝权限'
      }
    }
  ];

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            操作按钮组：
          </Text>
          <ActionButtonGroup actions={actions} />
        </div>

        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            禁用状态（带 Tooltip）：
          </Text>
          <ActionButtonGroup actions={disabledActions} />
        </div>

        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            自定义间距：
          </Text>
          <ActionButtonGroup actions={actions} size="large" />
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default ActionButtonGroupDemo;
