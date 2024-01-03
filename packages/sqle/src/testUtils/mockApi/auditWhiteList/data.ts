import { IAuditWhitelistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { CreateAuditWhitelistReqV1MatchTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export const auditWhiteListMockData: IAuditWhitelistResV1[] = [
  {
    audit_whitelist_id: 1,
    desc: 'test1',
    match_type: CreateAuditWhitelistReqV1MatchTypeEnum.exact_match,
    value: 'SELECT 1;'
  },
  {
    audit_whitelist_id: 2,
    desc: 'test2',
    match_type: CreateAuditWhitelistReqV1MatchTypeEnum.fp_match,
    value: 'SELECT 1;'
  },
  {
    audit_whitelist_id: 3,
    desc: 'test3',
    match_type: CreateAuditWhitelistReqV1MatchTypeEnum.exact_match,
    value: 'SELECT 1;'
  }
];
