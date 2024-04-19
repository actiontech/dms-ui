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

type ToggleTokensMultipleModeProps<V extends string | number | null = string> =
  {
    value?: V[];
    onChange?: (val?: V[]) => void;
    multiple: true;
  };

type ToggleTokensSingleModeProps<V extends string | number | null = string> = {
  value?: V;
  onChange?: (val?: V) => void;
  multiple?: false;
};

export type ToggleTokensProps<V extends string | number | null = string> =
  | (BaseToggleTokenPropsType & ToggleTokensMultipleModeProps<V>)
  | (BaseToggleTokenPropsType & ToggleTokensSingleModeProps<V>);
