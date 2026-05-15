import { useTranslation } from 'react-i18next';
import { getSQLAuditRecordsV1FilterSqlAuditStatusEnum } from '@actiontech/shared/lib/api/sqle/service/sql_audit_record/index.enum';
import { useMemo } from 'react';
import { BasicTag } from '@actiontech/dms-kit';
import { BasicTagColor } from '@actiontech/dms-kit/es/theme/theme.type';
export interface ISqlAuditStatusTag {
  status: getSQLAuditRecordsV1FilterSqlAuditStatusEnum;
}
const SqlAuditStatusTag = ({ status }: ISqlAuditStatusTag) => {
  const { t } = useTranslation();
  const color = useMemo(() => {
    const allColor = {
      auditing: 'geekblue',
      successfully: 'green'
    };
    return allColor[status];
  }, [status]);
  return (
    <>
      <BasicTag size="small" color={color as BasicTagColor}>
        {t(`sqlAudit.list.status.auditStatus.${status}`)}
      </BasicTag>
    </>
  );
};
export default SqlAuditStatusTag;
