import { TooltipProps } from 'antd';
import { ReactNode } from 'react';

export type RenderSQLProps = {
  sql?: string;
  rows?: number;
  tooltip?: ReactNode | TooltipProps;
  onClick?: () => void;
};
