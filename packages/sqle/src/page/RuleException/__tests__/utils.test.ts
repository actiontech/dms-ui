import {
  CreateBlacklistReqV1TypeEnum,
  MatchConditionReqV1TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { buildRuleExceptionFromSqlManage } from '../utils';

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
});
