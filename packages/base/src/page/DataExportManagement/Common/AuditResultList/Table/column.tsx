import {
  ActiontechTableColumn,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable';
import { t } from '../../../../../locale';
import ResultIconRender from 'sqle/src/components/AuditResultMessage/ResultIconRender';
import AuditResultMessage from 'sqle/src/components/AuditResultMessage';
import { IListDataExportTaskSQL } from '@actiontech/shared/lib/api/base/service/common';
import { SQLRenderer } from '@actiontech/shared';

type AuditSqlResultWithPriority = NonNullable<
  IListDataExportTaskSQL['audit_sql_result']
>[number] & { error_priority?: string };

export const AuditResultForCreateOrderColumn = (
  onClickAuditResult: (record: IListDataExportTaskSQL) => void
): ActiontechTableColumn<IListDataExportTaskSQL> => {
  return [
    {
      dataIndex: 'uid',
      title: () => t('dmsDataExport.common.auditResult.column.number'),
      width: 100
    },
    {
      dataIndex: 'sql',
      title: () => t('dmsDataExport.common.auditResult.column.execSql'),
      className: 'audit-result-exec-sql-column',
      render: (sql = '', record) => {
        return (
          <SQLRenderer.Snippet
            sql={sql}
            rows={1}
            tooltip={false}
            onClick={() => onClickAuditResult(record)}
            showCopyIcon
            cuttingLength={200}
          />
        );
      }
    },
    {
      dataIndex: 'export_sql_type',
      title: () => t('dmsDataExport.common.auditResult.column.sqlType'),
      render: (type) => type || '-'
    },
    {
      dataIndex: 'audit_sql_result',
      title: () => t('dmsDataExport.common.auditResult.column.auditResult'),
      className: 'audit-result-column',
      render: (result = [], record) => {
        const results = (result ?? []) as AuditSqlResultWithPriority[];
        return (
          <div
            className="audit-result-wrapper"
            onClick={() => onClickAuditResult(record)}
          >
            {results.length > 1 ? (
              <ResultIconRender
                auditResultInfo={results.map((item) => ({
                  level: item.level ?? '',
                  executionFailed: false,
                  error_priority: item.error_priority
                }))}
              />
            ) : (
              <AuditResultMessage
                auditResult={results.length ? results[0] : {}}
              />
            )}
          </div>
        );
      }
    }
  ];
};

export const AuditResultForCreateOrderActions = (
  onCreateWhitelist: (record?: IListDataExportTaskSQL) => void
): ActiontechTableActionMeta<IListDataExportTaskSQL>[] => {
  return [
    {
      key: 'create-exception',
      text: t('dmsDataExport.common.auditResult.column.createWhitelist'),
      buttonProps: (record) => {
        return {
          onClick: (e) => {
            e.stopPropagation();
            onCreateWhitelist(record);
          }
        };
      }
    }
  ];
};
