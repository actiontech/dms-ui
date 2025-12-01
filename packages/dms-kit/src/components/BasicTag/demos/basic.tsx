/**
 * 最简单的标签
 * - 默认样式和颜色
 * - 支持 closable 属性
 */
import React from 'react';
import { BasicTag, ConfigProvider } from '@actiontech/dms-kit';
import { Space } from 'antd';

const BasicTagDemo = () => {
  return (
    <ConfigProvider>
      <Space size={[0, 8]} wrap>
        <BasicTag>默认标签</BasicTag>
        <BasicTag color="blue">蓝色标签</BasicTag>
        <BasicTag color="green">绿色标签</BasicTag>
        <BasicTag color="red" closable>
          可关闭
        </BasicTag>
      </Space>
    </ConfigProvider>
  );
};

export default BasicTagDemo;
