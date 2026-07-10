import { IAuditWhitelistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  AuditWhitelistResV1RuleScopeModeEnum,
  MatchConditionReqV1TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';

export const auditWhiteListMockData: IAuditWhitelistResV1[] = [
  {
    audit_whitelist_id: 1,
    desc: 'test1',
    match_conditions: [
      {
        type: MatchConditionReqV1TypeEnum.fp_sql,
        content: 'SELECT 1;'
      },
      {
        type: MatchConditionReqV1TypeEnum.db_type,
        content: 'MySQL'
      }
    ],
    rule_scope_mode: AuditWhitelistResV1RuleScopeModeEnum.all,
    matched_count: 1,
    last_match_time: '2024-08-22T11:04:29.543+08:00',
    created_by: 'admin',
    created_at: '2024-08-22T11:04:29.543+08:00'
  },
  {
    audit_whitelist_id: 2,
    desc: 'test2',
    match_conditions: [
      {
        type: MatchConditionReqV1TypeEnum.fp_sql,
        content: 'SELECT 1;'
      }
    ],
    matched_count: 10,
    rule_scope_mode: AuditWhitelistResV1RuleScopeModeEnum.specific,
    created_by: 'admin'
  },
  {
    audit_whitelist_id: 3,
    desc: 'test3',
    match_conditions: [
      {
        type: MatchConditionReqV1TypeEnum.sql,
        content: 'SELECT 1;'
      }
    ],
    matched_count: 0
  },
  {
    audit_whitelist_id: 4,
    desc: 'test4',
    match_conditions: [
      {
        type: MatchConditionReqV1TypeEnum.sql,
        content: 'SELECT 2;'
      }
    ]
  }
];
