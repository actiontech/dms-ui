import React from 'react';
import { BasicSelect, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Typography } from 'antd';

const { Text } = Typography;

/**
 * 多选和搜索
 * - 支持多选模式
 * - 支持标签模式
 * - 支持搜索过滤
 */
const MultipleDemo = () => {
  const options = [
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
    { label: '选项3', value: '3' },
    { label: '选项4', value: '4' },
    { label: '选项5', value: '5' },
    { label: '选项6', value: '6' },
    { label: '选项7', value: '7' },
    { label: '选项8', value: '8' }
  ];

  return (
    <ConfigProvider>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <Text>多选模式：</Text>
          <BasicSelect
            mode="multiple"
            placeholder="请选择多个选项"
            options={options}
            style={{ width: 300, marginLeft: 8 }}
          />
        </div>

        <div>
          <Text>带默认值：</Text>
          <BasicSelect
            mode="multiple"
            options={options}
            defaultValue={['1', '2']}
            allowClear
            style={{ width: 300, marginLeft: 8 }}
          />
        </div>

        <div>
          <Text>支持搜索：</Text>
          <BasicSelect
            mode="multiple"
            placeholder="输入关键词搜索"
            options={options}
            showSearch
            filterOption={(input, option) =>
              String(option?.label ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            style={{ width: 300, marginLeft: 8 }}
          />
        </div>

        <div>
          <Text>标签模式：</Text>
          <BasicSelect
            mode="tags"
            placeholder="输入或选择标签"
            options={options}
            style={{ width: 300, marginLeft: 8 }}
          />
        </div>

        <div>
          <Text>限制标签数：</Text>
          <BasicSelect
            mode="multiple"
            placeholder="最多显示2个标签"
            options={options}
            defaultValue={['1', '2', '3', '4']}
            maxTagCount={2}
            style={{ width: 300, marginLeft: 8 }}
          />
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default MultipleDemo;
