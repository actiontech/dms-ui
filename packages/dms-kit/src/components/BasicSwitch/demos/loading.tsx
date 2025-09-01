import React, { useState } from 'react';
import { BasicSwitch, ConfigProvider } from '@actiontech/dms-kit';
import { message } from 'antd';

const BasicSwitchLoadingDemo = () => {
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleChange = async (val: boolean) => {
    setLoading(true);

    // 模拟异步操作
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setChecked(val);
      message.success(`设置已${val ? '开启' : '关闭'}`);
    } catch (error) {
      message.error('操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <BasicSwitch
          checked={checked}
          loading={loading}
          onChange={handleChange}
        />
        <div style={{ marginTop: '16px' }}>
          状态: {checked ? '开启' : '关闭'}
          {loading && ' (处理中...)'}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default BasicSwitchLoadingDemo;
