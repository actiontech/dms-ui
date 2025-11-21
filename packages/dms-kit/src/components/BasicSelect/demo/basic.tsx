import React from 'react';
import { BasicSelect, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Typography } from 'antd';

const { Text } = Typography;

/**
 * 基础用法
 * - 简单的单选选择器
 * - 支持默认值和清除功能
 * - 支持不同尺寸和禁用状态
 */
const BasicSelectDemo = () => {
  const options = [
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
    { label: '选项3', value: '3' },
    { label: '选项4', value: '4' },
    { label: '选项5', value: '5' }
  ];

  return (
    <ConfigProvider>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <Text>基础用法：</Text>
          <BasicSelect
            placeholder="请选择一个选项"
            options={options}
            style={{ width: 200, marginLeft: 8 }}
          />
        </div>

        <div>
          <Text>带默认值：</Text>
          <BasicSelect
            options={options}
            defaultValue="1"
            style={{ width: 200, marginLeft: 8 }}
          />
        </div>

        <div>
          <Text>允许清除：</Text>
          <BasicSelect
            options={options}
            defaultValue="2"
            allowClear
            style={{ width: 200, marginLeft: 8 }}
          />
        </div>

        <div>
          <Text>禁用状态：</Text>
          <BasicSelect
            options={options}
            defaultValue="3"
            disabled
            style={{ width: 200, marginLeft: 8 }}
          />
        </div>

        <div>
          <Text>小尺寸：</Text>
          <BasicSelect
            options={options}
            size="small"
            placeholder="小尺寸选择器"
            style={{ width: 200, marginLeft: 8 }}
          />
        </div>

        <div>
          <Text>大尺寸：</Text>
          <BasicSelect
            options={options}
            size="large"
            placeholder="大尺寸选择器"
            style={{ width: 200, marginLeft: 8 }}
          />
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default BasicSelectDemo;
