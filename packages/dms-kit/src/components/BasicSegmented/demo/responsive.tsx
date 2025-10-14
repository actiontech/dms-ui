import React, { useState, useEffect } from 'react';
import { Space, Button } from 'antd';
import { ConfigProvider, BasicSegmented } from '@actiontech/dms-kit';

const BasicSegmentedResponsiveDemo: React.FC = () => {
  const [value, setValue] = useState<string | number>('all');
  const [options, setOptions] = useState<string[]>([
    'all',
    'pending',
    'completed'
  ]);

  const allOptions = ['all', 'pending', 'completed', 'cancelled', 'archived'];
  const mobileOptions = ['all', 'pending', 'completed'];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setOptions(mobileOptions);
      } else {
        setOptions(allOptions);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const addOption = () => {
    if (options.length < allOptions.length) {
      setOptions(allOptions);
    }
  };

  const removeOption = () => {
    if (options.length > mobileOptions.length) {
      setOptions(mobileOptions);
    }
  };

  return (
    <ConfigProvider>
      <Space direction="vertical" size="large">
        <div>
          <h4>响应式选项</h4>
          <p>当前选项数量: {options.length}</p>
          <Space>
            <Button size="small" onClick={addOption}>
              添加选项
            </Button>
            <Button size="small" onClick={removeOption}>
              减少选项
            </Button>
          </Space>
        </div>

        <BasicSegmented
          options={options}
          value={value}
          onChange={setValue}
          style={{ minWidth: '200px' }}
        />

        <div>
          当前选择: <strong>{value}</strong>
        </div>

        <div>
          <h4>动态选项变化</h4>
          <BasicSegmented
            options={options.map((opt) => ({
              label: opt.charAt(0).toUpperCase() + opt.slice(1),
              value: opt
            }))}
            value={value}
            onChange={setValue}
          />
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default BasicSegmentedResponsiveDemo;
