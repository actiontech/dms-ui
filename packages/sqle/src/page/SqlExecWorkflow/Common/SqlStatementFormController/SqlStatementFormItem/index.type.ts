import { SqlAuditInfoFormProps } from '../../../Create/components/FormStep/SqlAuditInfoForm/index.type';
import { CreateWorkflowDatabaseInfo } from '../../../Create/index.type';

export type SqlStatementFormItemProps = {
  fieldPrefixPath: string;
  clearSqlContentFormWhenChangeUploadType?: boolean;
  disabledUploadType?: boolean;
  databaseInfo: CreateWorkflowDatabaseInfo;
  isSameSqlForAll: boolean;
  isAtRejectStep?: boolean;
  setActiveKey?: (key: string) => void;
} & Pick<SqlAuditInfoFormProps, 'isAuditing' | 'auditAction' | 'isAtFormStep'>;
