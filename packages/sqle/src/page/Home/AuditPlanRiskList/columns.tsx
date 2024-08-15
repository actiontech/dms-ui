import { t } from '../../../locale';
import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import { IRiskAuditPlan } from '@actiontech/shared/lib/api/sqle/service/common';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { ProfileFilled } from '@actiontech/icons';

export const AuditPlanRiskColumns: (
  projectID: string
) => ActiontechTableColumn<IRiskAuditPlan> = (projectID: string) => {
  const column: ActiontechTableColumn<IRiskAuditPlan> = [
    {
      dataIndex: 'audit_plan_report_timestamp',
      title: t('dashboard.auditPlanRisk.tableColumn.name'),
      render(time, record) {
        const text = `${t('auditPlan.record.generateTime')} ${formatTime(
          time,
          '-'
        )}`;
        return (
          <TableColumnWithIconStyleWrapper>
            <ProfileFilled />
            <Link
              data-testid="report-time"
              to={`/sqle/project/${projectID}/audit-plan/detail/${record.audit_plan_name}/report/${record.audit_plan_report_id}`}
            >
              {text}
            </Link>
          </TableColumnWithIconStyleWrapper>
        );
      }
    },
    {
      dataIndex: 'audit_plan_name',
      title: t('dashboard.auditPlanRisk.tableColumn.source'),
      width: '20%',
      render(name) {
        if (!name) {
          return '-';
        }

        return (
          <Link to={`/sqle/project/${projectID}/audit-plan/detail/${name}`}>
            {name}
          </Link>
        );
      }
    },
    {
      width: '10%',
      dataIndex: 'risk_sql_count',
      title: t('dashboard.auditPlanRisk.tableColumn.count'),
      render(count) {
        return <Typography.Text strong>{count}</Typography.Text>;
      }
    },
    {
      dataIndex: 'audit_plan_report_timestamp',
      title: t('dashboard.auditPlanRisk.tableColumn.time'),
      render(time) {
        return formatTime(time, '-');
      }
    }
  ];

  return column;
};
