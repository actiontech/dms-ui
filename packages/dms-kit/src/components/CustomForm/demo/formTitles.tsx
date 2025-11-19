import React from 'react';
import { ConfigProvider } from '@actiontech/dms-kit';
import { FormItemBigTitle, FormItemSubTitle } from '@actiontech/dms-kit';
import { Space, Divider } from 'antd';

/**
 * 表单标题
 * - FormItemBigTitle：主标题（h3）
 * - FormItemSubTitle：分组标题（h4）
 * - 用于组织表单的视觉层次
 */
const FormTitlesDemo: React.FC = () => {
  return (
    <ConfigProvider>
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* 大标题 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>
          FormItemBigTitle（主标题）：
        </div>
        <FormItemBigTitle>用户信息表单</FormItemBigTitle>

        <Divider />

        {/* 子标题 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>
          FormItemSubTitle（分组标题）：
        </div>
        <FormItemSubTitle>基本信息</FormItemSubTitle>
        <FormItemSubTitle>联系方式</FormItemSubTitle>
        <FormItemSubTitle>其他信息</FormItemSubTitle>

        <Divider />

        {/* 组合使用 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>组合使用：</div>
        <FormItemBigTitle>系统配置</FormItemBigTitle>
        <FormItemSubTitle>用户配置</FormItemSubTitle>
        <div style={{ color: '#999', marginLeft: '16px', marginBottom: '8px' }}>
          用户相关的配置选项...
        </div>
        <FormItemSubTitle>系统配置</FormItemSubTitle>
        <div style={{ color: '#999', marginLeft: '16px', marginBottom: '8px' }}>
          系统级别的配置选项...
        </div>
        <FormItemSubTitle>安全配置</FormItemSubTitle>
        <div style={{ color: '#999', marginLeft: '16px' }}>
          安全相关的配置选项...
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default FormTitlesDemo;
