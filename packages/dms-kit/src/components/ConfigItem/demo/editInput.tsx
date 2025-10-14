import React, { useState } from 'react';
import { ConfigItem, ConfigProvider, EditInput } from '@actiontech/dms-kit';
import { useBoolean } from 'ahooks';
import { message } from 'antd';

const ConfigItemEditInputDemo = () => {
  const [fieldVisible, { setTrue: showField, setFalse: hideField }] =
    useBoolean(false);
  const [
    submitLoading,
    { setTrue: setSubmitLoading, setFalse: setSubmitLoadingFalse }
  ] = useBoolean(false);
  const [currentValue, setCurrentValue] = useState('example@company.com');

  const handleSubmit = (value: string) => {
    setSubmitLoading();
    // 模拟提交
    setTimeout(() => {
      setCurrentValue(value);
      setSubmitLoadingFalse();
      hideField();
      message.success('保存成功');
    }, 1000);
  };

  const validator = (value: string) => {
    // 简单的邮箱验证
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  return (
    <ConfigProvider>
      <div style={{ width: 600 }}>
        <ConfigItem
          label="系统邮箱地址"
          descNode={currentValue}
          inputNode={
            <EditInput
              fieldValue={currentValue}
              hideField={hideField}
              validator={validator}
              onSubmit={handleSubmit}
              submitLoading={submitLoading}
            />
          }
          fieldVisible={fieldVisible}
          showField={showField}
          hideField={hideField}
        />
      </div>
    </ConfigProvider>
  );
};

export default ConfigItemEditInputDemo;
