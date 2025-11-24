import React from 'react';
import { BasicInputNumber, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Typography } from 'antd';

const { Text } = Typography;

/**
 * 格式化显示
 * - 百分比格式
 * - 货币格式（带千分位）
 * - 千分位格式
 */
const FormatterDemo = () => {
  return (
    <ConfigProvider>
      <Space direction="vertical" size="middle">
        <Space>
          <Text>百分比格式：</Text>
          <BasicInputNumber
            min={0}
            max={100}
            defaultValue={50}
            formatter={(value) => `${value}%`}
            parser={(value) => value!.replace('%', '')}
            style={{ width: 200 }}
          />
        </Space>

        <Space>
          <Text>货币格式：</Text>
          <BasicInputNumber
            min={0}
            precision={2}
            defaultValue={1000}
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
            style={{ width: 200 }}
          />
        </Space>

        <Space>
          <Text>人民币格式：</Text>
          <BasicInputNumber
            min={0}
            precision={2}
            defaultValue={1000}
            formatter={(value) =>
              `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => value!.replace(/¥\s?|(,*)/g, '')}
            style={{ width: 200 }}
          />
        </Space>

        <Space>
          <Text>千分位格式：</Text>
          <BasicInputNumber
            defaultValue={1000000}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => value!.replace(/,/g, '')}
            style={{ width: 200 }}
          />
        </Space>

        <Space>
          <Text>带单位（KB）：</Text>
          <BasicInputNumber
            min={0}
            defaultValue={1024}
            formatter={(value) => `${value} KB`}
            parser={(value) => value!.replace(' KB', '')}
            style={{ width: 200 }}
          />
        </Space>
      </Space>
    </ConfigProvider>
  );
};

export default FormatterDemo;
