import { useState } from 'react';
import { useBoolean, useKeyPress } from 'ahooks';
import { Spin } from 'antd';
import { IconCommonSelected } from '../../../Icon';
import { IConfigItemEditInputNumberProps } from '../index.type';
import BasicInputNumber from '../../BasicInputNumber';

const EditInputNumber: React.FC<IConfigItemEditInputNumberProps> = ({
  fieldValue,
  hideField,
  validator,
  onSubmit,
  submitLoading = false
}) => {
  const [inputValue, setInputValue] = useState(fieldValue);
  const [fieldError, { setTrue: setFieldError, setFalse: clearFieldError }] =
    useBoolean();

  const inputChange = (value: number | string | null) => {
    if (!value) return;
    setInputValue(Number(value));
  };

  const onValid = () => {
    if (validator && !validator(inputValue)) {
      setFieldError();
      return;
    }
    clearFieldError();
    onSubmit(inputValue);
  };

  useKeyPress('esc', hideField, {
    target: () => document.getElementById('editInputNumber')
  });

  useKeyPress('enter', () => onValid(), {
    target: () => document.getElementById('editInputNumber')
  });

  return (
    <Spin spinning={submitLoading}>
      <BasicInputNumber
        id="editInputNumber"
        value={inputValue}
        status={fieldError ? 'error' : ''}
        addonAfter={<IconCommonSelected onClick={() => onValid()} />}
        onChange={inputChange}
        autoFocus
      />
    </Spin>
  );
};

export default EditInputNumber;
