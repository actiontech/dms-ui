import {
  ActiontechTableColumn,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable';
import { t } from '../../../../../locale';
import ResultIconRender from 'sqle/src/components/AuditResultMessage/ResultIconRender';
import AuditResultMessage from 'sqle/src/components/AuditResultMessage';
import { IListDataExportTaskSQL } from '@actiontech/shared/lib/api/base/service/common';
import { SQLRenderer } from '@actiontech/shared';

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
        return (
          <div onClick={() => onClickAuditResult(record)}>
            {result?.length > 1 ? (
              <ResultIconRender
                iconLevels={result.map((item) => {
                  return item.level ?? '';
                })}
              />
            ) : (
              <AuditResultMessage
                auditResult={
                  Array.isArray(result) && result.length ? result[0] : {}
                }
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
