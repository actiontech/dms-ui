import React, { useState } from 'react';
import { message, UploadFile } from 'antd';
import { CustomDraggerUpload, ConfigProvider } from '@actiontech/dms-kit';
import { InboxOutlined } from '@ant-design/icons';

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
      <div style={{ padding: '20px' }}>
        <h3>基础拖拽上传</h3>
        <CustomDraggerUpload
          name="file"
          multiple={true}
          fileList={fileList}
          onChange={handleChange}
          beforeUpload={beforeUpload}
          action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6e2188"
        />
      </div>
    </ConfigProvider>
  );
};

export default BasicDemo;
