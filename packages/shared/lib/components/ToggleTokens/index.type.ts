import { SpaceProps } from 'antd';

export type ToggleTokensOptionsType = Array<
  | {
      label: React.ReactNode;
      value: string | number;
    }
  | string
>;

type BaseToggleTokenPropsType = Omit<SpaceProps, 'onChange'> & {
  options: ToggleTokensOptionsType;
  withCheckbox?: boolean;
};

type ToggleTokensMultipleModeProps<V = string> = {
  value?: V[];
  onChange?: (val?: V[]) => void;
  multiple: true;
};

type ToggleTokensSingleModeProps<V = string> = {
  value?: V;
  onChange?: (val?: V) => void;
  multiple?: false;
};

export type ToggleTokensProps<V = string> =
  | (BaseToggleTokenPropsType & ToggleTokensMultipleModeProps<V>)
  | (BaseToggleTokenPropsType & ToggleTokensSingleModeProps<V>);
