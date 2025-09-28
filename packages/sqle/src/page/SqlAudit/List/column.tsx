import {
  ActiontechTableColumn,
  ActiontechTableFilterMeta,
  ActiontechTableFilterMetaValue,
  PageInfoWithoutIndexAndSize
} from '@actiontech/dms-kit/es/components/ActiontechTable';
import { IGetSQLAuditRecordsV1Params } from '@actiontech/shared/lib/api/sqle/service/sql_audit_record/index.d';
import { ISQLAuditRecord } from '@actiontech/shared/lib/api/sqle/service/common';
import { t } from '../../../locale';
import { floatRound, floatToPercent } from '@actiontech/dms-kit';
import { formatTime } from '@actiontech/dms-kit';
import { BasicToolTip } from '@actiontech/dms-kit';
import { TypedLink } from '@actiontech/shared';
import SqlAuditStatusTag from './component/SqlAuditStatusTag';
import { getSQLAuditRecordsV1FilterSqlAuditStatusEnum } from '@actiontech/shared/lib/api/sqle/service/sql_audit_record/index.enum';
import SqlAuditTags from './component/SqlAuditTags';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import { ISQLAuditRecordExtraParams } from './index.type';
export type SqlAuditListTableFilterParamType = PageInfoWithoutIndexAndSize<
  IGetSQLAuditRecordsV1Params,
  'project_name'
>;
export const ExtraFilterMeta: () => ActiontechTableFilterMeta<
  ISQLAuditRecordExtraParams,
  SqlAuditListTableFilterParamType
> = () => {
  return new Map<
    keyof ISQLAuditRecordExtraParams,
    ActiontechTableFilterMetaValue<SqlAuditListTableFilterParamType>
  >([
    [
      'instance_name',
      {
        filterCustomType: 'select',
        filterKey: 'filter_instance_id',
        filterLabel: t('sqlAudit.list.filter.instanceName'),
        checked: false
      }
    ],
    [
      'auditTime',
      {
        filterCustomType: 'date-range',
        filterKey: ['filter_create_time_from', 'filter_create_time_to'],
        filterLabel: t('sqlAudit.list.filter.auditTime'),
        checked: false
      }
    ]
  ]);
};
const SqlAuditListColumn: (
  projectID: string,
  projectName: string,
  updateTags: (tags: string[], id: string) => Promise<void>
) => ActiontechTableColumn<
  ISQLAuditRecord,
  SqlAuditListTableFilterParamType,
  'instance' | 'score' | 'audit_pass_rate'
> = (projectID, projectName, updateTags) => {
  return [
    {
      dataIndex: 'sql_audit_record_id',
      title: () => t('sqlAudit.list.columns.auditID'),
      render: (id) => {
        if (!id) {
          return '-';
        }
        return (
          <TypedLink
            to={ROUTE_PATHS.SQLE.SQL_AUDIT.detail}
            params={{
              projectID,
              sql_audit_record_id: id
            }}
          >
            {id}
          </TypedLink>
        );
      },
      width: 200
    },
    {
      dataIndex: 'instance',
      title: () => t('sqlAudit.list.columns.instanceName'),
      render: (_, record) => {
        if (!record.task?.instance_name) {
          return '-';
        }
        return record.instance?.db_host && record.instance.db_port ? (
          <BasicToolTip
            title={`${record.instance?.db_host}:${record.instance?.db_port}`}
          >
            {record.task?.instance_name}
          </BasicToolTip>
        ) : (
          record.task?.instance_name
        );
      },
      width: 200
    },
    {
      dataIndex: 'sql_audit_status',
      title: () => t('sqlAudit.list.columns.auditStatus'),
      render: (sql_audit_status) => {
        if (!sql_audit_status) {
          return '-';
        }
        return (
          <span className="flex-display">
            <SqlAuditStatusTag
              status={
                sql_audit_status as getSQLAuditRecordsV1FilterSqlAuditStatusEnum
              }
            />
          </span>
        );
      }
    },
    {
      dataIndex: 'tags',
      title: () => t('sqlAudit.list.columns.businessTag'),
      render: (tags, record) => {
        return (
          <SqlAuditTags
            projectName={projectName}
            defaultTags={tags ?? []}
            updateTags={(tagsData) =>
              updateTags(tagsData, record.sql_audit_record_id ?? '')
            }
          />
        );
      }
    },
    {
      dataIndex: 'score',
      title: () => t('sqlAudit.list.columns.auditRating'),
      render: (_, record) => {
        const score = record.task?.score;
        return typeof score === 'number' ? floatRound(score) : '-';
      },
      width: 100,
      align: 'right'
    },
    {
      dataIndex: 'audit_pass_rate',
      title: () => t('sqlAudit.list.columns.auditPassRate'),
      render: (_, record) => {
        const rate = record.task?.pass_rate;
        return typeof rate === 'number' ? floatToPercent(rate) : '-';
      },
      width: 160,
      align: 'right'
    },
    {
      dataIndex: 'creator',
      title: () => t('sqlAudit.list.columns.createUser'),
      render: (creator) => {
        if (!creator) {
          return '-';
        }
        return creator;
      }
    },
    {
      dataIndex: 'created_at',
      title: () => t('sqlAudit.list.columns.auditTime'),
      render(time) {
        return formatTime(time, '-');
      },
      width: 200
    }
  ];
};
export default SqlAuditListColumn;
