import { ColProps, RowProps } from 'antd';

export type ModeSwitcherOptionsType = Array<{
  label: React.ReactNode;
  value: string | number;
  icon?: React.ReactNode;
  colProps?: ColProps;
}>;

export type ModeSwitcherProps<V extends string | number = string> = {
  value?: V;
  defaultValue?: V;
  onChange?: (val: V) => void;
  options: ModeSwitcherOptionsType | Array<string>;
  className?: string;
  rowProps?: RowProps;
  disabled?: boolean;
};
