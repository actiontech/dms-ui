import { useTranslation } from 'react-i18next';
import { BasicInfoStyleWrapper } from './style';
import { BasicTag } from '@actiontech/dms-kit';
import { getSQLAuditRecordsV1FilterSqlAuditStatusEnum } from '@actiontech/shared/lib/api/sqle/service/sql_audit_record/index.enum';
import SqlAuditStatusTag from '../../List/component/SqlAuditStatusTag';
import { IAuditTaskResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
interface IBasicInfoWrapper {
  id: string;
  tags: string[];
  status?: string | getSQLAuditRecordsV1FilterSqlAuditStatusEnum;
  task?: IAuditTaskResV1;
}
const BasicInfoWrapper = ({ id, tags, status }: IBasicInfoWrapper) => {
  const { t } = useTranslation();
  return (
    <BasicInfoStyleWrapper>
      <h3 className="id-text">
        {t('sqlAudit.detail.auditID')}: {id ?? '-'}
      </h3>
      <div className="tags-cont">
        <div className="custom-tag-item">
          {t('sqlAudit.list.columns.auditStatus')}：
          {status ? (
            <SqlAuditStatusTag
              status={status as getSQLAuditRecordsV1FilterSqlAuditStatusEnum}
            />
          ) : (
            '-'
          )}
        </div>
        <div className="custom-tag-item">
          {t('sqlAudit.list.columns.businessTag')}：
          {Array.isArray(tags) && tags.length
            ? tags.map((tag: string) => {
                return (
                  <BasicTag key={tag} color="geekblue" size="small">
                    {tag}
                  </BasicTag>
                );
              })
            : '-'}
        </div>
      </div>
    </BasicInfoStyleWrapper>
  );
};
export default BasicInfoWrapper;
