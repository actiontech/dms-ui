import {
  ICheckDBServiceIsConnectableReplyItem,
  IListDBService,
  IListDBServiceTipItem,
  IListGlobalDBService
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

export const globalDataSourceMockData: IListGlobalDBService[] = [
  {
    uid: '123456',
    name: 'vm1-mysql',
    db_type: 'MySQL',
    host: '10.186.62.41',
    port: '3306',
    user: 'root',
    password: 'n272nm2cMC88ANri+pO6kA==',
    business: 'vm1',
    maintenance_times: [
      {
        maintenance_start_time: {
          hour: 2,
          minute: 0
        },
        maintenance_stop_time: {
          hour: 8,
          minute: 0
        }
      }
    ],
    desc: '222',
    source: 'SQLE',
    project_uid: '700300',
    sqle_config: {
      rule_template_name: 'default_MySQL',
      rule_template_id: '1',
      sql_query_config: {
        max_pre_query_rows: 0,
        query_timeout_second: 0,
        audit_enabled: true,
        allow_query_when_less_than_audit_level:
          SQLQueryConfigAllowQueryWhenLessThanAuditLevelEnum.normal
      }
    },
    is_enable_masking: false,
    project_name: 'default',
    unfinished_workflow_num: 1
  },
  {
    uid: '123457',
    name: 'vm1-mysql',
    db_type: 'MySQL',
    host: '',
    port: '3306',
    user: 'root',
    password: 'n272nm2cMC88ANri+pO6kA==',
    business: 'test',
    maintenance_times: [],
    desc: '',
    source: 'SQLE',
    project_uid: '1811294305910788096',
    sqle_config: {
      rule_template_name: 'default_MySQL',
      rule_template_id: '1',
      sql_query_config: {
        max_pre_query_rows: 0,
        query_timeout_second: 0,
        audit_enabled: false,
        allow_query_when_less_than_audit_level:
          SQLQueryConfigAllowQueryWhenLessThanAuditLevelEnum.error
      }
    },
    is_enable_masking: false,
    project_name: 'project1',
    unfinished_workflow_num: 0
  },
  {
    uid: '123458',
    name: 'vm1-oracle',
    db_type: 'Oracle',
    host: '10.186.62.41',
    port: '',
    user: 'lwq',
    password: 'yeiMeAJPbBfg4fDTGhNHPg==',
    business: 'vm1',
    maintenance_times: [],
    desc: '',
    source: 'SQLE',
    project_uid: '700300',
    sqle_config: {
      rule_template_name: 'default_Oracle',
      rule_template_id: '2',
      sql_query_config: {
        max_pre_query_rows: 0,
        query_timeout_second: 0,
        audit_enabled: false,
        allow_query_when_less_than_audit_level:
          SQLQueryConfigAllowQueryWhenLessThanAuditLevelEnum.warn
      }
    },
    additional_params: [
      {
        name: 'service_name',
        value: 'xe',
        description: 'service name',
        type: 'string'
      }
    ],
    is_enable_masking: false,
    project_name: 'default',
    unfinished_workflow_num: 0
  }
];
