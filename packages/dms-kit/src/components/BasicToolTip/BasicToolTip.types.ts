import { TooltipProps } from 'antd';

export type BasicTooltipProps = TooltipProps & {
  prefixIcon?: boolean | React.ReactNode;
  suffixIcon?: boolean | React.ReactNode;
  titleWidth?: number;
};
