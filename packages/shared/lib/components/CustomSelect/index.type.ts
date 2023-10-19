import { SelectProps } from 'antd5';

export type CustomSelectProps = {
  prefix?: React.ReactNode;
  valuePrefix?: React.ReactNode;
  dropdownSlot?: React.ReactNode;
} & SelectProps;
