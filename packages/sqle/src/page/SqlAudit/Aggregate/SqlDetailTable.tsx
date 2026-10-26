import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from 'antd';
import {
  ActiontechTable,
  ActiontechTableColumn
} from '@actiontech/shared/lib/components/ActiontechTable';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { getAuditLevelDisplayLabel } from '../../../components/AuditResultMessage/errorPriorityDisplay';
import type { AggregateSqlItem } from './index.type';

type SqlDetailTableProps = {
  dataSource: AggregateSqlItem[];
  total: number;
  pageIndex: number;
  pageSize: number;
  loading: boolean;
  errorMessage?: string | null;
  onPageChange: (pageIndex: number, pageSize: number) => void;
};

const truncate = (text: string, max = 120) => {
  if (text.length <= max) {
    return text;
  }
  return `${text.slice(0, max)}…`;
};

const SqlDetailTable = ({
  dataSource,
  total,
  pageIndex,
  pageSize,
  loading,
  errorMessage,
  onPageChange
}: SqlDetailTableProps) => {
  const { t } = useTranslation();

  const columns: ActiontechTableColumn<AggregateSqlItem> = useMemo(
    () => [
      {
        dataIndex: 'created_at',
        title: () => t('sqlAudit.aggregate.sqls.columns.createdAt'),
        width: 170,
        render: (value) => formatTime(value as string, '-')
      },
      {
        dataIndex: 'sql_audit_record_id',
        title: () => t('sqlAudit.aggregate.sqls.columns.recordId'),
        width: 160,
        render: (id) => (id ? String(id) : '-')
      },
      {
        dataIndex: 'task_id',
        title: () => t('sqlAudit.aggregate.sqls.columns.taskId'),
        width: 90,
        render: (id) => (id !== undefined && id !== null ? String(id) : '-')
      },
      {
        dataIndex: 'creator',
        title: () => t('sqlAudit.aggregate.sqls.columns.creator'),
        width: 100,
        render: (v) => (v ? String(v) : '-')
      },
      {
        dataIndex: 'instance_name',
        title: () => t('sqlAudit.aggregate.sqls.columns.instanceName'),
        width: 140,
        render: (name) =>
          name
            ? String(name)
            : t('sqlAudit.aggregate.sqls.columns.offlineInstance')
      },
      {
        dataIndex: 'db_type',
        title: () => t('sqlAudit.aggregate.sqls.columns.dbType'),
        width: 100,
        render: (v) => (v ? String(v) : '-')
      },
      {
        dataIndex: 'schema',
        title: () => t('sqlAudit.aggregate.sqls.columns.schema'),
        width: 120,
        render: (v) => (v ? String(v) : '-')
      },
      {
        dataIndex: 'sql_source',
        title: () => t('sqlAudit.aggregate.sqls.columns.sqlSource'),
        width: 110,
        render: (source) => {
          if (!source) {
            return '-';
          }
          const key = `sqlAudit.detail.sourceHeader.sqlSourceEnum.${source}`;
          const label = t(key);
          return label === key ? String(source) : label;
        }
      },
      {
        dataIndex: 'source_file',
        title: () => t('sqlAudit.aggregate.sqls.columns.sourceFile'),
        width: 160,
        render: (_, record) => {
          const file = record.source_file?.trim();
          const line = record.start_line;
          if (!file && !line) {
            return '-';
          }
          if (file && line) {
            return `${file}:${line}`;
          }
          return file || String(line);
        }
      },
      {
        dataIndex: 'exec_sql',
        title: () => t('sqlAudit.aggregate.sqls.columns.execSql'),
        width: 280,
        render: (sql) => {
          const text = (sql as string)?.trim() || '';
          if (!text) {
            return '-';
          }
          return (
            <Typography.Paragraph
              ellipsis={{ rows: 2, tooltip: text }}
              style={{ marginBottom: 0, maxWidth: 280 }}
            >
              {truncate(text)}
            </Typography.Paragraph>
          );
        }
      },
      {
        dataIndex: 'audit_level',
        title: () => t('sqlAudit.aggregate.sqls.columns.auditLevel'),
        width: 110,
        render: (_, record) => {
          if (!record.audit_level) {
            return t('components.auditResultMessage.auditPassed');
          }
          return getAuditLevelDisplayLabel(
            t,
            record.audit_level,
            record.error_priority
          );
        }
      },
      {
        dataIndex: 'audit_results',
        title: () => t('sqlAudit.aggregate.sqls.columns.auditResult'),
        width: 220,
        render: (_, record) => {
          const results = record.audit_results ?? [];
          if (!results.length) {
            return t('components.auditResultMessage.auditPassed');
          }
          const text = results
            .map((item) => {
              const levelLabel = item.level
                ? getAuditLevelDisplayLabel(t, item.level, item.error_priority)
                : '';
              const msg = item.message?.trim() || item.rule_name || '';
              return [levelLabel, msg].filter(Boolean).join(' · ');
            })
            .join('；');
          return (
            <Typography.Paragraph
              ellipsis={{ rows: 2, tooltip: text }}
              style={{ marginBottom: 0, maxWidth: 220 }}
            >
              {truncate(text, 160)}
            </Typography.Paragraph>
          );
        }
      },
      {
        dataIndex: 'rule_hit_count',
        title: () => t('sqlAudit.aggregate.sqls.columns.ruleHitCount'),
        width: 100,
        render: (count) =>
          typeof count === 'number' && Number.isFinite(count) ? count : 0
      }
    ],
    [t]
  );

  return (
    <ActiontechTable
      data-testid="sql-audit-aggregate-sqls-table"
      rowKey={(record) =>
        `${record.sql_audit_record_id ?? ''}-${record.number ?? ''}-${
          record.task_id ?? ''
        }`
      }
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      errorMessage={errorMessage || undefined}
      pagination={{
        total,
        current: pageIndex,
        pageSize,
        onChange: (page, size) => {
          onPageChange(page, size || pageSize);
        }
      }}
    />
  );
};

export default SqlDetailTable;
