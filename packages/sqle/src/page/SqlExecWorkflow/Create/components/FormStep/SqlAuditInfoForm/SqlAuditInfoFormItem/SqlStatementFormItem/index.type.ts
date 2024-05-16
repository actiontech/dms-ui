import { SqlAuditInfoFormProps } from '../../index.type';

export type SqlStatementFormItemProps = {
  fieldPrefixPath: string;
  clearSqlContentFormWhenChangeUploadType?: boolean;
} & Pick<
  SqlAuditInfoFormProps,
  'isAuditing' | 'auditAction' | 'isSupportFileModeExecuteSQL'
>;
