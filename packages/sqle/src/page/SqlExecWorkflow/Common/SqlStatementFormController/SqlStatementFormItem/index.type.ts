import { SqlAuditInfoFormProps } from '../../../Create/components/FormStep/SqlAuditInfoForm/index.type';
import { CreateWorkflowDatabaseInfo } from '../../../Create/index.type';

export type SqlStatementFormItemProps = {
  fieldPrefixPath: string;
  clearSqlContentFormWhenChangeUploadType?: boolean;
  disabledUploadType?: boolean;
  databaseInfo: CreateWorkflowDatabaseInfo;
  isSameSqlForAll: boolean;
  isSupportFileModeExecuteSql: boolean;
} & Pick<SqlAuditInfoFormProps, 'isAuditing' | 'auditAction'>;
