import { sqlAuditStatusDictionary } from '../../../hooks/useStaticStatus/index.data';
import { t } from '../../../locale';
import { getSQLAuditRecordsV1FilterSqlAuditStatusEnum } from '@actiontech/shared/lib/api/sqle/service/sql_audit_record/index.enum';

export const sqlAuditStatusOptions = [
  {
    label: t(
      sqlAuditStatusDictionary[
        getSQLAuditRecordsV1FilterSqlAuditStatusEnum.auditing
      ]
    ),
    value: getSQLAuditRecordsV1FilterSqlAuditStatusEnum.auditing
  },
  {
    label: t(
      sqlAuditStatusDictionary[
        getSQLAuditRecordsV1FilterSqlAuditStatusEnum.successfully
      ]
    ),
    value: getSQLAuditRecordsV1FilterSqlAuditStatusEnum.successfully
  }
];
