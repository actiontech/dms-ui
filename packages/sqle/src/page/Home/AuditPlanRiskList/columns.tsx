import { t } from '../../../locale';
import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { Typography } from 'antd5';
import { DashboardNameStyleWrapper } from '../CommonTable/style';
import { IconAuditTaskName } from '../../../icon/Dashboard';
import { Link } from 'react-router-dom';
import { IRiskAuditPlan } from '@actiontech/shared/lib/api/sqle/service/common';

export const AuditPlanRiskColumns: (
  projectID: string
) => ActiontechTableColumn<IRiskAuditPlan> = (projectID: string) => {
  const column: ActiontechTableColumn<IRiskAuditPlan> = [
    {
      dataIndex: 'audit_plan_report_timestamp',
      title: t('dashboard.auditPlanRisk.tableColumn.name'),
      render(time: string, record: IRiskAuditPlan) {
        const text = `${t('auditPlan.record.generateTime')} ${formatTime(
          time,
          '-'
        )}`;
        return (
          <DashboardNameStyleWrapper>
            <IconAuditTaskName />
            <Link
              data-testid="report-time"
              to={`/sqle/project/${projectID}/auditPlan/detail/${record.audit_plan_name}/report/${record.audit_plan_report_id}`}
            >
              {text}
            </Link>
          </DashboardNameStyleWrapper>
        );
      }
    },
    {
      dataIndex: 'audit_plan_name',
      title: t('dashboard.auditPlanRisk.tableColumn.source'),
      width: '20%',
      render(name: string) {
        if (!name) {
          return '-';
        }

        return (
          <Link to={`/sqle/project/${projectID}/auditPlan/detail/${name}`}>
            {name}
          </Link>
        );
      }
    },
    {
      width: '10%',
      dataIndex: 'risk_sql_count',
      title: t('dashboard.auditPlanRisk.tableColumn.count'),
      render(count: number) {
        return <Typography.Text strong>{count}</Typography.Text>;
      }
    },
    {
      dataIndex: 'audit_plan_report_timestamp',
      title: t('dashboard.auditPlanRisk.tableColumn.time'),
      render(time: string) {
        return formatTime(time, '-');
      }
    }
  ];

  return column;
};
