import { IListDatabaseSourceService } from '@actiontech/shared/lib/api/base/service/common';

export const taskList: IListDatabaseSourceService[] = [
  {
    project_uid: '700030',
    name: 'test-mysql-1',
    db_type: 'mysql',
    uid: '0002',
    last_sync_success_time: '2023-01-10',
    source: 'source1',
    url: 'http://192.168.1.1:3000',
    version: '4.2.2.0',
    cron_express: '0 0 * * *',
    sqle_config: {
      rule_template_id: '01',
      rule_template_name: 'global_rule_template_name1'
    }
  },
  {
    project_uid: '700300',
    name: 'test-oracle-1',
    db_type: 'oracle',
    uid: '1234',
    last_sync_success_time: '2023-01-10',
    source: 'source1',
    url: 'http://192.168.1.1:3000',
    version: '4.2.2.0',
    cron_express: '0 0 * * *'
  }
];

export const taskListTips = [
  { source: 'source1', db_types: ['mysql'] },
  { source: 'source2', db_types: ['oracle'] }
];
