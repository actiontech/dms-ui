import { ISQLAuditRecord } from '@actiontech/shared/lib/api/sqle/service/common';

export interface ISQLAuditRecordExtraParams extends ISQLAuditRecord {
  instance_name?: string;
  auditTime?: string;
}
