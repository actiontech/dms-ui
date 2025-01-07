import { EmptyProps } from 'antd';
import { ReactNode } from 'react';

export interface BasicEmptyProps extends EmptyProps {
  loading?: boolean;
  dataLength?: number;
  errorInfo?: string | ReactNode;
  errorTitle?: string | ReactNode;
  emptyCont?: string | ReactNode;
  onRefresh?: () => void;
}
