import { SpaceProps } from 'antd';

export type ToggleTokensOptionsType = Array<
  | {
      label: React.ReactNode;
      value: string | number;
    }
  | string
>;

export type ToggleTokensProps<V = string> = {
  options: ToggleTokensOptionsType;
  value?: V;
  onChange?: (val?: V) => void;
  multiple?: boolean;
  withCheckbox?: boolean;
} & Omit<SpaceProps, 'onChange'>;
