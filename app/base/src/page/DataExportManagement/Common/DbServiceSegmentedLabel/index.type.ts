import { AuditTaskResV1AuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export type DbServiceSegmentedLabelProps = {
  auditLevel?: AuditTaskResV1AuditLevelEnum;
  dbServiceName: string;
};
