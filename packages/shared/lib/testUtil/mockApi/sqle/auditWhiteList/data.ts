import {
  IAuditWhitelistResV1,
  ISQLRuleExceptionResV1
} from '../../../../api/sqle/service/common.d';
import { CreateAuditWhitelistReqV1MatchTypeEnum } from '../../../../api/sqle/service/common.enum';

export const auditWhiteListMockData: IAuditWhitelistResV1[] = [
  {
    audit_whitelist_id: 1,
    desc: 'test1',
    match_type: CreateAuditWhitelistReqV1MatchTypeEnum.exact_match,
    value: 'SELECT 1;',
    matched_count: 1,
    last_match_time: '2024-08-22T11:04:29.543+08:00'
  },
  {
    audit_whitelist_id: 2,
    desc: 'test2',
    match_type: CreateAuditWhitelistReqV1MatchTypeEnum.fp_match,
    value: 'SELECT 1;',
    matched_count: 10,
    last_match_time: undefined
  },
  {
    audit_whitelist_id: 3,
    desc: 'test3',
    match_type: CreateAuditWhitelistReqV1MatchTypeEnum.exact_match,
    value: 'SELECT 1;',
    matched_count: 0
  },
  {
    audit_whitelist_id: 4,
    desc: 'test4'
  }
];

export const sqlRuleExceptionMockData: ISQLRuleExceptionResV1[] = [
  {
    sql_rule_exception_id: 11,
    project_name: 'default',
    instance_id: '1739531854064652288',
    instance_name: 'mysql_local_sqle',
    sql_fingerprint: 'create table rule_exc_management (id int)',
    rule_name: 'ddl_check_pk_not_exist',
    rule_desc: '建表语句必须包含主键',
    rule_level: 'error',
    reason: '标准管理页回归验证',
    created_by: 'admin',
    created_at: '2026-06-19T02:40:00+00:00',
    matched_count: 2,
    last_match_time: '2026-06-19T02:50:00+00:00'
  }
];
