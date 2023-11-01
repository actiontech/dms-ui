import {
  ActiontechTableColumn,
  ActiontechTableFilterMeta,
  ActiontechTableFilterMetaValue,
  PageInfoWithoutIndexAndSize
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IGetSQLAuditRecordsV1Params } from '@actiontech/shared/lib/api/sqle/service/sql_audit_record/index.d';
import { ISQLAuditRecord } from '@actiontech/shared/lib/api/sqle/service/common';
import { t } from '../../../locale';
import { floatRound, floatToPercent } from '@actiontech/shared/lib/utils/Math';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { BasicToolTips } from '@actiontech/shared';
import { Link } from 'react-router-dom';

export type SqlAuditListTableFilterParamType = PageInfoWithoutIndexAndSize<
  IGetSQLAuditRecordsV1Params,
  'project_name'
>;

export const ExtraFilterMeta: () => ActiontechTableFilterMeta<
  ISQLAuditRecord & {
    instance_name?: string;
    auditTime?: string;
  },
  SqlAuditListTableFilterParamType
> = () => {
  return new Map<
    keyof (ISQLAuditRecord & {
      instance_name?: string;
      auditTime?: string;
    }),
    ActiontechTableFilterMetaValue<SqlAuditListTableFilterParamType>
  >([
    [
      'instance_name',
      {
        filterCustomType: 'select',
        filterKey: 'filter_instance_name',
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
  projectID: string
) => ActiontechTableColumn<
  ISQLAuditRecord,
  SqlAuditListTableFilterParamType,
  'instance' | 'score' | 'audit_pass_rate'
> = (projectID) => {
  return [
    {
      dataIndex: 'sql_audit_record_id',
      title: () => t('sqlAudit.list.columns.auditID'),
      render: (id: string) => {
        if (!id) {
          return '-';
        }

        return (
          <Link to={`project/${projectID}/sqlAudit/detail/${id}`}>{id}</Link>
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
          <BasicToolTips
            title={`${record.instance?.db_host}:${record.instance?.db_port}`}
          >
            {record.task?.instance_name}
          </BasicToolTips>
        ) : (
          record.task?.instance_name
        );
      },
      width: 200
    },
    {
      dataIndex: 'sql_audit_status',
      title: () => t('sqlAudit.list.columns.auditStatus')
    },
    // ???
    {
      dataIndex: 'tags',
      title: () => t('sqlAudit.list.columns.businessTag')
    },
    // ???
    {
      dataIndex: 'score',
      title: () => t('sqlAudit.list.columns.auditRating'),
      render: (_, record) => {
        const score = record.task?.score;
        return typeof score === 'number' ? floatRound(score) : '-';
      },
      width: 100
    },
    {
      dataIndex: 'audit_pass_rate',
      title: () => t('sqlAudit.list.columns.auditPassRate'),
      render: (_, record) => {
        const rate = record.task?.pass_rate;
        return typeof rate === 'number' ? floatToPercent(rate) : '-';
      },
      width: 160
    },
    {
      dataIndex: 'creator',
      title: () => t('sqlAudit.list.columns.createUser')
    },
    {
      dataIndex: 'created_at',
      title: () => t('sqlAudit.list.columns.auditTime'),
      render(time: string) {
        return formatTime(time, '-');
      },
      width: 200
    }
  ];
};

export default SqlAuditListColumn;
