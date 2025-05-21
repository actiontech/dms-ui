import {
  IDBServiceSyncTaskTip,
  IGetDBServiceSyncTask,
  IListDBServiceSyncTask
} from '../../../../api/base/service/common';
import { SQLQueryConfigAllowQueryWhenLessThanAuditLevelEnum } from '../../../../api/base/service/common.enum';

export const syncTaskListMockData: IListDBServiceSyncTask[] = [
  {
    name: 'test-mysql-1',
    db_type: 'mysql',
    uid: '0002',
    last_sync_success_time: '2023-01-10',
    source: 'source1',
    url: 'http://192.168.1.1:3000',
    cron_express: '0 0 * * *',
    sqle_config: {
      rule_template_id: '01',
      rule_template_name: 'global_rule_template_name1'
    }
  },
  {
    name: 'test-oracle-1',
    db_type: 'oracle',
    uid: '1234',
    last_sync_success_time: '2023-01-10',
    source: 'source1',
    url: 'http://192.168.1.1:3000',
    cron_express: '0 0 * * *'
  }
];

export const syncTaskDetailMockData: IGetDBServiceSyncTask = {
  additional_params: [{ key: 'key1', value: 'param1' }],
  cron_express: '1 1 * 1 2',
  db_type: 'MySQL',
  name: 'sync_task_name',
  source: 'source1',
  sqle_config: {
    rule_template_id: '9',
    rule_template_name: 'custom_template',
    sql_query_config: {
      allow_query_when_less_than_audit_level:
        SQLQueryConfigAllowQueryWhenLessThanAuditLevelEnum.notice,
      audit_enabled: true
    }
  },
  url: 'http://192.168.1.1:3000',
  uid: '1739531854064652288'
};

export const syncTaskTipsMockData: IDBServiceSyncTaskTip[] = [
  {
    service_source_name: 'source1',
    db_type: ['mysql'],
    params: [
      {
        desc: '动态字段1(这是一段描述)',
        key: 'key1',
        type: 'string',
        value: ''
      },
      { desc: '动态字段2(这是一段描述)', key: 'key2', type: 'int', value: '' }
    ]
  },
  { service_source_name: 'source2', db_type: ['oracle'] }
];
