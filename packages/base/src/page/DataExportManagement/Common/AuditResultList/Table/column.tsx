import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import { t } from '../../../../../locale';
import RenderSQL from 'sqle/src/components/RenderSQL';
import ResultIconRender from 'sqle/src/components/AuditResultMessage/ResultIconRender';
import AuditResultMessage from 'sqle/src/components/AuditResultMessage';
import {
  IAuditSQLResult,
  IListDataExportTaskSQL
} from '@actiontech/shared/lib/api/base/service/common';

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
          <RenderSQL
            sql={sql}
            rows={1}
            tooltip={false}
            onClick={() => onClickAuditResult(record)}
          />
        );
      }
    },
    {
      dataIndex: 'audit_sql_result',
      title: () => t('dmsDataExport.common.auditResult.column.auditResult'),
      className: 'audit-result-column',
      render: (result: IAuditSQLResult[], record) => {
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
