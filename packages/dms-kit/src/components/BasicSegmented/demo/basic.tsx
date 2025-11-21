import React, { useState } from 'react';
import { Space, Typography } from 'antd';
import { ConfigProvider, BasicSegmented } from '@actiontech/dms-kit';

const { Text } = Typography;

/**
 * 基础用法
 * - 简单的分段控制器
 * - 支持不同尺寸
 * - 支持禁用状态和 block 模式
 */
const BasicSegmentedBasicDemo: React.FC = () => {
  const [value, setValue] = useState<string | number>('List');

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large">
        <Space>
          <Text>基础用法：</Text>
          <BasicSegmented
            options={['List', 'Kanban', 'Gantt']}
            value={value}
            onChange={setValue}
          />
        </Space>

        <Space>
          <Text>小尺寸：</Text>
          <BasicSegmented
            size="small"
            options={['Option 1', 'Option 2', 'Option 3']}
            defaultValue="Option 1"
          />
        </Space>

        <Space>
          <Text>大尺寸：</Text>
          <BasicSegmented
            size="large"
            options={['Daily', 'Weekly', 'Monthly']}
            defaultValue="Daily"
          />
        </Space>

        <Space>
          <Text>禁用状态：</Text>
          <BasicSegmented
            options={['Apple', 'Orange', 'Banana']}
            disabled
            defaultValue="Apple"
          />
        </Space>

        <div style={{ width: 400 }}>
          <div style={{ marginBottom: 8 }}>
            <Text>Block 模式：</Text>
          </div>
          <BasicSegmented
            block
            options={['Left', 'Center', 'Right']}
            defaultValue="Center"
          />
        </div>

        <Space>
          <Text>对象格式选项：</Text>
          <BasicSegmented
            options={[
              { label: '选项一', value: 'opt1' },
              { label: '选项二', value: 'opt2' },
              { label: '选项三', value: 'opt3', disabled: true }
            ]}
            defaultValue="opt1"
          />
        </Space>
      </Space>
    </ConfigProvider>
  );
};

export default BasicSegmentedBasicDemo;
