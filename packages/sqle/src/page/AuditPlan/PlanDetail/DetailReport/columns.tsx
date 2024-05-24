import {
  ActiontechTableColumn,
  ActiontechTableActionMeta,
  PageInfoWithoutIndexAndSize
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IGetAuditPlanReportsSQLsParams } from '@actiontech/shared/lib/api/sqle/service/audit_plan/index.d';
import {
  IAuditPlanReportSQLResV2,
  IAuditResult
} from '@actiontech/shared/lib/api/sqle/service/common';
import AuditResultMessage from '../../../../components/AuditResultMessage';
import ResultIconRender from '../../../../components/AuditResultMessage/ResultIconRender';
import { t } from '../../../../locale';
import { SQLRenderer } from '@actiontech/shared';

export type DetailReportListParamType =
  PageInfoWithoutIndexAndSize<IGetAuditPlanReportsSQLsParams>;

export const DetailReportListAction = (
  onClickAnalyze: (record: IAuditPlanReportSQLResV2) => void
): {
  buttons: ActiontechTableActionMeta<IAuditPlanReportSQLResV2>[];
} => {
  return {
    buttons: [
      {
        text: t('auditPlan.report.table.analyze'),
        key: 'skip-analyze',
        buttonProps: (record) => {
          return {
            onClick: (event) => {
              event?.nativeEvent.stopImmediatePropagation();
              onClickAnalyze(record as IAuditPlanReportSQLResV2);
            }
          };
        }
      }
    ]
  };
};

export const DetailReportListColumn: () => ActiontechTableColumn<
  IAuditPlanReportSQLResV2,
  DetailReportListParamType
> = () => {
  return [
    {
      dataIndex: 'audit_plan_report_sql',
      title: () => t('auditPlan.report.table.sql'),
      render: (sql) => {
        if (!sql) return null;
        return (
          <div style={{ maxWidth: '500px' }}>
            <SQLRenderer showCopyIcon sql={sql} />
          </div>
        );
      }
    },
    {
      dataIndex: 'audit_plan_report_sql_audit_result',
      title: () => t('auditPlan.report.table.result'),
      render: (result: IAuditResult[]) => {
        return result?.length > 1 ? (
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
        );
      }
    }
  ];
};
