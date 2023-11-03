import { useTranslation } from 'react-i18next';

import { BasicInfoStyleWrapper } from './style';
import { BasicTag } from '@actiontech/shared';
import { getSQLAuditRecordsV1FilterSqlAuditStatusEnum } from '@actiontech/shared/lib/api/sqle/service/sql_audit_record/index.enum';
import SqlAuditStatusTag from '../../List/component/SqlAuditStatusTag';
import { IAuditTaskResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import AuditResultInfo from '../../../Order/Common/AuditResultFilterContainer/AuditResultInfo';

interface IBasicInfoWrapper {
  id: string;
  tags: string[];
  status?: string | getSQLAuditRecordsV1FilterSqlAuditStatusEnum;
  task?: IAuditTaskResV1;
}

const BasicInfoWrapper = ({ id, tags, status, task }: IBasicInfoWrapper) => {
  const { t } = useTranslation();

  return (
    <BasicInfoStyleWrapper>
      <div className="header-wrapper">
        <h3 className="id-text">
          {t('sqlAudit.detail.auditID')}: {id ?? '-'}
        </h3>
        <AuditResultInfo
          {...{
            score: task?.score,
            passRate: task?.pass_rate,
            instanceSchemaName: task?.instance_schema,
            auditLevel: task?.audit_level,
            noPadding: true
          }}
        />
      </div>
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
