import { CardProps } from 'antd';

export type BasicInfoDataType = {
  key: React.ReactNode;
  value: React.ReactNode;
};

export interface BasicInfoListProps extends CardProps {
  data: BasicInfoDataType[];
  columnNumber?: number;
  errorInfo?: string | React.ReactNode;
  errorTitle?: string | React.ReactNode;
  loading?: boolean;
}
