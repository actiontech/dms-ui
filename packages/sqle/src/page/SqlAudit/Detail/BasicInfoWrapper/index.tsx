import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { BasicInfoStyleWrapper } from './style';
import { BasicTag } from '@actiontech/shared';
import { getSQLAuditRecordsV1FilterSqlAuditStatusEnum } from '@actiontech/shared/lib/api/sqle/service/sql_audit_record/index.enum';
import SqlAuditStatusTag from '../../List/component/SqlAuditStatusTag';
import {
  IAuditTaskResV1,
  ISQLAuditRecordInstance
} from '@actiontech/shared/lib/api/sqle/service/common';
import { AuditTaskResV1SqlSourceEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

interface IBasicInfoWrapper {
  id: string;
  tags: string[];
  status?: string | getSQLAuditRecordsV1FilterSqlAuditStatusEnum;
  task?: IAuditTaskResV1;
  instance?: ISQLAuditRecordInstance;
}

const EMPTY = '-';

const displayText = (value?: string | null) => {
  const trimmed = (value ?? '').trim();
  return trimmed || EMPTY;
};

const BasicInfoWrapper = ({
  id,
  tags,
  status,
  task,
  instance
}: IBasicInfoWrapper) => {
  const { t } = useTranslation();

  const address = useMemo(() => {
    const host = (instance?.db_host ?? '').trim();
    const port = (instance?.db_port ?? '').trim();
    if (!host || !port) {
      return EMPTY;
    }
    return `${host}:${port}`;
  }, [instance?.db_host, instance?.db_port]);

  const sqlSourceLabel = useMemo(() => {
    const source = task?.sql_source;
    if (!source) {
      return EMPTY;
    }
    const map: Partial<Record<AuditTaskResV1SqlSourceEnum, string>> = {
      [AuditTaskResV1SqlSourceEnum.form_data]: t(
        'sqlAudit.detail.sourceHeader.sqlSourceEnum.form_data'
      ),
      [AuditTaskResV1SqlSourceEnum.sql_file]: t(
        'sqlAudit.detail.sourceHeader.sqlSourceEnum.sql_file'
      ),
      [AuditTaskResV1SqlSourceEnum.mybatis_xml_file]: t(
        'sqlAudit.detail.sourceHeader.sqlSourceEnum.mybatis_xml_file'
      ),
      [AuditTaskResV1SqlSourceEnum.zip_file]: t(
        'sqlAudit.detail.sourceHeader.sqlSourceEnum.zip_file'
      ),
      [AuditTaskResV1SqlSourceEnum.git_repository]: t(
        'sqlAudit.detail.sourceHeader.sqlSourceEnum.git_repository'
      )
    };
    return map[source as AuditTaskResV1SqlSourceEnum] ?? EMPTY;
  }, [t, task?.sql_source]);

  const sourceFiles = useMemo(() => {
    const names = (task?.audit_files ?? [])
      .map((f) => (f.file_name ?? '').trim())
      .filter(Boolean);
    return names.length ? names.join('、') : EMPTY;
  }, [task?.audit_files]);

  const sourceFields: Array<{
    testId: string;
    label: string;
    value: string;
  }> = [
    {
      testId: 'sql-audit-report-header-instance_name',
      label: t('sqlAudit.detail.sourceHeader.instanceName'),
      value: displayText(task?.instance_name)
    },
    {
      testId: 'sql-audit-report-header-address',
      label: t('sqlAudit.detail.sourceHeader.address'),
      value: address
    },
    {
      testId: 'sql-audit-report-header-instance_db_type',
      label: t('sqlAudit.detail.sourceHeader.instanceDbType'),
      value: displayText(task?.instance_db_type)
    },
    {
      testId: 'sql-audit-report-header-instance_schema',
      label: t('sqlAudit.detail.sourceHeader.instanceSchema'),
      value: displayText(task?.instance_schema)
    },
    {
      testId: 'sql-audit-report-header-sql_source',
      label: t('sqlAudit.detail.sourceHeader.sqlSource'),
      value: sqlSourceLabel
    },
    {
      testId: 'sql-audit-report-header-source_files',
      label: t('sqlAudit.detail.sourceHeader.sourceFiles'),
      value: sourceFiles
    }
  ];

  return (
    <BasicInfoStyleWrapper>
      <h3 className="id-text">
        {t('sqlAudit.detail.auditID')}: {id ?? EMPTY}
      </h3>
      <div className="tags-cont">
        <div className="custom-tag-item">
          {t('sqlAudit.list.columns.auditStatus')}：
          {status ? (
            <SqlAuditStatusTag
              status={status as getSQLAuditRecordsV1FilterSqlAuditStatusEnum}
            />
          ) : (
            EMPTY
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
            : EMPTY}
        </div>
      </div>
      <div className="source-fields-cont">
        {sourceFields.map((field) => (
          <div
            key={field.testId}
            className="source-field-item"
            data-testid={field.testId}
          >
            {field.label}：{field.value}
          </div>
        ))}
      </div>
    </BasicInfoStyleWrapper>
  );
};

export default BasicInfoWrapper;
