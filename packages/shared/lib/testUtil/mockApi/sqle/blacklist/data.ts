import { IBlacklistResV1 } from '../../../../api/sqle/service/common';
import { BlacklistResV1TypeEnum } from '../../../../api/sqle/service/common.enum';

export const mockBlacklistData: IBlacklistResV1[] = [
  {
    blacklist_id: 1,
    desc: 'test1',
    type: BlacklistResV1TypeEnum.sql,
    content: 'SELECT 1;',
    matched_count: 1,
    last_match_time: '2024-08-22T11:04:29.543+08:00'
  },
  {
    blacklist_id: 2,
    desc: 'test2',
    type: BlacklistResV1TypeEnum.fp_sql,
    content: 'SELECT 1;',
    matched_count: 10,
    last_match_time: undefined
  },
  {
    blacklist_id: 3,
    desc: 'test3',
    type: BlacklistResV1TypeEnum.ip,
    content: '127.0.0.1',
    matched_count: 0
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
