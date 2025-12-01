/**
 * 在提示内容前添加图标
 * - prefixIcon={true} 显示默认信息图标
 * - 可自定义任意 ReactNode 作为图标
 * - suffixIcon 用法相同
 */
import React from 'react';
import { BasicToolTip, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Button } from 'antd';
import {
  ExclamationCircleOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';

const BasicToolTipIconDemo = () => {
  return (
    <ConfigProvider>
      <Space size="large">
        <BasicToolTip title="使用默认图标" prefixIcon={true}>
          <Button>默认图标</Button>
        </BasicToolTip>

        <BasicToolTip
          title="使用自定义图标"
          prefixIcon={<ExclamationCircleOutlined />}
        >
          <Button type="primary">自定义图标</Button>
        </BasicToolTip>

        <BasicToolTip
          title="后缀图标示例"
          suffixIcon={<QuestionCircleOutlined />}
        >
          <Button>后缀图标</Button>
        </BasicToolTip>
      </Space>
    </ConfigProvider>
  );
};

export default BasicToolTipIconDemo;
