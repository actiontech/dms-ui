import { IInstanceTipResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

export const instanceTipsMockData: IInstanceTipResV1[] = [
  {
    instance_id: '123456',
    instance_name: 'mysql-1',
    instance_type: 'MySQL',
    workflow_template_id: 1,
    host: '11.182.61.13',
    port: '3000'
  }
];

export const instanceSchemasMockData = ['testSchema'];

export const instanceInfoMockData = {
  instance_name: 'mysql-1',
  db_type: 'MySQL',
  db_host: '11.182.61.13',
  db_port: '3000',
  db_user: 'root',
  desc: '',
  maintenance_times: [],
  rule_template: {
    name: 'default_MySQL',
    is_global_rule_template: true
  },
  additional_params: [],
  sql_query_config: {
    max_pre_query_rows: 0,
    query_timeout_second: 0,
    audit_enabled: false,
    allow_query_when_less_than_audit_level: ''
  },
  source: ''
};
