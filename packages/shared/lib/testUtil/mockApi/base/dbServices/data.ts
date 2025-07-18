import {
  ICheckDBServiceIsConnectableReplyItem,
  IListDBService,
  IListDBServiceTipItem,
  IListGlobalDBServiceV2
} from '../../../../api/base/service/common';
import {
  ListGlobalDBServiceV2LastConnectionTestStatusEnum,
  SQLQueryConfigAllowQueryWhenLessThanAuditLevelEnum
} from '../../../../api/base/service/common.enum';

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
    },
    instance_audit_plan_id: 1232,
    audit_plan_types: [
      { type: 'mysql_slow_log', desc: '慢日志', audit_plan_id: 1 }
    ]
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
    is_connectable: false,
    connect_error_message: '链接失败'
  }
];

export const globalDataSourceMockData: IListGlobalDBServiceV2[] = [
  {
    uid: '123456',
    name: 'vm1-mysql',
    db_type: 'MySQL',
    host: '10.186.62.41',
    port: '3306',
    environment_tag: {
      uid: '1',
      name: 'environment-1'
    },
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
    is_enable_masking: false,
    project_name: 'default',
    unfinished_workflow_num: 1,
    is_enable_audit: true,
    last_connection_test_error_message: 'error message',
    last_connection_test_status:
      ListGlobalDBServiceV2LastConnectionTestStatusEnum.connect_failed,
    last_connection_test_time: '2024-11-15T15:28:13.315+08:00'
  },
  {
    uid: '123457',
    name: 'vm1-mysql',
    db_type: 'MySQL',
    host: '',
    port: '3306',
    environment_tag: {
      uid: '2',
      name: 'environment-2'
    },
    maintenance_times: [],
    desc: '',
    source: 'SQLE',
    project_uid: '1811294305910788096',
    is_enable_masking: false,
    project_name: 'project1',
    unfinished_workflow_num: 0,
    is_enable_audit: false,
    last_connection_test_error_message: '',
    last_connection_test_status:
      ListGlobalDBServiceV2LastConnectionTestStatusEnum.connect_success,
    last_connection_test_time: '2024-11-15T15:28:13.315+08:00'
  },
  {
    uid: '123458',
    name: 'vm1-oracle',
    db_type: 'Oracle',
    host: '10.186.62.41',
    port: '',
    environment_tag: {
      uid: '2',
      name: 'environment-2'
    },
    maintenance_times: [],
    desc: '',
    source: 'SQLE',
    project_uid: '700300',
    is_enable_masking: false,
    project_name: 'default',
    unfinished_workflow_num: 0,
    is_enable_audit: false
  }
];

export const globalDBServicesTipsMockData = {
  db_type: ['MySQL']
};
