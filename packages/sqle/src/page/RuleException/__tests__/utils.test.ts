import {
  CreateBlacklistReqV1TypeEnum,
  MatchConditionReqV1TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { buildRuleExceptionFromSqlManage, formatMatchMode } from '../utils';

describe('sqle/page/RuleException/utils', () => {
  it('buildRuleExceptionFromSqlManage omits empty match conditions', () => {
    expect(
      buildRuleExceptionFromSqlManage(
        { sql_fingerprint: 'select 1' },
        'rule_a',
        'remark',
        'MySQL'
      )
    ).toEqual({
      type: CreateBlacklistReqV1TypeEnum.fp_sql,
      content: 'select 1',
      match_conditions: [
        {
          type: MatchConditionReqV1TypeEnum.db_type,
          content: 'MySQL'
        }
      ],
      rule_scope: ['rule_a'],
      desc: 'remark'
    });
  });

  it('buildRuleExceptionFromSqlManage maps instance, source and db_type fields', () => {
    expect(
      buildRuleExceptionFromSqlManage(
        {
          sql_fingerprint: 'select * from t',
          instance_id: '123',
          db_type: 'MySQL',
          source: {
            sql_source_type: 'mysql_slow_log',
            sql_source_ids: ['100', '200']
          }
        },
        'rule_b'
      )
    ).toEqual({
      type: CreateBlacklistReqV1TypeEnum.fp_sql,
      content: 'select * from t',
      match_conditions: [
        {
          type: MatchConditionReqV1TypeEnum.instance,
          content: '123'
        },
        {
          type: MatchConditionReqV1TypeEnum.audit_task_type,
          content: 'mysql_slow_log'
        },
        {
          type: MatchConditionReqV1TypeEnum.audit_task_id,
          content: '100'
        },
        {
          type: MatchConditionReqV1TypeEnum.db_type,
          content: 'MySQL'
        }
      ],
      rule_scope: ['rule_b'],
      desc: undefined
    });
  });

  it('buildRuleExceptionFromSqlManage prefers explicit dbType over record db_type', () => {
    expect(
      buildRuleExceptionFromSqlManage(
        {
          sql_fingerprint: 'select 1',
          db_type: 'PostgreSQL'
        },
        'rule_c',
        undefined,
        'MySQL'
      )
    ).toEqual({
      type: CreateBlacklistReqV1TypeEnum.fp_sql,
      content: 'select 1',
      match_conditions: [
        {
          type: MatchConditionReqV1TypeEnum.db_type,
          content: 'MySQL'
        }
      ],
      rule_scope: ['rule_c'],
      desc: undefined
    });
  });

  it('formatMatchMode resolves audit_task_type from raw content when display is missing', () => {
    const rows = formatMatchMode(
      {
        type: CreateBlacklistReqV1TypeEnum.fp_sql,
        content: 'select 1',
        match_conditions: [
          {
            type: MatchConditionReqV1TypeEnum.audit_task_type,
            content: 'sql_audit_record'
          }
        ]
      },
      (type) => type ?? '-',
      {
        resolveAuditTaskTypeLabel: () => 'SQL审核'
      }
    );

    expect(rows).toEqual([
      {
        type: CreateBlacklistReqV1TypeEnum.fp_sql,
        typeLabel: CreateBlacklistReqV1TypeEnum.fp_sql,
        content: 'select 1'
      },
      {
        type: MatchConditionReqV1TypeEnum.audit_task_type,
        typeLabel: MatchConditionReqV1TypeEnum.audit_task_type,
        content: 'SQL审核'
      }
    ]);
  });

  it('formatMatchMode keeps backend content_display for audit_task_type', () => {
    const rows = formatMatchMode(
      {
        type: CreateBlacklistReqV1TypeEnum.fp_sql,
        content: 'select 1',
        match_conditions_display: [
          {
            type: MatchConditionReqV1TypeEnum.audit_task_type,
            content: 'mysql_slow_log',
            content_display: 'MySQL 慢日志'
          }
        ]
      },
      (type) => type ?? '-'
    );

    expect(rows[1]).toEqual({
      type: MatchConditionReqV1TypeEnum.audit_task_type,
      typeLabel: MatchConditionReqV1TypeEnum.audit_task_type,
      content: 'MySQL 慢日志'
    });
  });
});
