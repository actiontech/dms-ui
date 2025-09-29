import { useState } from 'react';
import { useBoolean, useKeyPress } from 'ahooks';
import { Spin } from 'antd';
import { ConfigItemEditInputProps } from '../ConfigItem.types';
import { BasicInput } from '../../BasicInput';

const EditInput: React.FC<ConfigItemEditInputProps> = ({
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
        addonAfter={
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="custom-icon custom-icon-selected"
            onClick={() => onValid()}
          >
            <g id="selected">
              <path
                id="Vector"
                d="M3.33334 8.00002L6.66668 11.3334L13.3333 4.66669"
                stroke="#4583FF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        }
        autoFocus
        onChange={inputChange}
      />
    </Spin>
  );
};

export default EditInput;
