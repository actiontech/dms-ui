import { useState } from 'react';
import { useBoolean, useKeyPress } from 'ahooks';
import { Spin } from 'antd5';
import { IconCommonSelected } from '../../../Icon';
import { IConfigItemEditInputProps } from '../index.type';
import BasicInput from '../../BasicInput';

const EditInput: React.FC<IConfigItemEditInputProps> = ({
  fieldValue,
  hideField,
  validator,
  onSubmit,
  submitLoading = false
}) => {
  const [inputValue, setInputValue] = useState(fieldValue);
  const [fieldError, { setTrue: setFieldError, setFalse: clearFieldError }] =
    useBoolean();

  const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
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
    target: () => document.getElementById('editInput')
  });

  useKeyPress('enter', () => onValid(), {
    target: () => document.getElementById('editInput')
  });

  return (
    <Spin spinning={submitLoading}>
      <BasicInput
        id="editInput"
        value={inputValue}
        status={fieldError ? 'error' : ''}
        addonAfter={<IconCommonSelected onClick={() => onValid()} />}
        autoFocus
        onChange={inputChange}
      />
    </Spin>
  );
};

export default EditInput;
