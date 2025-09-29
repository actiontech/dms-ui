import React, { useState } from 'react';
import { message, UploadFile, Tag } from 'antd';
import { CustomDraggerUpload, ConfigProvider } from '@actiontech/dms-kit';
import {
  FileTextOutlined,
  PictureOutlined,
  FileZipOutlined
} from '@ant-design/icons';

const FileTypesDemo: React.FC = () => {
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
    // 检查文件大小
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('文件大小不能超过 10MB!');
      return false;
    }

    // 检查文件类型
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip',
      'application/x-rar-compressed'
    ];

    if (!allowedTypes.includes(file.type)) {
      message.error('不支持的文件类型!');
      return false;
    }

    return true;
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>文件类型限制</h3>

        <div style={{ marginBottom: '20px' }}>
          <h4>支持的文件类型</h4>
          <div style={{ marginBottom: '16px' }}>
            <Tag color="blue">图片文件: JPG, PNG, GIF</Tag>
            <Tag color="green">文档文件: PDF, DOC, DOCX</Tag>
            <Tag color="orange">压缩文件: ZIP, RAR</Tag>
          </div>
          <p style={{ color: '#666', fontSize: '14px' }}>
            文件大小限制: 10MB 以内
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4>图片上传</h4>
          <CustomDraggerUpload
            name="image"
            icon={
              <PictureOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            }
            title="拖拽图片文件到此处上传"
            accept="image/*"
            fileList={fileList}
            onChange={handleChange}
            beforeUpload={beforeUpload}
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6e2188"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4>文档上传</h4>
          <CustomDraggerUpload
            name="document"
            icon={
              <FileTextOutlined
                style={{ fontSize: '48px', color: '#52c41a' }}
              />
            }
            title="拖拽文档文件到此处上传"
            accept=".pdf,.doc,.docx"
            fileList={fileList}
            onChange={handleChange}
            beforeUpload={beforeUpload}
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6e2188"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4>压缩包上传</h4>
          <CustomDraggerUpload
            name="archive"
            icon={
              <FileZipOutlined style={{ fontSize: '48px', color: '#fa8c16' }} />
            }
            title="拖拽压缩文件到此处上传"
            accept=".zip,.rar"
            fileList={fileList}
            onChange={handleChange}
            beforeUpload={beforeUpload}
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6e2188"
          />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default FileTypesDemo;
