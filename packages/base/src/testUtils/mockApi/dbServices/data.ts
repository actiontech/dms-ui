import {
  ICheckDBServiceIsConnectableReplyItem,
  IListDBService,
  IListDBServiceTipItem
} from '@actiontech/shared/lib/api/base/service/common';
import { SQLQueryConfigAllowQueryWhenLessThanAuditLevelEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

export const dbServices: IListDBService[] = [
  {
    business: 'business',
    db_type: 'MySQL',
    host: '127.0.0.1',
    maintenance_times: [],
    name: 'test',
    password: 'root',
    port: '3306',
    uid: '123123',
    user: 'root',
    sqle_config: {
      rule_template_id: '1',
      rule_template_name: 'rule_template_name1',
      sql_query_config: {
        allow_query_when_less_than_audit_level:
          SQLQueryConfigAllowQueryWhenLessThanAuditLevelEnum.notice,
        audit_enabled: true
      }
    }
  },
  {
    business: 'business',
    db_type: 'MySQL',
    host: 'localhost',
    maintenance_times: [],
    name: 'test2',
    password: '123',
    port: '3306',
    uid: '300123',
    user: 'test1'
  }
];

export const dbServicesTips: IListDBServiceTipItem[] = [
  {
    db_type: 'MySQL',
    host: '127.0.0.1',
    name: 'test',
    port: '3306',
    id: '123123'
  },
  {
    db_type: 'MySQL',
    host: 'localhost',
    name: 'test2',
    port: '3306',
    id: '300123'
  }
];

export const checkConnectableReply: ICheckDBServiceIsConnectableReplyItem[] = [
  {
    component: 'sqle',
    is_connectable: true
  },
  {
    component: 'provision',
    is_connectable: false
  }
];
