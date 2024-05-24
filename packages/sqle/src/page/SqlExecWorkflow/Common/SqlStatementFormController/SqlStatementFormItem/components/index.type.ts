import { SqlStatementFormItemProps } from '../index.type';

export type SqlUploadContentProps = Pick<
  SqlStatementFormItemProps,
  'fieldPrefixPath'
>;

export type SqlExecModeSelectorProps = Pick<
  SqlStatementFormItemProps,
  'fieldPrefixPath' | 'isSupportFileModeExecuteSql'
>;

export type SqlFormatterAndSubmitterProps = Pick<
  SqlStatementFormItemProps,
  | 'fieldPrefixPath'
  | 'isAuditing'
  | 'auditAction'
  | 'databaseInfo'
  | 'isSameSqlForAll'
>;