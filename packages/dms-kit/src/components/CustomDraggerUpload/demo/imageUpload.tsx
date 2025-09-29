import React, { useState } from 'react';
import { message, UploadFile, Image, Space, Tag, Button } from 'antd';
import { CustomDraggerUpload, ConfigProvider } from '@actiontech/dms-kit';
import { PictureOutlined, DeleteOutlined } from '@ant-design/icons';

const ImageUploadDemo: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleChange = (info: any) => {
    const { file, fileList: fileListInfo } = info;

    if (file.status === 'done') {
      message.success(`${file.name} 图片上传成功`);
    } else if (file.status === 'error') {
      message.error(`${file.name} 图片上传失败`);
    }

    setFileList(fileListInfo);
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件!');
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片大小不能超过 5MB!');
      return false;
    }
    return true;
  };

  const handleRemove = (file: UploadFile) => {
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);
    message.success(`${file.name} 图片已移除`);
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>图片预览上传</h3>

        <div style={{ marginBottom: '20px' }}>
          <CustomDraggerUpload
            name="image"
            multiple={true}
            fileList={fileList}
            onChange={handleChange}
            beforeUpload={beforeUpload}
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6e2188"
            icon={
              <PictureOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            }
            title="拖拽图片文件到此处上传"
            accept="image/*"
            listType="picture-card"
            maxCount={6}
          />
        </div>

        {fileList.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h4>图片预览</h4>
            <Space wrap>
              {fileList.map((file) => (
                <div
                  key={file.uid}
                  style={{
                    position: 'relative',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    padding: '8px',
                    backgroundColor: '#fafafa'
                  }}
                >
                  <Image
                    width={120}
                    height={120}
                    src={file.url || file.thumbUrl}
                    alt={file.name}
                    style={{ objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <div style={{ marginTop: '8px', textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#666',
                        marginBottom: '4px'
                      }}
                    >
                      {file.name}
                    </div>
                    <Space>
                      {file.status === 'done' && (
                        <Tag color="success">已完成</Tag>
                      )}
                      {file.status === 'uploading' && (
                        <Tag color="processing">上传中</Tag>
                      )}
                      {file.status === 'error' && (
                        <Tag color="error">上传失败</Tag>
                      )}
                      <Button
                        size="small"
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemove(file)}
                      />
                    </Space>
                  </div>
                </div>
              ))}
            </Space>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
};

export default ImageUploadDemo;
