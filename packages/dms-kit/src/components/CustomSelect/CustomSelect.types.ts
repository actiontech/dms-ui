import { InputRef, SelectProps } from 'antd';
import { RefObject } from 'react';

export type CustomSelectProps = {
  prefix?: React.ReactNode;
  valuePrefix?: React.ReactNode;
  searchInputRef?: RefObject<CustomSelectSearchInputRefType>;
} & SelectProps;

export type CustomSelectSearchInputProps = {
  value?: string;
  onChange?: (val: string) => void;
};

export type CustomSelectSearchInputRefType = InputRef;
