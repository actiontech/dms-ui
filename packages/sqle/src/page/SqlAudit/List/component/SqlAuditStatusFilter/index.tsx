import React from 'react';
import { useTranslation } from 'react-i18next';
import { BasicSegmented } from '@actiontech/shared';
import { getSQLAuditRecordsV1FilterSqlAuditStatusEnum } from '@actiontech/shared/lib/api/sqle/service/sql_audit_record/index.enum';
import { sqlAuditStatusDictionary } from '../../../../../hooks/useStaticStatus/index.data';

const SqlAuditStatusFIlter: React.FC<{
  status: getSQLAuditRecordsV1FilterSqlAuditStatusEnum | 'all';
  onChange: (
    status: getSQLAuditRecordsV1FilterSqlAuditStatusEnum | 'all'
  ) => void;
}> = ({ status, onChange }) => {
  const { t } = useTranslation();
  return (
    <BasicSegmented
      value={status}
      onChange={(v) => {
        const key = v as typeof status;
        onChange(key);
      }}
      options={[
        'all',
        ...Object.keys(getSQLAuditRecordsV1FilterSqlAuditStatusEnum)
      ].map((v) => {
        const key = v as typeof status;
        return {
          label:
            key === 'all'
              ? t('common.all')
              : t(
                  sqlAuditStatusDictionary[
                    getSQLAuditRecordsV1FilterSqlAuditStatusEnum[key]
                  ]
                ),
          value: key
        };
      })}
    />
  );
};

export default SqlAuditStatusFIlter;
