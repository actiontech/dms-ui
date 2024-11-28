import {
  IBackupSqlData,
  IWorkflowResV2,
  IAuditTaskResV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import type {
  TableColumnsType,
  TableProps,
  TransferProps,
  TablePaginationConfig
} from 'antd';

export type SqlRollbackProps = {
  isAtRollbackStep: boolean;
  backToWorkflowDetail: () => void;
  workflowInfo?: IWorkflowResV2;
  taskInfos?: IAuditTaskResV1[];
};

export type ExpandedBackupSqlType = IBackupSqlData & {
  id?: string;
  disabled?: boolean;
  remark?: string;
  rollbackOrder?: number;
};

export type TableRowSelection<T extends object> = TableProps<T>['rowSelection'];

export interface TableTransferProps
  extends TransferProps<ExpandedBackupSqlType> {
  dataSource: ExpandedBackupSqlType[];
  leftColumns: TableColumnsType<ExpandedBackupSqlType>;
  rightColumns: TableColumnsType<ExpandedBackupSqlType>;
  loading: boolean;
  leftDataSource?: ExpandedBackupSqlType[];
  rightDataSource?: ExpandedBackupSqlType[];
  leftPagination: TablePaginationConfig;
  onTableChange: TableProps<ExpandedBackupSqlType>['onChange'];
}
