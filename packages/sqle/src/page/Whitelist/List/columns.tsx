import { t } from '../../../locale';
import {
  ActiontechTableColumn,
  PageInfoWithoutIndexAndSize
} from '@actiontech/shared/lib/components/ActiontechTable';
import { WhitelistMatchTypeLabel } from '../index.data';
import {
  IAuditWhitelistResV1,
  ISQLRuleExceptionResV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import { CreateAuditWhitelistReqV1MatchTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { SQLRenderer, BasicTypographyEllipsis } from '@actiontech/shared';
import {
  IGetAuditWhitelistV1Params,
  IGetSQLRuleExceptionV1Params
} from '@actiontech/shared/lib/api/sqle/service/audit_whitelist/index.d';
import { formatTime } from '@actiontech/shared/lib/utils/Common';

export type WhitelistTableFilterParamType = PageInfoWithoutIndexAndSize<
  IGetAuditWhitelistV1Params & {
    page_index: number;
    page_size: number;
  },
  'project_name'
>;

export type SQLRuleExceptionTableFilterParamType = PageInfoWithoutIndexAndSize<
  IGetSQLRuleExceptionV1Params & {
    page_index: number;
    page_size: number;
  },
  'project_name'
>;

export const WhitelistColumn = (): ActiontechTableColumn<
  IAuditWhitelistResV1,
  WhitelistTableFilterParamType
> => {
  return [
    {
      dataIndex: 'value',
      title: () => t('whitelist.table.sql'),
      className: 'ellipsis-column-width',
      render: (sql) => {
        if (!!sql) {
          return (
            <SQLRenderer.Snippet
              sql={sql}
              rows={2}
              showCopyIcon
              cuttingLength={200}
            />
          );
        }
        return null;
      }
    },
    {
      dataIndex: 'desc',
      title: () => t('whitelist.table.desc'),
      className: 'ellipsis-column-width',
      render: (desc) => {
        if (!desc) return '-';
        return <BasicTypographyEllipsis textCont={desc} />;
      }
    },
    {
      dataIndex: 'match_type',
      title: () => t('whitelist.table.matchType'),
      render: (matchType) => {
        return matchType
          ? WhitelistMatchTypeLabel[
              matchType as CreateAuditWhitelistReqV1MatchTypeEnum
            ]
          : null;
      },
      filterCustomType: 'select',
      filterKey: 'filter_match_type'
    },
    {
      dataIndex: 'matched_count',
      title: () => t('whitelist.table.matchCount')
    },
    {
      dataIndex: 'last_match_time',
      title: () => t('sqlManagementException.table.lastMatchedTime'),
      render: (value) => {
        return formatTime(value, '-');
      }
    }
  ];
};

const renderEmptyValue = (value?: string | number) => {
  if (value === 0) {
    return value;
  }
  return value || '-';
};

const getRuleExceptionMatchInfo = (record: ISQLRuleExceptionResV1) => {
  return (
    record.match_info ??
    record.hit_info ??
    record.matched_count ??
    record.hit_count ??
    record.last_match_time
  );
};

export const SQLRuleExceptionColumn = (): ActiontechTableColumn<
  ISQLRuleExceptionResV1,
  SQLRuleExceptionTableFilterParamType
> => {
  return [
    {
      dataIndex: 'project_name',
      title: () => t('whitelist.ruleException.project'),
      render: (projectName, record) => {
        return renderEmptyValue(projectName ?? record.project_id);
      }
    },
    {
      dataIndex: 'instance_name',
      title: () => t('whitelist.ruleException.instance'),
      filterCustomType: 'select',
      filterKey: 'filter_instance_id',
      render: (instanceName, record) => {
        return renderEmptyValue(instanceName ?? record.instance_id);
      }
    },
    {
      dataIndex: 'sql_fingerprint',
      title: () => t('whitelist.ruleException.sqlFingerprint'),
      className: 'ellipsis-column-width',
      filterCustomType: 'search-input',
      filterKey: 'filter_sql_fingerprint',
      render: (sqlFingerprint) => {
        if (!!sqlFingerprint) {
          return (
            <SQLRenderer.Snippet
              sql={sqlFingerprint}
              rows={2}
              showCopyIcon
              cuttingLength={200}
            />
          );
        }
        return '-';
      }
    },
    {
      dataIndex: 'rule_name',
      title: () => t('whitelist.ruleException.ruleName'),
      className: 'ellipsis-column-width',
      filterCustomType: 'input',
      filterKey: 'filter_rule_name',
      render: (ruleName) => {
        return ruleName ? <BasicTypographyEllipsis textCont={ruleName} /> : '-';
      }
    },
    {
      dataIndex: 'rule_desc',
      title: () => t('whitelist.ruleException.ruleDesc'),
      className: 'ellipsis-column-width',
      render: (ruleDesc) => {
        return ruleDesc ? <BasicTypographyEllipsis textCont={ruleDesc} /> : '-';
      }
    },
    {
      dataIndex: 'rule_level',
      title: () => t('whitelist.ruleException.ruleLevel'),
      render: renderEmptyValue
    },
    {
      dataIndex: 'created_by',
      title: () => t('whitelist.ruleException.createdBy'),
      filterCustomType: 'select',
      filterKey: 'filter_created_by',
      render: renderEmptyValue
    },
    {
      dataIndex: 'created_at',
      title: () => t('whitelist.ruleException.createdAt'),
      filterCustomType: 'date-range',
      filterKey: ['filter_created_time_from', 'filter_created_time_to'],
      render: (createdAt) => formatTime(createdAt, '-')
    },
    {
      dataIndex: 'reason',
      title: () => t('whitelist.ruleException.reason'),
      className: 'ellipsis-column-width',
      render: (reason) => {
        return reason ? <BasicTypographyEllipsis textCont={reason} /> : '-';
      }
    },
    {
      dataIndex: 'match_info',
      title: () => t('whitelist.ruleException.matchInfo'),
      render: (_, record) => {
        const matchInfo = getRuleExceptionMatchInfo(record);
        if (record.last_match_time) {
          return t('whitelist.ruleException.matchInfoWithTime', {
            count: record.matched_count ?? record.hit_count ?? '-',
            time: formatTime(record.last_match_time, '-')
          });
        }
        return renderEmptyValue(matchInfo);
      }
    }
  ];
};
