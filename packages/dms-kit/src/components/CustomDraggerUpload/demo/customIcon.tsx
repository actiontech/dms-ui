import React from 'react';
import { CustomDraggerUpload, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Divider } from 'antd';
import {
  CloudUploadOutlined,
  FileTextOutlined,
  PictureOutlined
} from '@ant-design/icons';

/**
 * 自定义图标和标题
 * - 自定义上传图标
 * - 自定义上传标题
 * - 不同场景的样式
 */
const CustomIconDemo: React.FC = () => {
  return (
    <ConfigProvider>
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* 默认样式 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>默认样式：</div>
        <CustomDraggerUpload
          name="file"
          action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6e2188"
        />

        <Divider />

        {/* 自定义图标和标题 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>
          自定义图标和标题：
        </div>
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

        <Divider />

        {/* 文档上传样式 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>
          文档上传样式（限制文件类型）：
        </div>
        <CustomDraggerUpload
          name="file"
          icon={
            <FileTextOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
          }
          title="拖拽文档文件到此处上传"
          accept=".doc,.docx,.pdf,.txt"
          action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6e2188"
        />

        <Divider />

        {/* 图片上传样式 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>
          图片上传样式（限制图片类型）：
        </div>
        <CustomDraggerUpload
          name="file"
          icon={
            <PictureOutlined style={{ fontSize: '48px', color: '#fa8c16' }} />
          }
          title="拖拽图片文件到此处上传"
          accept="image/*"
          action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6e2188"
        />
      </Space>
    </ConfigProvider>
  );
};

export default CustomIconDemo;
