import { IBlacklistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  BlacklistResV1RuleScopeModeEnum,
  BlacklistResV1TypeEnum,
  MatchConditionReqV1TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';

export const mockBlacklistData: IBlacklistResV1[] = [
  {
    blacklist_id: 1,
    desc: 'test1',
    type: BlacklistResV1TypeEnum.sql,
    content: 'SELECT 1;',
    matched_count: 1,
    last_match_time: '2024-08-22T11:04:29.543+08:00',
    rule_scope_mode: BlacklistResV1RuleScopeModeEnum.all,
    created_by: 'admin',
    created_at: '2024-08-22 11:04:29'
  },
  {
    blacklist_id: 2,
    desc: '业务主键查询',
    type: BlacklistResV1TypeEnum.fp_sql,
    content: 'SELECT 1;',
    matched_count: 10,
    last_match_time: undefined,
    rule_scope_mode: BlacklistResV1RuleScopeModeEnum.specific,
    rule_scope: ['dml_check_where_is_invalid'] as unknown as undefined,
    rule_scope_display: [
      {
        rule_name: 'dml_check_where_is_invalid',
        rule_desc: 'DML 语句 WHERE 条件无效',
        level: 'warn'
      }
    ],
    match_conditions: [
      {
        type: MatchConditionReqV1TypeEnum.audit_task_type,
        content: 'mysql_slow_log'
      },
      {
        type: MatchConditionReqV1TypeEnum.audit_task_id,
        content: '100'
      }
    ],
    match_conditions_display: [
      {
        type: MatchConditionReqV1TypeEnum.audit_task_type,
        content: 'mysql_slow_log',
        content_display: 'MySQL 慢日志'
      },
      {
        type: MatchConditionReqV1TypeEnum.audit_task_id,
        content: '100',
        content_display: 'prod-mysql-01 (#100)',
        navigate_path: '/sqle/project/project-uid/sql-management-conf/100'
      }
    ],
    created_by: 'zhangsan',
    created_at: '2026-06-29 10:00:00'
  },
  {
    blacklist_id: 3,
    desc: 'test3',
    type: BlacklistResV1TypeEnum.ip,
    content: '127.0.0.1',
    matched_count: 0,
    rule_scope_mode: BlacklistResV1RuleScopeModeEnum.all
  },
  {
    blacklist_id: 4,
    desc: 'test4',
    type: BlacklistResV1TypeEnum.cidr,
    content: '127.0.0.1',
    matched_count: 0
  },
  {
    blacklist_id: 5,
    desc: 'test5',
    type: BlacklistResV1TypeEnum.host,
    content: '/',
    matched_count: 0
  },
  {
    blacklist_id: 6,
    desc: 'test6',
    type: BlacklistResV1TypeEnum.instance,
    content: 'mysql-1',
    matched_count: 0
  },
  {
    blacklist_id: 7,
    type: BlacklistResV1TypeEnum.instance
  }
];

export const mockBlacklistDetailData: IBlacklistResV1 = mockBlacklistData[1];
