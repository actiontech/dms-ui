import React from 'react';
import { BasicButton, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Typography } from 'antd';

const { Title } = Typography;

/**
 * 基础用法
 * - 按钮类型：primary、default、dashed、text、link
 * - 按钮尺寸：large、middle、small
 * - 按钮状态：loading、disabled、danger
 */
const BasicButtonDemo = () => {
  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={5}>按钮类型</Title>
          <Space wrap>
            <BasicButton type="primary">Primary</BasicButton>
            <BasicButton>Default</BasicButton>
            <BasicButton type="dashed">Dashed</BasicButton>
            <BasicButton type="text">Text</BasicButton>
            <BasicButton type="link">Link</BasicButton>
          </Space>
        </div>

        <div>
          <Title level={5}>按钮尺寸</Title>
          <Space wrap>
            <BasicButton size="large" type="primary">
              Large
            </BasicButton>
            <BasicButton size="middle" type="primary">
              Middle
            </BasicButton>
            <BasicButton size="small" type="primary">
              Small
            </BasicButton>
          </Space>
        </div>

        <div>
          <Title level={5}>危险按钮</Title>
          <Space wrap>
            <BasicButton danger>Delete</BasicButton>
          </Space>
        </div>

        <div>
          <Title level={5}>加载状态</Title>
          <Space wrap>
            <BasicButton loading type="primary">
              Loading
            </BasicButton>
            <BasicButton loading>Loading</BasicButton>
          </Space>
        </div>

        <div>
          <Title level={5}>禁用状态</Title>
          <Space wrap>
            <BasicButton disabled type="primary">
              Disabled
            </BasicButton>
            <BasicButton disabled>Disabled</BasicButton>
          </Space>
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default BasicButtonDemo;
