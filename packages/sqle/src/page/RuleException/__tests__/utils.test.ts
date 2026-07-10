import {
  AuditWhitelistResV1RuleScopeModeEnum,
  BlacklistResV1TypeEnum,
  CreateBlacklistReqV1TypeEnum,
  MatchConditionReqV1TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  buildBlacklistPrefillFromSqlManage,
  buildSqlManageRuleExceptionContext,
  formatMatchMode,
  normalizeMatchRowsOrder,
  rowsToAuditWhitelistBody,
  rowsToBlacklistBody,
  validateAuditWhitelistMatchRows,
  validateMatchRows
} from '../utils';

describe('sqle/page/RuleException/utils', () => {
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
      match_conditions: [
        {
          type: MatchConditionReqV1TypeEnum.fp_sql,
          content: 'select * from t'
        },
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
          type: MatchConditionReqV1TypeEnum.sql_source,
          content: 'audit_plan'
        },
        {
          type: MatchConditionReqV1TypeEnum.db_type,
          content: 'MySQL'
        }
      ]
    });
  });

  it('buildBlacklistPrefillFromSqlManage skips audit task match for quick audit source', () => {
    expect(
      buildBlacklistPrefillFromSqlManage({
        sql_fingerprint: 'select * from t',
        instance_id: '123',
        db_type: 'MySQL',
        source: {
          sql_source_type: 'sql_audit_record',
          sql_source_ids: ['2074001219117912064']
        }
      })
    ).toEqual({
      match_conditions: [
        {
          type: MatchConditionReqV1TypeEnum.fp_sql,
          content: 'select * from t'
        },
        {
          type: MatchConditionReqV1TypeEnum.instance,
          content: '123'
        },
        {
          type: MatchConditionReqV1TypeEnum.sql_source,
          content: 'sql_audit_record'
        },
        {
          type: MatchConditionReqV1TypeEnum.db_type,
          content: 'MySQL'
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
      match_conditions: [
        {
          type: MatchConditionReqV1TypeEnum.fp_sql,
          content: 'select * from t'
        },
        {
          type: MatchConditionReqV1TypeEnum.db_type,
          content: 'MySQL'
        }
      ],
      rule_scope_mode: AuditWhitelistResV1RuleScopeModeEnum.specific,
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
      match_conditions: [
        {
          type: MatchConditionReqV1TypeEnum.fp_sql,
          content: 'select * from t'
        },
        {
          type: MatchConditionReqV1TypeEnum.db_type,
          content: 'MySQL'
        }
      ],
      rule_scope_mode: AuditWhitelistResV1RuleScopeModeEnum.specific,
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

  it('buildBlacklistPrefillFromSqlManage returns row-action prefill without pre-selecting rules', () => {
    expect(
      buildBlacklistPrefillFromSqlManage(
        {
          sql_fingerprint: 'select * from t',
          instance_id: '123',
          db_type: 'MySQL',
          source: {
            sql_source_type: 'mysql_slow_log',
            sql_source_ids: ['100']
          },
          audit_result: [
            {
              level: 'error',
              rule_name: 'rule_a',
              message: 'rule a message'
            }
          ]
        },
        { specificRuleScopeWithoutPreselect: true }
      )
    ).toEqual({
      match_conditions: [
        {
          type: MatchConditionReqV1TypeEnum.fp_sql,
          content: 'select * from t'
        },
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
          type: MatchConditionReqV1TypeEnum.sql_source,
          content: 'audit_plan'
        },
        {
          type: MatchConditionReqV1TypeEnum.db_type,
          content: 'MySQL'
        }
      ],
      rule_scope_mode: AuditWhitelistResV1RuleScopeModeEnum.specific,
      rule_scope: [],
      rule_scope_display: [
        {
          rule_name: 'rule_a',
          level: 'error',
          db_type: 'MySQL',
          rule_desc: 'rule a message'
        }
      ]
    });
  });

  it('buildBlacklistPrefillFromSqlManage returns null without fingerprint or sql', () => {
    expect(buildBlacklistPrefillFromSqlManage(undefined)).toBeNull();
    expect(buildBlacklistPrefillFromSqlManage({})).toBeNull();
  });

  it('formatMatchMode resolves audit_task_type from raw content when display is missing', () => {
    const rows = formatMatchMode(
      {
        match_conditions: [
          {
            type: MatchConditionReqV1TypeEnum.fp_sql,
            content: 'select 1'
          },
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
        type: MatchConditionReqV1TypeEnum.fp_sql,
        typeLabel: MatchConditionReqV1TypeEnum.fp_sql,
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

    expect(rows[0]).toEqual({
      type: MatchConditionReqV1TypeEnum.audit_task_type,
      typeLabel: MatchConditionReqV1TypeEnum.audit_task_type,
      content: 'MySQL 慢日志'
    });
  });

  it('formatMatchMode prefers content_display for sql_source', () => {
    const rows = formatMatchMode(
      {
        match_conditions_display: [
          {
            type: MatchConditionReqV1TypeEnum.sql_source,
            content: 'sql_audit_record',
            content_display: '快捷审核'
          }
        ]
      },
      (type) => type ?? '-'
    );

    expect(rows[0]).toEqual({
      type: MatchConditionReqV1TypeEnum.sql_source,
      typeLabel: MatchConditionReqV1TypeEnum.sql_source,
      content: '快捷审核'
    });
  });

  it('formatMatchMode resolves sql_source label when content_display is missing', () => {
    const rows = formatMatchMode(
      {
        match_conditions: [
          {
            type: MatchConditionReqV1TypeEnum.sql_source,
            content: 'audit_plan'
          }
        ]
      },
      (type) => type ?? '-'
    );

    expect(rows[0]).toEqual({
      type: MatchConditionReqV1TypeEnum.sql_source,
      typeLabel: MatchConditionReqV1TypeEnum.sql_source,
      content: '扫描任务'
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

  it('validateAuditWhitelistMatchRows accepts instance-only row', () => {
    expect(
      validateAuditWhitelistMatchRows([
        {
          type: MatchConditionReqV1TypeEnum.instance,
          content: '123'
        }
      ])
    ).toBeNull();
  });

  it('rowsToAuditWhitelistBody maps rows to match_conditions for instance-only', () => {
    expect(
      rowsToAuditWhitelistBody(
        [
          {
            type: MatchConditionReqV1TypeEnum.instance,
            content: '123'
          }
        ],
        AuditWhitelistResV1RuleScopeModeEnum.all,
        []
      )
    ).toEqual({
      desc: undefined,
      match_conditions: [
        {
          type: MatchConditionReqV1TypeEnum.instance,
          content: '123'
        }
      ],
      rule_scope: 'ALL'
    });
  });

  it('rowsToAuditWhitelistBody preserves user row order in match_conditions', () => {
    expect(
      rowsToAuditWhitelistBody(
        [
          {
            type: MatchConditionReqV1TypeEnum.instance,
            content: '123'
          },
          {
            type: CreateBlacklistReqV1TypeEnum.fp_sql,
            content: 'select 1'
          }
        ],
        AuditWhitelistResV1RuleScopeModeEnum.all,
        []
      )
    ).toEqual({
      desc: undefined,
      match_conditions: [
        {
          type: MatchConditionReqV1TypeEnum.instance,
          content: '123'
        },
        {
          type: CreateBlacklistReqV1TypeEnum.fp_sql,
          content: 'select 1'
        }
      ],
      rule_scope: 'ALL'
    });
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
        AuditWhitelistResV1RuleScopeModeEnum.all,
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
