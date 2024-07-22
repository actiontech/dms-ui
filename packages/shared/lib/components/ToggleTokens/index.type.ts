import { SpaceProps } from 'antd';

export type ToggleTokensOptionsType = Array<{
  label: React.ReactNode;
  value: string | number;
  onClick?: (checked: boolean) => void;
  className?: string;
}>;

type BaseToggleTokenPropsType = Omit<SpaceProps, 'onChange'> & {
  options: ToggleTokensOptionsType | string[];
  withCheckbox?: boolean;
  noStyle?: boolean;
  labelDictionary?: Record<string, string>;
  disabled?: boolean;
};

type ToggleTokensMultipleModeProps<V extends string | number | null = string> =
  {
    value?: V[];
    onChange?: (val: V[]) => void;
    defaultValue?: V[];
    multiple: true;
  };

type ToggleTokensSingleModeProps<V extends string | number | null = string> = {
  value?: V;
  onChange?: (val: V) => void;
  defaultValue?: V;
  multiple?: false;
};

export type ToggleTokensProps<V extends string | number | null = string> =
  | (BaseToggleTokenPropsType & ToggleTokensMultipleModeProps<V>)
  | (BaseToggleTokenPropsType & ToggleTokensSingleModeProps<V>);
