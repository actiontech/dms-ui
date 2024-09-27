import { InputRef, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { RefObject } from 'react';

export type CustomSelectProps = {
  prefix?: React.ReactNode;
  valuePrefix?: React.ReactNode;
  searchInputRef?: RefObject<CustomSelectSearchInputRefType>;
  optionCustomLabel?: (option: DefaultOptionType) => React.ReactNode;
} & SelectProps;

export type CustomSelectSearchInputProps = {
  value?: string;
  onChange?: (val: string) => void;
};

export type CustomSelectSearchInputRefType = InputRef;
