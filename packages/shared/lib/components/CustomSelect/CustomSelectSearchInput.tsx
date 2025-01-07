import { t } from 'i18next';
import {
  CustomSelectSearchInputRefType,
  CustomSelectSearchInputProps
} from './CustomSelect.types';
import { CustomSelectSearchInputStyleWrapper } from './style';
import { forwardRef } from 'react';

const CustomSelectSearchInput: React.ForwardRefRenderFunction<
  CustomSelectSearchInputRefType,
  CustomSelectSearchInputProps
> = ({ value, onChange }, ref) => {
  return (
    <CustomSelectSearchInputStyleWrapper
      ref={ref}
      className="custom-select-popup-search-input"
      bordered={false}
      placeholder={t('common.search')}
      value={value}
      onChange={(e) => {
        onChange?.(e.target.value);
      }}
      allowClear
    />
  );
};

export default forwardRef(CustomSelectSearchInput);
