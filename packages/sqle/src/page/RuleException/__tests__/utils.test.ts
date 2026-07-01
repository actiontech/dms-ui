import {
  BlacklistResV1RuleScopeModeEnum,
  CreateBlacklistReqV1TypeEnum,
  MatchConditionReqV1TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  buildQuickAddRuleExceptionSummaryItems,
  buildBlacklistPrefillFromSqlManage,
  buildRuleExceptionFromSqlManage,
  buildSqlManageRuleExceptionContext,
  formatMatchMode,
  normalizeMatchRowsOrder,
  rowsToBlacklistBody,
  validateMatchRows
} from '../utils';

describe('sqle/page/RuleException/utils', () => {
  it('buildRuleExceptionFromSqlManage omits empty match conditions', () => {
    expect(
      buildRuleExceptionFromSqlManage(
        { sql_fingerprint: 'select 1' },
        'rule_a',
        'remark'
      )
    ).toEqual({
      type: CreateBlacklistReqV1TypeEnum.fp_sql,
      content: 'select 1',
      match_conditions: undefined,
      rule_scope: ['rule_a'],
      desc: 'remark'
    });
  });

  it('buildRuleExceptionFromSqlManage maps instance and source fields', () => {
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
        }
      ],
      rule_scope: ['rule_b'],
      desc: undefined
    });
  });

  it('buildRuleExceptionFromSqlManage does not add db_type to match_conditions', () => {
    expect(
      buildRuleExceptionFromSqlManage(
        {
          sql_fingerprint: 'select 1',
          db_type: 'PostgreSQL'
        },
        'rule_c'
      )
    ).toEqual({
      type: CreateBlacklistReqV1TypeEnum.fp_sql,
      content: 'select 1',
      match_conditions: undefined,
      rule_scope: ['rule_c'],
      desc: undefined
    });
  });

  it('buildSqlManageRuleExceptionContext resolves db_type from record and audit_result', () => {
    expect(
      buildSqlManageRuleExceptionContext({
        sql_fingerprint: 'select 1',
        db_type: 'MySQL'
      })
    ).toEqual({
      sql_fingerprint: 'select 1',
      db_type: 'MySQL'
    });

    expect(
      buildSqlManageRuleExceptionContext({
        sql_fingerprint: 'select 1',
        audit_result: [{ db_type: 'PostgreSQL', rule_name: 'rule_a' }]
      })
    ).toEqual({
      sql_fingerprint: 'select 1',
      db_type: 'PostgreSQL'
    });

    expect(
      buildSqlManageRuleExceptionContext({
        sql: 'select 2'
      })
    ).toEqual({
      sql_fingerprint: 'select 2'
    });
  });

  it('buildBlacklistPrefillFromSqlManage maps sql manage fields to blacklist prefill', () => {
    expect(
      buildBlacklistPrefillFromSqlManage({
        sql_fingerprint: 'select * from t',
        instance_id: '123',
        db_type: 'MySQL',
        source: {
          sql_source_type: 'mysql_slow_log',
          sql_source_ids: ['100']
        }
      })
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
        }
      ]
    });
  });

  it('buildBlacklistPrefillFromSqlManage exposes triggered rules without pre-selecting rule scope', () => {
    expect(
      buildBlacklistPrefillFromSqlManage({
        sql_fingerprint: 'select * from t',
        db_type: 'MySQL',
        audit_result: [
          {
            level: 'error',
            rule_name: 'ddl_check_table_without_if_not_exists',
            message: 'table without if not exists'
          },
          {
            level: 'normal',
            rule_name: 'ignored_rule'
          }
        ]
      })
    ).toEqual({
      type: CreateBlacklistReqV1TypeEnum.fp_sql,
      content: 'select * from t',
      rule_scope_mode: BlacklistResV1RuleScopeModeEnum.specific,
      rule_scope: [],
      rule_scope_display: [
        {
          rule_name: 'ddl_check_table_without_if_not_exists',
          level: 'error',
          db_type: 'MySQL',
          rule_desc: 'table without if not exists'
        }
      ]
    });
  });

  it('buildBlacklistPrefillFromSqlManage pre-selects clicked rule and keeps all triggered rules in display', () => {
    expect(
      buildBlacklistPrefillFromSqlManage(
        {
          sql_fingerprint: 'select * from t',
          db_type: 'MySQL',
          audit_result: [
            {
              level: 'error',
              rule_name: 'rule_a',
              message: 'rule a message'
            },
            {
              level: 'warn',
              rule_name: 'rule_b',
              message: 'rule b message'
            }
          ]
        },
        { ruleName: 'rule_b' }
      )
    ).toEqual({
      type: CreateBlacklistReqV1TypeEnum.fp_sql,
      content: 'select * from t',
      rule_scope_mode: BlacklistResV1RuleScopeModeEnum.specific,
      rule_scope: ['rule_b'],
      rule_scope_display: [
        {
          rule_name: 'rule_a',
          level: 'error',
          db_type: 'MySQL',
          rule_desc: 'rule a message'
        },
        {
          rule_name: 'rule_b',
          level: 'warn',
          db_type: 'MySQL',
          rule_desc: 'rule b message'
        }
      ]
    });
  });

  it('buildBlacklistPrefillFromSqlManage returns null without fingerprint or sql', () => {
    expect(buildBlacklistPrefillFromSqlManage(undefined)).toBeNull();
    expect(buildBlacklistPrefillFromSqlManage({})).toBeNull();
  });

  it('buildQuickAddRuleExceptionSummaryItems omits db_type row', () => {
    expect(
      buildQuickAddRuleExceptionSummaryItems({
        sqlManageContext: {
          sql_fingerprint: 'select 1',
          db_type: 'MySQL',
          source: {
            sql_source_type: 'mysql_slow_log',
            sql_source_desc: 'slow log'
          }
        },
        ruleName: 'rule_a',
        getLabel: (key) => key
      })
    ).toEqual([
      {
        key: 'audit_task_type',
        label: 'audit_task_type',
        value: 'mysql_slow_log'
      },
      {
        key: 'audit_task_name',
        label: 'audit_task_name',
        value: 'slow log'
      },
      {
        key: 'fingerPrint',
        label: 'fingerPrint',
        value: 'select 1'
      },
      {
        key: 'rule_scope',
        label: 'rule_scope',
        value: 'rule_a'
      }
    ]);
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

  it('normalizeMatchRowsOrder promotes primary type before audit task conditions', () => {
    expect(
      normalizeMatchRowsOrder([
        {
          type: MatchConditionReqV1TypeEnum.audit_task_type,
          content: 'mysql_schema_meta'
        },
        {
          type: CreateBlacklistReqV1TypeEnum.fp_sql,
          content: 'select 1'
        },
        {
          type: MatchConditionReqV1TypeEnum.audit_task_id,
          content: '7'
        }
      ])
    ).toEqual([
      {
        type: CreateBlacklistReqV1TypeEnum.fp_sql,
        content: 'select 1'
      },
      {
        type: MatchConditionReqV1TypeEnum.audit_task_type,
        content: 'mysql_schema_meta'
      },
      {
        type: MatchConditionReqV1TypeEnum.audit_task_id,
        content: '7'
      }
    ]);
  });

  it('validateMatchRows accepts audit task rows when a primary type row exists', () => {
    expect(
      validateMatchRows([
        {
          type: MatchConditionReqV1TypeEnum.audit_task_type,
          content: 'mysql_schema_meta'
        },
        {
          type: CreateBlacklistReqV1TypeEnum.fp_sql,
          content: 'select 1'
        }
      ])
    ).toBeNull();
  });

  it('validateMatchRows rejects audit task type as the only row', () => {
    expect(
      validateMatchRows([
        {
          type: MatchConditionReqV1TypeEnum.audit_task_type,
          content: 'mysql_schema_meta'
        }
      ])
    ).toBe('missingPrimaryType');
  });

  it('rowsToBlacklistBody uses primary row as type and audit task as match_conditions', () => {
    expect(
      rowsToBlacklistBody(
        [
          {
            type: MatchConditionReqV1TypeEnum.audit_task_type,
            content: 'mysql_schema_meta'
          },
          {
            type: CreateBlacklistReqV1TypeEnum.fp_sql,
            content: 'select 1'
          },
          {
            type: MatchConditionReqV1TypeEnum.audit_task_id,
            content: '7'
          }
        ],
        BlacklistResV1RuleScopeModeEnum.all,
        []
      )
    ).toEqual({
      type: CreateBlacklistReqV1TypeEnum.fp_sql,
      content: 'select 1',
      desc: undefined,
      match_conditions: [
        {
          type: MatchConditionReqV1TypeEnum.audit_task_type,
          content: 'mysql_schema_meta'
        },
        {
          type: MatchConditionReqV1TypeEnum.audit_task_id,
          content: '7'
        }
      ],
      rule_scope: 'ALL'
    });
  });
});
