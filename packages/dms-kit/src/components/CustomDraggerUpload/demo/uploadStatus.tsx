import React, { useState } from 'react';
import { message, UploadFile, Progress, Space, Tag } from 'antd';
import { CustomDraggerUpload, ConfigProvider } from '@actiontech/dms-kit';
import { CloudUploadOutlined } from '@ant-design/icons';

const UploadStatusDemo: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );

  const handleChange = (info: any) => {
    const { file, fileList: fileListInfo } = info;

    // 更新文件列表
    setFileList(fileListInfo);

    // 处理上传状态
    if (file.status === 'uploading') {
      // 模拟上传进度
      const timer = setInterval(() => {
        setUploadProgress((prev) => {
          const current = prev[file.uid] || 0;
          if (current >= 100) {
            clearInterval(timer);
            return prev;
          }
          return { ...prev, [file.uid]: current + 10 };
        });
      }, 200);
    } else if (file.status === 'done') {
      message.success(`${file.name} 文件上传成功`);
      setUploadProgress((prev) => ({ ...prev, [file.uid]: 100 }));
    } else if (file.status === 'error') {
      message.error(`${file.name} 文件上传失败`);
    }
  };

  const beforeUpload = (file: File) => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('文件大小不能超过 5MB!');
      return false;
    }
    return true;
  };

  const getStatusTag = (file: UploadFile) => {
    switch (file.status) {
      case 'uploading':
        return <Tag color="processing">上传中</Tag>;
      case 'done':
        return <Tag color="success">已完成</Tag>;
      case 'error':
        return <Tag color="error">上传失败</Tag>;
      default:
        return <Tag color="default">等待中</Tag>;
    }
  };

  const getProgressColor = (file: UploadFile) => {
    switch (file.status) {
      case 'done':
        return '#52c41a';
      case 'error':
        return '#ff4d4f';
      default:
        return '#1890ff';
    }
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>上传进度和状态</h3>

        <div style={{ marginBottom: '20px' }}>
          <CustomDraggerUpload
            name="file"
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
            title="拖拽文件到此处上传"
          />
        </div>

        {fileList.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h4>上传状态</h4>
            <Space direction="vertical" style={{ width: '100%' }}>
              {fileList.map((file) => (
                <div
                  key={file.uid}
                  style={{
                    padding: '12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    backgroundColor: '#fafafa'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>{file.name}</span>
                    {getStatusTag(file)}
                  </div>

                  <div style={{ marginBottom: '8px' }}>
                    <Progress
                      percent={uploadProgress[file.uid] || 0}
                      size="small"
                      strokeColor={getProgressColor(file)}
                      showInfo={false}
                    />
                  </div>

                  <div style={{ fontSize: '12px', color: '#666' }}>
                    <span>
                      文件大小: {(file.size! / 1024 / 1024).toFixed(2)} MB
                    </span>
                    {file.status === 'done' && (
                      <span style={{ marginLeft: '16px', color: '#52c41a' }}>
                        ✓ 上传完成
                      </span>
                    )}
                    {file.status === 'error' && (
                      <span style={{ marginLeft: '16px', color: '#ff4d4f' }}>
                        ✗ 上传失败
                      </span>
                    )}
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

export default UploadStatusDemo;
