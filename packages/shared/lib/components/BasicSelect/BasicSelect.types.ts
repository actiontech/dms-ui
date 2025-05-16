import { SelectProps } from 'antd';

export type BasicSelectProps<V = string> = SelectProps<V> & {
  prefix?: React.ReactNode;
};
