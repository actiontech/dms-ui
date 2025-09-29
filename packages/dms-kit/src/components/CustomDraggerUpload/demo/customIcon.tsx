import React from 'react';
import { CustomDraggerUpload, ConfigProvider } from '@actiontech/dms-kit';
import {
  CloudUploadOutlined,
  FileTextOutlined,
  PictureOutlined
} from '@ant-design/icons';

const CustomIconDemo: React.FC = () => {
  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>自定义图标和标题</h3>

        <div style={{ marginBottom: '20px' }}>
          <h4>默认样式</h4>
          <CustomDraggerUpload
            name="file"
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6e2188"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4>自定义图标和标题</h4>
          <CustomDraggerUpload
            name="file"
            icon={
              <CloudUploadOutlined
                style={{ fontSize: '48px', color: '#1890ff' }}
              />
            }
            title="点击或拖拽文件到此区域上传"
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6e2188"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4>文档上传样式</h4>
          <CustomDraggerUpload
            name="file"
            icon={
              <FileTextOutlined
                style={{ fontSize: '48px', color: '#52c41a' }}
              />
            }
            title="拖拽文档文件到此处上传"
            accept=".doc,.docx,.pdf,.txt"
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6e2188"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4>图片上传样式</h4>
          <CustomDraggerUpload
            name="file"
            icon={
              <PictureOutlined style={{ fontSize: '48px', color: '#fa8c16' }} />
            }
            title="拖拽图片文件到此处上传"
            accept="image/*"
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6e2188"
          />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default CustomIconDemo;
