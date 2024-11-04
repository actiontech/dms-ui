import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import { EditText, SQLRenderer } from '@actiontech/shared';
import { tooltipsCommonProps } from '@actiontech/shared/lib/components/BasicToolTips';
import { t } from '../../../../../locale';
import ResultIconRender from '../../../../../components/AuditResultMessage/ResultIconRender';

export const AuditResultForCreateWorkflowColumn = (
  updateSqlDescribe: (sqlNum: number, sqlDescribe: string) => void,
  onClickAuditResult: (record: IAuditTaskSQLResV2) => void
): ActiontechTableColumn<IAuditTaskSQLResV2> => {
  return [
    {
      dataIndex: 'number',
      title: () => t('execWorkflow.audit.table.number'),
      width: 150
    },
    {
      dataIndex: 'exec_sql',
      title: () => t('execWorkflow.audit.table.execSql'),
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
      dataIndex: 'audit_result',
      title: () => t('execWorkflow.audit.table.auditResult'),
      className: 'audit-result-column',
      render: (result, record) => {
        return (
          <div onClick={() => onClickAuditResult(record)}>
            <ResultIconRender
              iconLevels={result?.map((item) => {
                return item.level ?? '';
              })}
            />
          </div>
        );
      }
    },
    {
      dataIndex: 'description',
      title: () => t('execWorkflow.audit.table.describe'),
      className: 'audit-result-describe-column',
      render: (description, record) => {
        return (
          <EditText
            editButtonProps={{
              children: t('execWorkflow.audit.table.addDescribe'),
              size: 'small'
            }}
            editable={{
              autoSize: true,
              onEnd: (val) => {
                updateSqlDescribe(record.number ?? 0, val);
              }
            }}
            ellipsis={{
              expandable: false,
              tooltip: {
                arrow: false,
                ...tooltipsCommonProps(description, 500)
              },
              rows: 1
            }}
            value={description ?? ''}
          />
        );
      }
    }
  ];
};
