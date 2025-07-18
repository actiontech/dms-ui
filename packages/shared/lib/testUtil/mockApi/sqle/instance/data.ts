import { IInstanceTipResV2 } from '../../../../api/sqle/service/common';
import { InstanceTipResV2SupportedBackupStrategyEnum } from '../../../../api/sqle/service/common.enum';

export const instanceTipsMockData: IInstanceTipResV2[] = [
  {
    instance_id: '1739531854064652288',
    instance_name: 'mysql-1',
    instance_type: 'MySQL',
    workflow_template_id: 1,
    host: '10.186.62.13',
    port: '33061',
    enable_backup: true,
    supported_backup_strategy: [
      InstanceTipResV2SupportedBackupStrategyEnum.manual,
      InstanceTipResV2SupportedBackupStrategyEnum.none,
      InstanceTipResV2SupportedBackupStrategyEnum.original_row,
      InstanceTipResV2SupportedBackupStrategyEnum.reverse_sql
    ],
    backup_max_rows: 1000
  },
  {
    instance_id: '1739531942258282496',
    instance_name: 'mysql-2',
    instance_type: 'MySQL',
    workflow_template_id: 2,
    host: '10.186.62.14',
    port: '33062'
  },
  {
    instance_id: '1739833293479612416',
    instance_name: 'xin-test-database',
    instance_type: 'MySQL',
    workflow_template_id: 3,
    host: '10.186.62.15',
    port: '33063'
  },
  {
    instance_id: '1740625330336436224',
    instance_name: 'progres-1',
    instance_type: 'PostgreSQL',
    workflow_template_id: 4,
    host: '10.186.62.16',
    port: '5432'
  },
  {
    instance_id: '1743145219550875648',
    instance_name: 'mysql-5',
    instance_type: 'MySQL',
    workflow_template_id: 5,
    host: '139.196.241.182',
    port: '33061'
  }
];

export const instanceSchemasMockData = [
  'testSchema',
  'dms',
  'sqle',
  'test123',
  'test'
];

export const instanceInfoMockData = {
  instance_name: 'mysql',
  db_type: 'MySQL',
  db_host: '10.186.57.12',
  db_port: '3306',
  db_user: 'root',
  desc: '',
  maintenance_times: [],
  rule_template: {
    name: 'mysql',
    is_global_rule_template: false
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
