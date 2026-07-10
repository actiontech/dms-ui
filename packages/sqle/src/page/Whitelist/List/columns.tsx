import { t } from '../../../locale';
import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import { BasicTypographyEllipsis } from '@actiontech/shared';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { IAuditWhitelistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { IGetAuditWhitelistV1Params } from '@actiontech/shared/lib/api/sqle/service/audit_whitelist/index.d';
import {
  MatchModeDisplay,
  RuleScopeDisplay
} from '../../../components/RuleException';
import { auditWhitelistRecordToDisplayRecord } from '../utils';

/** Extended row type for audit whitelist list rows */
export type AuditWhitelistTableRow = IAuditWhitelistResV1 &
  Record<string, unknown>;

export type WhitelistTableFilterParamType = Record<string, never>;

export const WhitelistColumn = (): ActiontechTableColumn<
  AuditWhitelistTableRow,
  IGetAuditWhitelistV1Params
> => [
  {
    dataIndex: 'type',
    title: () => t('ruleException.table.matchMode'),
    className: 'ellipsis-column-width',
    render: (_value, record) => (
      <MatchModeDisplay
        record={auditWhitelistRecordToDisplayRecord(
          record as IAuditWhitelistResV1
        )}
      />
    )
  },
  {
    dataIndex: 'rule_scope_mode',
    title: () => t('ruleException.table.ruleScope'),
    render: (_value, record) => (
      <RuleScopeDisplay
        record={auditWhitelistRecordToDisplayRecord(
          record as IAuditWhitelistResV1
        )}
        modeOnly
      />
    )
  },
  {
    dataIndex: 'desc',
    title: () => t('ruleException.table.reason'),
    className: 'ellipsis-column-width',
    render: (_value, record) => {
      const desc = record.desc;
      if (!desc) return '-';
      return <BasicTypographyEllipsis textCont={String(desc)} />;
    }
  },
  {
    dataIndex: 'created_by',
    title: () => t('ruleException.table.createdBy'),
    render: (_value, record) => {
      const extended = record as AuditWhitelistTableRow;
      return String(extended.created_by ?? '-');
    }
  },
  {
    dataIndex: 'created_at',
    title: () => t('ruleException.table.createdAt'),
    render: (_value, record) => {
      const extended = record as AuditWhitelistTableRow;
      return formatTime(extended.created_at as string | undefined, '-');
    }
  },
  {
    dataIndex: 'matched_count',
    title: () => t('whitelist.table.matchCount')
  },
  {
    dataIndex: 'last_match_time',
    title: () => t('sqlManagementException.table.lastMatchedTime'),
    render: (value) => {
      return formatTime(value as string | undefined, '-');
    }
  }
];
