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

export type BackupSqlType = IBackupSqlData & {
  id?: string;
  disabled?: boolean;
  remark?: string;
};

export type TableRowSelection<T extends object> = TableProps<T>['rowSelection'];

export interface TableTransferProps extends TransferProps<BackupSqlType> {
  dataSource: BackupSqlType[];
  leftColumns: TableColumnsType<BackupSqlType>;
  rightColumns: TableColumnsType<BackupSqlType>;
  loading: boolean;
  leftDataSource?: BackupSqlType[];
  rightDataSource?: BackupSqlType[];
  leftPagination: TablePaginationConfig;
  onTableChange: TableProps<BackupSqlType>['onChange'];
}
