import React, { useState } from 'react';
import { BasicSegmented, ConfigProvider } from '@actiontech/dms-kit';
import { Button, Space, Input, Card } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

const DynamicSegmentedDemo = () => {
  const [options, setOptions] = useState([
    { label: '选项 1', value: 'option1' },
    { label: '选项 2', value: 'option2' },
    { label: '选项 3', value: 'option3' }
  ]);
  const [value, setValue] = useState<string>('option1');
  const [newOption, setNewOption] = useState('');

  const addOption = () => {
    if (newOption.trim()) {
      const optionValue = `option${options.length + 1}`;
      setOptions([...options, { label: newOption.trim(), value: optionValue }]);
      setNewOption('');
    }
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    if (value === options[index].value && newOptions.length > 0) {
      setValue(newOptions[0].value);
    }
  };

  return (
    <ConfigProvider>
      <Card title="动态分段控制器" style={{ width: '100%' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Space>
              <Input
                placeholder="输入新选项名称"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                style={{ width: 200 }}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={addOption}
                disabled={!newOption.trim()}
              >
                添加选项
              </Button>
            </Space>
          </div>

          <BasicSegmented
            options={options}
            value={value}
            onChange={(v) => setValue(v as string)}
            block
          />

          <div>
            <div style={{ marginBottom: 8 }}>当前选项:</div>
            <Space wrap>
              {options.map((option, index) => (
                <div
                  key={option.value}
                  style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <span>{option.label}</span>
                  <Button
                    type="text"
                    size="small"
                    icon={<MinusOutlined />}
                    onClick={() => removeOption(index)}
                    danger
                  />
                </div>
              ))}
            </Space>
          </div>

          <div>
            当前选择: <strong>{value}</strong>
          </div>
        </Space>
      </Card>
    </ConfigProvider>
  );
};

export default DynamicSegmentedDemo;
