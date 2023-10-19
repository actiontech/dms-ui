export interface IAuditDetail<T extends Record<string, any>> {
  title: string;
  dataSource?: T;
  columns: IColumns<T>[];
  loading: boolean;
  error?: string;
}

export type IColumns<T extends Record<string, any>> = (
  | {
      type: columnType.action | columnType.object;
      render?: (val: any, record: T) => React.ReactNode;
    }
  | {
      type: columnType.table;
      columns: TableColumn<T>;
      // 表格占位栅格数,默认为12
      tableSpan?: number;
      render?: (val: any, record: T) => Partial<string, any>[];
    }
) & {
  label: string;
  key: keyof T;
};

export enum columnType {
  'action' = 'action',
  'object' = 'object',
  'table' = 'table'
}

export interface IListData {
  label: string;
  value: any;
}
