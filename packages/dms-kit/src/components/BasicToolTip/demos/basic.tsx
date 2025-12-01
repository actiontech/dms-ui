/**
 * 最简单的文字提示
 * - 鼠标悬停时显示提示内容
 * - title 为空时不显示提示框
 */
import React from 'react';
import { BasicToolTip, ConfigProvider } from '@actiontech/dms-kit';
import { Button, Space } from 'antd';

const BasicToolTipDemo = () => {
  return (
    <ConfigProvider>
      <Space>
        <BasicToolTip title="这是一个基础的文字提示">
          <Button>悬停查看提示</Button>
        </BasicToolTip>

        <BasicToolTip title="">
          <Button>空提示（不显示）</Button>
        </BasicToolTip>
      </Space>
    </ConfigProvider>
  );
};

export default BasicToolTipDemo;
