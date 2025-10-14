import React, { useState } from 'react';
import {
  ConfigItem,
  ConfigProvider,
  EditInputNumber
} from '@actiontech/dms-kit';
import { useBoolean } from 'ahooks';
import { message } from 'antd';

const ConfigItemEditInputNumberDemo = () => {
  const [fieldVisible, { setTrue: showField, setFalse: hideField }] =
    useBoolean(false);
  const [
    submitLoading,
    { setTrue: setSubmitLoading, setFalse: setSubmitLoadingFalse }
  ] = useBoolean(false);
  const [currentValue, setCurrentValue] = useState(30);

  const handleSubmit = (value: number) => {
    setSubmitLoading();
    // 模拟提交
    setTimeout(() => {
      setCurrentValue(value);
      setSubmitLoadingFalse();
      hideField();
      message.success('保存成功');
    }, 1000);
  };

  const validator = (value: number) => {
    // 验证范围在 10-300 之间
    return value >= 10 && value <= 300;
  };

  return (
    <ConfigProvider>
      <div style={{ width: 600 }}>
        <ConfigItem
          label="连接超时时间 (秒)"
          descNode={`${currentValue} 秒`}
          inputNode={
            <EditInputNumber
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

export default ConfigItemEditInputNumberDemo;
