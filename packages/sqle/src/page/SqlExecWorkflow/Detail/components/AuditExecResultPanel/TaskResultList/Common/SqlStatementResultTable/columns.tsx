import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import ExecStatusTag from '../ResultCard/components/ExecStatusTag';
import { getAuditTaskSQLsV2FilterExecStatusEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { SQLRenderer } from '@actiontech/shared';
import { IBasicTable } from '@actiontech/shared/lib/components/BasicTable';
import { t } from '../../../../../../../../locale';
import ResultIconRender from '../../../../../../../../components/AuditResultMessage/ResultIconRender';

export const SQLStatementResultColumns = (
  onClickAuditResult: (record: IAuditTaskSQLResV2) => void
): IBasicTable<IAuditTaskSQLResV2>['columns'] => {
  return [
    {
      dataIndex: 'number',
      title: () => t('audit.table.number'),
      width: 100
    },
    {
      dataIndex: 'exec_sql',
      title: () => t('audit.table.execSql'),
      className: 'ellipsis-column-large-width',
      render: (sql = '', record) => {
        return (
          <SQLRenderer.Snippet
            showCopyIcon
            sql={sql}
            rows={1}
            tooltip={false}
            onClick={() => onClickAuditResult(record)}
            cuttingLength={200}
          />
        );
      }
    },
    {
      dataIndex: 'audit_result',
      title: () => t('audit.table.auditResult'),
      render: (result: IAuditTaskSQLResV2['audit_result'] = [], record) => {
        return (
          <div
            className="audit-result-wrapper"
            onClick={() => onClickAuditResult(record)}
          >
            <ResultIconRender
              iconLevels={result.map((item) => {
                return item.level ?? '';
              })}
            />
          </div>
        );
      }
    },
    {
      dataIndex: 'exec_status',
      title: () => t('audit.table.execResult'),
      className: 'exec-status-column',
      render: (status: getAuditTaskSQLsV2FilterExecStatusEnum) => {
        return <ExecStatusTag status={status} />;
      }
    }
  ];
};
