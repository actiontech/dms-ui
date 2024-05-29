import { AuditTaskResV1SqlSourceEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { SqlStatementFormItemProps } from '../index.type';

export type SqlUploadContentProps = {
  currentSqlUploadType: AuditTaskResV1SqlSourceEnum;
} & Pick<SqlStatementFormItemProps, 'fieldPrefixPath'>;

export type SqlExecModeSelectorProps = {
  currentSqlUploadType: AuditTaskResV1SqlSourceEnum;
} & Pick<
  SqlStatementFormItemProps,
  'fieldPrefixPath' | 'isSupportFileModeExecuteSql'
>;

export type SqlFormatterAndSubmitterProps = {
  currentSqlUploadType: AuditTaskResV1SqlSourceEnum;
} & Pick<
  SqlStatementFormItemProps,
  | 'fieldPrefixPath'
  | 'isAuditing'
  | 'auditAction'
  | 'databaseInfo'
  | 'isSameSqlForAll'
>;
