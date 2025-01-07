import { TableProps } from 'antd';

export interface BasicTableProps<T = Record<string, any>>
  extends TableProps<T> {
  errorMessage?: string;
  isPaginationFixed?: boolean;
}
