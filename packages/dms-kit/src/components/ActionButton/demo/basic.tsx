import React from 'react';
import { ActionButton, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Typography } from 'antd';
import { CloseCircleOutlined, SearchOutlined } from '@actiontech/icons';

const { Text } = Typography;

const ActionButtonBasicDemo = () => {
  const handleEdit = () => {
    console.log('编辑操作');
  };

  const handleDelete = () => {
    console.log('删除操作');
  };

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            普通按钮：
          </Text>
          <Space>
            <ActionButton type="primary" text="主要按钮" onClick={handleEdit} />
            <ActionButton text="次要按钮" onClick={handleEdit} />
            <ActionButton type="link" text="链接按钮" onClick={handleEdit} />
          </Space>
        </div>

        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            确认按钮（actionType='confirm'）：
          </Text>
          <Space>
            <ActionButton
              actionType="confirm"
              danger
              text="删除"
              icon={<CloseCircleOutlined />}
              confirm={{
                title: '确定要删除这条记录吗？',
                onConfirm: handleDelete
              }}
            />
            <ActionButton
              actionType="confirm"
              text="重置"
              confirm={{
                title: '确定要重置所有配置吗？此操作不可恢复',
                onConfirm: () => console.log('重置操作')
              }}
            />
          </Space>
        </div>

        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            提示按钮（actionType='tooltip'）：
          </Text>
          <Space>
            <ActionButton
              actionType="tooltip"
              text="搜索"
              icon={<SearchOutlined />}
              disabled
              tooltip={{
                title: '没有搜索权限'
              }}
            />
            <ActionButton
              actionType="tooltip"
              text="导出"
              disabled
              tooltip={{
                title: '数据加载中，请稍后再试'
              }}
            />
          </Space>
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default ActionButtonBasicDemo;
