import { t } from '../../../locale';
import { ActiontechTableColumn } from '@actiontech/dms-kit/es/components/ActiontechTable';
import { formatTime } from '@actiontech/dms-kit';
import { Typography } from 'antd';
import { IRiskAuditPlan } from '@actiontech/shared/lib/api/sqle/service/common';
import { TableColumnWithIconStyleWrapper } from '@actiontech/dms-kit';
import { ProfileFilled } from '@actiontech/icons';
import { TypedLink } from '@actiontech/shared';

// todo 智能扫描重构后废置组件，暂不处理 TypedLink 替换 path
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
            <TypedLink
              data-testid="report-time"
              to={`/sqle/project/${projectID}/audit-plan/detail/${record.audit_plan_name}/report/${record.audit_plan_report_id}`}
            >
              {text}
            </TypedLink>
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
          <TypedLink
            to={`/sqle/project/${projectID}/audit-plan/detail/${name}`}
          >
            {name}
          </TypedLink>
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
