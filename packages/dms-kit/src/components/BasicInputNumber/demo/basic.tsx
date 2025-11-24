import React from 'react';
import { BasicInputNumber, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Typography } from 'antd';

const { Text } = Typography;

/**
 * 基础用法
 * - 简单的数字输入
 * - 支持范围限制、精度控制
 * - 支持不同尺寸和禁用状态
 * - 支持前置/后置标签
 */
const BasicInputNumberDemo = () => {
  return (
    <ConfigProvider>
      <Space direction="vertical" size="middle">
        <Space>
          <Text>基础用法：</Text>
          <BasicInputNumber placeholder="请输入数字" style={{ width: 200 }} />
        </Space>

        <Space>
          <Text>带默认值：</Text>
          <BasicInputNumber defaultValue={100} style={{ width: 200 }} />
        </Space>

        <Space>
          <Text>范围限制（0-100）：</Text>
          <BasicInputNumber
            min={0}
            max={100}
            defaultValue={50}
            style={{ width: 200 }}
          />
        </Space>

        <Space>
          <Text>步长设置（步长为10）：</Text>
          <BasicInputNumber
            min={0}
            max={100}
            step={10}
            defaultValue={10}
            style={{ width: 200 }}
          />
        </Space>

        <Space>
          <Text>精度控制（保留2位小数）：</Text>
          <BasicInputNumber
            precision={2}
            step={0.01}
            defaultValue={1.23}
            style={{ width: 200 }}
          />
        </Space>

        <Space>
          <Text>小尺寸：</Text>
          <BasicInputNumber
            size="small"
            placeholder="小尺寸"
            style={{ width: 200 }}
          />
        </Space>

        <Space>
          <Text>中尺寸：</Text>
          <BasicInputNumber
            size="middle"
            placeholder="中尺寸"
            style={{ width: 200 }}
          />
        </Space>

        <Space>
          <Text>大尺寸（默认）：</Text>
          <BasicInputNumber placeholder="大尺寸" style={{ width: 200 }} />
        </Space>

        <Space>
          <Text>禁用状态：</Text>
          <BasicInputNumber
            disabled
            defaultValue={100}
            style={{ width: 200 }}
          />
        </Space>

        <Space>
          <Text>前置标签：</Text>
          <BasicInputNumber
            addonBefore="价格"
            defaultValue={100}
            style={{ width: 200 }}
          />
        </Space>

        <Space>
          <Text>后置标签：</Text>
          <BasicInputNumber
            addonAfter="元"
            defaultValue={100}
            style={{ width: 200 }}
          />
        </Space>
      </Space>
    </ConfigProvider>
  );
};

export default BasicInputNumberDemo;
