import {
  ActiontechTableColumn,
  PageInfoWithoutIndexAndSize
} from '@actiontech/shared/lib/components/ActiontechTable';
import { ISqlDEVRecord } from '@actiontech/shared/lib/api/sqle/service/common';
import { IGetSqlDEVRecordListParams } from '@actiontech/shared/lib/api/sqle/service/SqlDEVRecord/index.d';
import { t } from '../../../locale';
import ResultIconRender from '../../../components/AuditResultMessage/ResultIconRender';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { AvatarCom, SQLRenderer } from '@actiontech/shared';

export type PluginAuditListTableFilterParamType = PageInfoWithoutIndexAndSize<
  IGetSqlDEVRecordListParams,
  'project_name'
>;

export const PluginAuditListColumns: (
  onOpenDrawer: (record: ISqlDEVRecord) => void
) => ActiontechTableColumn<ISqlDEVRecord, IGetSqlDEVRecordListParams> = (
  onOpenDrawer
) => {
  return [
    {
      dataIndex: 'sql_fingerprint',
      className: 'ellipsis-column-width',
      title: () => t('pluginAudit.table.sqlFingerprint'),
      render: (sql_fingerprint, record) => {
        if (!sql_fingerprint) return null;
        return (
          <SQLRenderer.Snippet
            onClick={() => onOpenDrawer(record)}
            sql={sql_fingerprint}
            rows={2}
            showCopyIcon
            cuttingLength={200}
          />
        );
      }
    },
    {
      dataIndex: 'sql',
      className: 'ellipsis-column-width',
      title: () => t('pluginAudit.table.sql'),
      render: (sql, record) => {
        if (!sql) return null;
        return (
          <SQLRenderer.Snippet
            onClick={() => onOpenDrawer(record)}
            sql={sql}
            rows={2}
            tooltip={false}
            showCopyIcon
            cuttingLength={200}
          />
        );
      }
    },
    {
      dataIndex: 'instance_name',
      title: () => t('pluginAudit.table.source'),
      filterCustomType: 'select',
      filterKey: 'filter_instance_name',
      render: (instance_name) => {
        return instance_name || '-';
      }
    },
    {
      dataIndex: 'schema_name',
      title: () => t('pluginAudit.table.schema')
    },
    {
      dataIndex: 'audit_result',
      title: () => t('pluginAudit.table.result'),
      width: 300,
      render: (result = [], record) => {
        return (
          <div
            onClick={() => onOpenDrawer(record)}
            className="audit-result-wrapper"
          >
            <ResultIconRender
              iconLevels={result.map((item) => {
                return item.level ?? '';
              })}
            />
          </div>
        );
      }
    },
    {
      dataIndex: 'fp_count',
      title: () => t('pluginAudit.table.count')
    },
    {
      dataIndex: 'first_appear_timestamp',
      title: () => t('pluginAudit.table.firstAppearTime'),
      render: (value) => {
        return formatTime(value, '-');
      }
    },
    {
      dataIndex: 'last_receive_timestamp',
      title: () => t('pluginAudit.table.lastReceiveTime'),
      filterCustomType: 'date-range',
      filterKey: [
        'filter_last_receive_time_from',
        'filter_last_receive_time_to'
      ],
      render: (value) => {
        return formatTime(value, '-');
      }
    },
    {
      dataIndex: 'creator',
      title: () => t('pluginAudit.table.creator'),
      filterCustomType: 'select',
      filterKey: 'filter_creator',
      render: (creator: ISqlDEVRecord['creator']) => {
        return creator ? <AvatarCom name={creator} /> : '-';
      }
    }
  ];
};
