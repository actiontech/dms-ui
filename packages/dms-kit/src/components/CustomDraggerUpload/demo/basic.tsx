import React, { useState } from 'react';
import { message, UploadFile, Space, Divider } from 'antd';
import { CustomDraggerUpload, ConfigProvider } from '@actiontech/dms-kit';

/**
 * 基础用法
 * - 拖拽上传文件
 * - 文件大小限制
 * - 上传状态处理
 * - 文件列表管理
 */
const BasicDemo: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleChange = (info: any) => {
    const { status } = info.file;

    if (status === 'done') {
      message.success(`${info.file.name} 文件上传成功`);
    } else if (status === 'error') {
      message.error(`${info.file.name} 文件上传失败`);
    }

    setFileList(info.fileList);
  };

  const beforeUpload = (file: File) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('文件大小不能超过 2MB!');
      return false;
    }
    return true;
  };

  return (
    <ConfigProvider>
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* 基础拖拽上传 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>
          基础拖拽上传（支持多文件，限制 2MB）：
        </div>
        <CustomDraggerUpload
          name="file"
          multiple={true}
          fileList={fileList}
          onChange={handleChange}
          beforeUpload={beforeUpload}
          action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6e2188"
        />

        <Divider />

        {/* 单文件上传 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>
          单文件上传（maxCount: 1）：
        </div>
        <CustomDraggerUpload
          name="file"
          maxCount={1}
          beforeUpload={beforeUpload}
          action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6e2188"
        />
      </Space>
    </ConfigProvider>
  );
};

export default BasicDemo;
