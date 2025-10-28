import { t } from '../../../../locale';
import { IGlobalSqlManage } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  SQLRenderer,
  BasicTypographyEllipsis,
  TypedLink,
  ActiontechTableActionMeta,
  ActiontechTableColumn
} from '@actiontech/shared';
import StatusTag from '../../../SqlManagement/component/SQLEEIndex/StatusTag';
import { SqlManageStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { formatTime } from '@actiontech/shared';
import { ProjectPriorityDictionary } from '../../index.data';
import { ProjectV2ProjectPriorityEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { Typography } from 'antd';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

export const PendingSqlListColumn: (
  onUpdateFilterValue: (projectId?: string, instanceId?: string) => void
) => ActiontechTableColumn<IGlobalSqlManage> = (onUpdateFilterValue) => {
  return [
    {
      dataIndex: 'sql',
      className: 'ellipsis-column-width',
      title: 'SQL',
      width: 350,
      render: (sql) => {
        if (!sql) return null;
        return (
          <SQLRenderer.Snippet
            tooltip={false}
            sql={sql}
            rows={2}
            showCopyIcon
            cuttingLength={200}
          />
        );
      }
    },
    {
      dataIndex: 'problem_descriptions',
      className: 'ellipsis-column-width',
      title: t('globalDashboard.pendingSql.column.desc'),
      width: 350,
      render: (descriptions) => {
        if (!descriptions || !descriptions.length) return '-';
        return <BasicTypographyEllipsis textCont={descriptions?.join(';')} />;
      }
    },
    {
      dataIndex: 'status',
      title: t('globalDashboard.pendingSql.column.status'),
      className: 'audit-status',
      render: (status) => {
        if (!status) return '-';
        return <StatusTag status={status as unknown as SqlManageStatusEnum} />;
      }
    },
    {
      dataIndex: 'source',
      title: t('globalDashboard.pendingSql.column.source'),
      render: (source, record) => {
        if (
          !!source &&
          !!source.sql_source_ids &&
          source.sql_source_ids.length > 0 &&
          !!source.sql_source_type
        ) {
          if (source.sql_source_type === 'sql_audit_record') {
            return (
              <TypedLink
                target="_blank"
                to={ROUTE_PATHS.SQLE.SQL_AUDIT.index}
                params={{ projectID: record.project_uid ?? '' }}
                queries={{
                  SQLAuditRecordID: source.sql_source_ids.join(',')
                }}
              >
                {source.sql_source_desc}
              </TypedLink>
            );
          }
          return (
            <TypedLink
              target="_blank"
              to={ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.detail}
              params={{
                projectID: record.project_uid ?? '',
                id: source.sql_source_ids[0]
              }}
            >
              {source.sql_source_desc ?? source.sql_source_type}
            </TypedLink>
          );
        }
        return '-';
      }
    },
    {
      dataIndex: 'first_appear_timestamp',
      title: t('globalDashboard.pendingSql.column.firstAppearTime'),
      render: (value) => {
        return formatTime(value, '-');
      }
    },
    {
      dataIndex: 'instance_name',
      title: t('globalDashboard.pendingSql.column.instance'),
      render: (instanceName, record) => {
        return (
          <Typography.Link
            onClick={() =>
              onUpdateFilterValue(record.project_uid, record.instance_id)
            }
          >
            {instanceName}
          </Typography.Link>
        );
      }
    },
    {
      dataIndex: 'project_name',
      title: t('globalDashboard.pendingSql.column.project'),
      render: (projectName, record) => {
        return (
          <Typography.Link
            onClick={() => onUpdateFilterValue(record.project_uid)}
          >
            {projectName}
          </Typography.Link>
        );
      }
    },
    {
      dataIndex: 'project_priority',
      title: t('globalDashboard.pendingSql.column.projectPriority'),
      render: (priority) => {
        return priority
          ? ProjectPriorityDictionary[
              priority as unknown as ProjectV2ProjectPriorityEnum
            ]
          : '-';
      }
    }
  ];
};

export const PendingSqlListAction: (
  onCheckDetail: (record?: IGlobalSqlManage) => void
) => {
  buttons: ActiontechTableActionMeta<IGlobalSqlManage>[];
} = (onCheckDetail) => {
  return {
    buttons: [
      {
        key: 'check-detail-button',
        text: t('globalDashboard.pendingSql.column.detail'),
        buttonProps: (record) => ({
          onClick: () => onCheckDetail(record)
        })
      }
    ]
  };
};
