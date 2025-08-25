import { useState } from 'react';
import { useBoolean, useKeyPress } from 'ahooks';
import { Spin } from 'antd';
import { ConfigItemEditInputNumberProps } from '../ConfigItem.types';
import BasicInputNumber from '../../BasicInputNumber/BasicInputNumber';

const EditInputNumber: React.FC<ConfigItemEditInputNumberProps> = ({
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
    if (value === null) return;
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
        onChange={inputChange}
        autoFocus
      />
    </Spin>
  );
};

export default EditInputNumber;
