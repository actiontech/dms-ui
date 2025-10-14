import React, { useState } from 'react';
import { Space, Switch } from 'antd';
import { ConfigProvider, BasicSegmented } from '@actiontech/dms-kit';

const BasicSegmentedDisabledDemo: React.FC = () => {
  const [disabled, setDisabled] = useState(false);
  const [value, setValue] = useState<string | number>('all');

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large">
        <div>
          <Switch
            checked={disabled}
            onChange={setDisabled}
            checkedChildren="禁用"
            unCheckedChildren="启用"
          />
          <span style={{ marginLeft: 8 }}>
            分段控制器状态: {disabled ? '禁用' : '启用'}
          </span>
        </div>

        <BasicSegmented
          disabled={disabled}
          options={['all', 'pending', 'completed', 'cancelled']}
          value={value}
          onChange={setValue}
        />

        <div>
          当前选择: <strong>{value}</strong>
        </div>

        <div>
          <h4>部分选项禁用</h4>
          <BasicSegmented
            options={[
              { label: '全部', value: 'all' },
              { label: '待处理', value: 'pending' },
              { label: '已完成', value: 'completed', disabled: true },
              { label: '已取消', value: 'cancelled', disabled: true }
            ]}
            value={value}
            onChange={setValue}
          />
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default BasicSegmentedDisabledDemo;
