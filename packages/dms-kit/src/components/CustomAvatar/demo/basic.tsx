import React from 'react';
import { Space, Divider } from 'antd';
import { CustomAvatar, ConfigProvider } from '@actiontech/dms-kit';

/**
 * 基础用法
 * - 文字头像（自动生成）
 * - 图片头像
 * - 不同尺寸
 * - 禁用提示
 */
const BasicDemo: React.FC = () => {
  return (
    <ConfigProvider>
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* 文字头像 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>
          文字头像（自动提取姓名首字符）：
        </div>
        <Space size="large" align="center">
          <div style={{ textAlign: 'center' }}>
            <CustomAvatar name="张三" size="large" />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
              large (40px)
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <CustomAvatar name="李四" />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
              default (32px)
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <CustomAvatar name="王五" size="small" />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
              small (24px)
            </div>
          </div>
        </Space>

        <Divider />

        {/* 图片头像 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>
          图片头像（鼠标悬停显示姓名提示）：
        </div>
        <Space size="large" align="center">
          <CustomAvatar
            src="https://avatars.githubusercontent.com/u/623663?v=4"
            name="用户A"
            size="large"
          />
          <CustomAvatar
            src="https://avatars.githubusercontent.com/u/17185?v=4"
            name="用户B"
          />
          <CustomAvatar
            src="https://avatars.githubusercontent.com/u/69631?v=4"
            name="用户C"
            size="small"
          />
        </Space>

        <Divider />

        {/* 自定义尺寸 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>
          自定义尺寸（支持任意数字尺寸）：
        </div>
        <Space size="large" align="center">
          <div style={{ textAlign: 'center' }}>
            <CustomAvatar name="张三" size={64} />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
              64px
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <CustomAvatar name="李四" size={80} />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
              80px
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <CustomAvatar name="王五" size={100} />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
              100px
            </div>
          </div>
        </Space>

        <Divider />

        {/* 禁用提示 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>
          禁用提示（noTips: true）：
        </div>
        <Space size="large">
          <CustomAvatar name="张三" noTips size="large" />
          <CustomAvatar
            src="https://avatars.githubusercontent.com/u/623663?v=4"
            name="用户A"
            noTips
          />
        </Space>
      </Space>
    </ConfigProvider>
  );
};

export default BasicDemo;
