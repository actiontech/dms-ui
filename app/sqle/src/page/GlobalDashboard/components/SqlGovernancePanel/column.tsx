import { ActiontechTableColumn } from '@actiontech/dms-kit/es/components/ActiontechTable';
import { IGlobalSqlManageTaskItemV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { BasicTypographyEllipsis, SQLRenderer } from '@actiontech/shared';
import { BasicTag, BasicTagProps } from '@actiontech/dms-kit';
import { formatTime } from '@actiontech/dms-kit';
import { TableColumnWithIconStyleWrapper } from '@actiontech/dms-kit';
import { FlagFilled } from '@actiontech/icons';
import { t } from '../../../../locale';
import { GlobalSqlManageTaskItemV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

const getStatusTagLabel = (status: GlobalSqlManageTaskItemV2StatusEnum) => {
  if (status === 'unhandled') {
    return t('globalDashboard.sql.taskStatus.unhandled');
  }
  if (status === 'solved') {
    return t('globalDashboard.sql.taskStatus.solved');
  }
};

const getStatusTagColor = (
  status: GlobalSqlManageTaskItemV2StatusEnum
): BasicTagProps['color'] => {
  if (status === 'unhandled') {
    return 'geekblue';
  }
  if (status === 'manual_audited') {
    return 'blue';
  }
  if (status === 'sent') {
    return 'geekblue';
  }
  if (status === 'solved') {
    return 'green';
  }
  if (status === 'ignored') {
    return 'gray';
  }
};

export const sqlGovernancePanelColumns = (): ActiontechTableColumn<
  IGlobalSqlManageTaskItemV2,
  Record<string, never>,
  'action'
> => {
  return [
    {
      dataIndex: 'sql_fingerprint',
      className: 'ellipsis-column-width',
      title: t('globalDashboard.sql.column.sqlFingerprint'),
      render: (sql_fingerprint, record) => {
        if (!sql_fingerprint) {
          return '-';
        }
        const hasMetrics = record.avg_time != null || record.count != null;
        return (
          <div className="global-dashboard-sql-fingerprint-cell">
            <SQLRenderer.Snippet
              sql={sql_fingerprint}
              rows={2}
              showCopyIcon
              cuttingLength={200}
            />
            {hasMetrics ? (
              <div className="global-dashboard-sql-metrics">
                {record.avg_time != null && (
                  <span>
                    {t('globalDashboard.sql.column.avgTime', {
                      value: record.avg_time
                    })}
                  </span>
                )}
                {record.avg_time != null && record.count != null ? (
                  <span className="sql-metrics-sep"> · </span>
                ) : null}
                {record.count != null && (
                  <span>
                    {t('globalDashboard.sql.column.execCount', {
                      value: record.count
                    })}
                  </span>
                )}
              </div>
            ) : null}
          </div>
        );
      }
    },
    {
      dataIndex: 'suggestion',
      className: 'ellipsis-column-width',
      title: t('globalDashboard.sql.column.suggestion'),
      render: (suggestion) => {
        if (!suggestion) {
          return '-';
        }
        return (
          <BasicTypographyEllipsis copyable={false} textCont={suggestion} />
        );
      }
    },
    {
      dataIndex: 'source',
      title: t('globalDashboard.sql.column.source'),
      render: (source) => source ?? '-'
    },
    {
      dataIndex: 'project_name',
      title: t('globalDashboard.sql.column.project'),
      render: (projectName) => {
        if (!projectName) {
          return '-';
        }
        return (
          <TableColumnWithIconStyleWrapper>
            <FlagFilled width={14} height={14} />
            {projectName}
          </TableColumnWithIconStyleWrapper>
        );
      }
    },
    {
      dataIndex: 'instance_name',
      title: t('globalDashboard.sql.column.instance'),
      render: (instanceName) => {
        if (!instanceName) {
          return '-';
        }
        return instanceName;
      }
    },
    {
      dataIndex: 'last_seen_at',
      title: t('globalDashboard.sql.column.lastSeenAt'),
      render: (last_seen_at) => {
        return formatTime(last_seen_at, '-');
      }
    },
    {
      dataIndex: 'status',
      title: t('globalDashboard.sql.column.status'),
      render: (status) =>
        status ? (
          <BasicTag color={getStatusTagColor(status)}>
            {getStatusTagLabel(status)}
          </BasicTag>
        ) : (
          '-'
        )
    }
  ];
};
