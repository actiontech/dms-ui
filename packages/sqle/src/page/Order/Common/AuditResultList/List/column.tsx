import {
  IAuditResult,
  IAuditTaskSQLResV2
} from '@actiontech/shared/lib/api/sqle/service/common';
import {
  ActiontechTableActionMeta,
  ActiontechTableColumn
} from '@actiontech/shared/lib/components/ActiontechTable';
import { t } from '../../../../../locale';
import RenderSQL from '../../../../../components/RenderSQL';
import { EditText } from '@actiontech/shared';
import { tooltipsCommonProps } from '@actiontech/shared/lib/components/BasicToolTips';
import ResultIconRender from '../../../../../components/AuditResultMessage/ResultIconRender';
import AuditResultMessage from '../../../../../components/AuditResultMessage';

export const AuditResultForCreateOrderColumn = (
  updateSqlDescribe: (sqlNum: number, sqlDescribe: string) => void,
  onClickAuditResult: (record: IAuditTaskSQLResV2) => void
): ActiontechTableColumn<IAuditTaskSQLResV2> => {
  return [
    {
      dataIndex: 'number',
      title: () => t('audit.table.number'),
      width: 100
    },
    {
      dataIndex: 'exec_sql',
      title: () => t('audit.table.execSql'),
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
      dataIndex: 'audit_result',
      title: () => t('audit.table.auditResult'),
      className: 'audit-result-column',
      render: (result: IAuditResult[], record) => {
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
    },
    {
      dataIndex: 'description',
      title: () => t('audit.table.describe'),
      className: 'audit-result-describe-column',
      render: (description: string, record) => {
        return (
          <EditText
            editButtonProps={{
              children: t('audit.table.addDescribe'),
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
            value={description}
          />
        );
      }
    }
  ];
};

export const AuditResultForCreateOrderActions = (
  clickAnalyze: (sqlNum?: number) => void
): ActiontechTableActionMeta<IAuditTaskSQLResV2>[] => {
  return [
    {
      key: 'jumpAnalyze',
      text: t('audit.table.analyze'),
      buttonProps: (record) => {
        return {
          onClick: (e) => {
            e.stopPropagation();
            clickAnalyze(record?.number);
          }
        };
      }
    }
  ];
};
