import React from 'react';
import { BasicToolTip } from '@actiontech/dms-kit';
import { ConfigProvider } from '@actiontech/dms-kit';
import { Space, Button, message } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  DownloadOutlined,
  UploadOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

const BasicToolTipActionDemo = () => {
  const handleAction = (action: string) => {
    message.success(`执行了 ${action} 操作`);
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <Space size="middle">
          <BasicToolTip
            title="编辑当前记录，修改后需要重新保存"
            prefixIcon={true}
          >
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleAction('编辑')}
            >
              编辑
            </Button>
          </BasicToolTip>

          <BasicToolTip
            title="删除操作不可恢复，请谨慎操作"
            prefixIcon={<ExclamationCircleOutlined />}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleAction('删除')}
            >
              删除
            </Button>
          </BasicToolTip>

          <BasicToolTip title="下载当前数据到本地文件" prefixIcon={true}>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => handleAction('下载')}
            >
              下载
            </Button>
          </BasicToolTip>

          <BasicToolTip
            title="上传文件将覆盖现有数据"
            prefixIcon={<ExclamationCircleOutlined />}
          >
            <Button
              icon={<UploadOutlined />}
              onClick={() => handleAction('上传')}
            >
              上传
            </Button>
          </BasicToolTip>

          <BasicToolTip title="刷新页面数据，获取最新信息" prefixIcon={true}>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => handleAction('刷新')}
            >
              刷新
            </Button>
          </BasicToolTip>
        </Space>
      </div>
    </ConfigProvider>
  );
};

export default BasicToolTipActionDemo;
