import { InputProps } from 'antd';

export type CustomInputProps = {
  prefix?: React.ReactNode;
  onCustomPressEnter: (value: string) => void;
} & InputProps;
