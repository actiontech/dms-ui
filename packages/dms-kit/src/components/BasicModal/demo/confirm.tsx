import React, { useState } from 'react';
import { BasicModal, BasicButton, ConfigProvider } from '@actiontech/dms-kit';
import { Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const BasicModalConfirmDemo = () => {
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const showDeleteModal = () => {
    setDeleteVisible(true);
  };

  const showConfirmModal = () => {
    setConfirmVisible(true);
  };

  const handleDelete = () => {
    console.log('删除操作已确认');
    setDeleteVisible(false);
  };

  const handleConfirm = () => {
    console.log('操作已确认');
    setConfirmVisible(false);
  };

  return (
    <ConfigProvider>
      <Space>
        <BasicButton danger onClick={showDeleteModal}>
          删除确认
        </BasicButton>
        <BasicButton type="primary" onClick={showConfirmModal}>
          操作确认
        </BasicButton>
      </Space>

      <BasicModal
        title={
          <span>
            <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />
            删除确认
          </span>
        }
        visible={deleteVisible}
        size="small"
        onOk={handleDelete}
        onCancel={() => setDeleteVisible(false)}
        okText="删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p>确定要删除这条记录吗？此操作不可恢复。</p>
        <p>删除后，相关的数据将永久丢失。</p>
      </BasicModal>

      <BasicModal
        title="操作确认"
        visible={confirmVisible}
        size="small"
        onOk={handleConfirm}
        onCancel={() => setConfirmVisible(false)}
        okText="确认"
        cancelText="取消"
      >
        <p>请确认您要执行此操作。</p>
        <p>操作完成后，系统将发送通知到您的邮箱。</p>
      </BasicModal>
    </ConfigProvider>
  );
};

export default BasicModalConfirmDemo;
