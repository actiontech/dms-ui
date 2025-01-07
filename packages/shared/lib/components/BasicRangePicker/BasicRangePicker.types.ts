import { RangePickerProps } from 'antd/es/date-picker';
import { ReactNode } from 'react';

export type BasicRangePickerProps = RangePickerProps & {
  prefix?: ReactNode;
  hideSuperIcon?: boolean;
};
