/**
 * 三种尺寸
 * - small: 适合紧凑布局
 * - default: 标准尺寸
 * - large: 适合重要标签
 */
import React from 'react';
import { BasicTag, ConfigProvider } from '@actiontech/dms-kit';
import { Space } from 'antd';

const BasicTagSizeDemo = () => {
  return (
    <ConfigProvider>
      <Space size="large" align="center">
        <BasicTag size="small" color="blue">
          小尺寸
        </BasicTag>
        <BasicTag color="blue">默认尺寸</BasicTag>
        <BasicTag size="large" color="blue">
          大尺寸
        </BasicTag>
      </Space>
    </ConfigProvider>
  );
};

export default BasicTagSizeDemo;
