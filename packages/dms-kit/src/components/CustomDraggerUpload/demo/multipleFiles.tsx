import React, { useState } from 'react';
import { message, UploadFile, Button, Space, Tag, List, Avatar } from 'antd';
import { CustomDraggerUpload, ConfigProvider } from '@actiontech/dms-kit';
import {
  CloudUploadOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';

const MultipleFilesDemo: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleChange = (info: any) => {
    const { file, fileList: fileListInfo } = info;

    if (file.status === 'done') {
      message.success(`${file.name} 文件上传成功`);
    } else if (file.status === 'error') {
      message.error(`${file.name} 文件上传失败`);
    }

    setFileList(fileListInfo);
  };

  const beforeUpload = (file: File) => {
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error(`${file.name} 文件大小不能超过 10MB!`);
      return false;
    }
    return true;
  };

  const handleRemove = (file: UploadFile) => {
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);
    message.success(`${file.name} 文件已移除`);
  };

  const handlePreview = (file: UploadFile) => {
    if (file.url) {
      window.open(file.url);
    } else {
      message.info('文件预览功能需要文件URL');
    }
  };

  const getFileIcon = (file: UploadFile) => {
    const fileName = file.name || '';
    if (fileName.match(/\.(jpg|jpeg|png|gif|bmp)$/i)) {
      return <Avatar src={file.url} icon={<EyeOutlined />} />;
    } else if (fileName.match(/\.(doc|docx)$/i)) {
      return (
        <Avatar icon={<span>📄</span>} style={{ backgroundColor: '#1890ff' }} />
      );
    } else if (fileName.match(/\.(pdf)$/i)) {
      return (
        <Avatar icon={<span>📕</span>} style={{ backgroundColor: '#ff4d4f' }} />
      );
    } else if (fileName.match(/\.(zip|rar|7z)$/i)) {
      return (
        <Avatar icon={<span>📦</span>} style={{ backgroundColor: '#fa8c16' }} />
      );
    } else {
      return (
        <Avatar icon={<span>📁</span>} style={{ backgroundColor: '#52c41a' }} />
      );
    }
  };

  const getFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / 1024 / 1024).toFixed(1)} MB`;
    }
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>多文件上传</h3>

        <div style={{ marginBottom: '20px' }}>
          <CustomDraggerUpload
            name="files"
            multiple={true}
            fileList={fileList}
            onChange={handleChange}
            beforeUpload={beforeUpload}
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6e2188"
            icon={
              <CloudUploadOutlined
                style={{ fontSize: '48px', color: '#1890ff' }}
              />
            }
            title="拖拽多个文件到此处上传"
            maxCount={10}
          />
        </div>

        {fileList.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}
            >
              <h4>已上传文件 ({fileList.length})</h4>
              <Space>
                <Button
                  size="small"
                  onClick={() => setFileList([])}
                  icon={<DeleteOutlined />}
                >
                  清空所有
                </Button>
              </Space>
            </div>

            <List
              dataSource={fileList}
              renderItem={(file) => (
                <List.Item
                  actions={[
                    <Button
                      key="preview"
                      type="text"
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={() => handlePreview(file)}
                    >
                      预览
                    </Button>,
                    <Button
                      key="remove"
                      type="text"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemove(file)}
                    >
                      删除
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={getFileIcon(file)}
                    title={
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <span>{file.name}</span>
                        {file.status === 'done' && (
                          <Tag color="success">已完成</Tag>
                        )}
                        {file.status === 'uploading' && (
                          <Tag color="processing">上传中</Tag>
                        )}
                        {file.status === 'error' && (
                          <Tag color="error">上传失败</Tag>
                        )}
                      </div>
                    }
                    description={
                      <Space>
                        <span>大小: {getFileSize(file.size || 0)}</span>
                        {file.type && <span>类型: {file.type}</span>}
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </div>
    </ConfigProvider>
  );
};

export default MultipleFilesDemo;
