import { SqlManageAuditStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export const ruleTipsData = [
  {
    db_type: 'MySQL',
    rule: [
      {
        desc: '用于测试',
        rule_name: 'test'
      }
    ]
  },
  {
    rule: [
      {
        desc: '用于测试',
        rule_name: 'test'
      }
    ]
  },
  {
    db_type: 'MySQL'
  }
];

export const sqlManageListData = {
  data: [
    {
      id: 249,
      source: {},
      instance_name: 'mysql',
      schema_name: 'dms',
      audit_result: [
        {
          level: 'error',
          message: '新建表建议加入 IF NOT EXISTS，保证重复执行不报错',
          rule_name: 'ddl_check_table_without_if_not_exists'
        },
        {
          level: 'error',
          message: '主键建议使用自增',
          rule_name: 'ddl_check_pk_without_auto_increment'
        }
      ],
      first_appear_timestamp: '2024-01-02T11:28:34+08:00',
      last_receive_timestamp: '2024-01-03T11:28:34+08:00',
      fp_count: 0,
      assignees: ['test'],
      status: 'unhandled',
      remark: 'this is remark text',
      endpoints: ['12', '35', '32'],
      priority: 'high'
    },
    {
      id: 248,
      sql_fingerprint:
        'CREATE TABLE `plugins` (\n  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',
      source: {
        sql_source_type: 'mysql_slow_log',
        sql_source_desc: '慢日志',
        sql_source_ids: ['123']
      },
      first_appear_timestamp: '',
      last_receive_timestamp: '',
      fp_count: 0,
      assignees: ['test', 'admin'],
      remark: '',
      endpoints: null,
      priority: 'low'
    },
    {
      id: 247,
      sql_fingerprint:
        'CREATE TABLE `projects` (\n  UNIQUE KEY `name` (`name`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',
      sql: 'CREATE TABLE `projects` (\n  UNIQUE KEY `name` (`name`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',
      source: {
        sql_source_type: 'mysql_slow_log',
        sql_source_desc: '慢日志',
        sql_source_ids: ['123']
      },
      instance_name: 'mysql',
      schema_name: 'dms',
      audit_result: [
        {
          level: 'error',
          message: '建议UNIQUE索引名使用 IDX_UK_表名_字段名',
          rule_name: 'ddl_check_unique_index'
        }
      ],
      first_appear_timestamp: '',
      last_receive_timestamp: '',
      fp_count: 0,
      assignees: null,
      status: 'unhandled',
      remark: '',
      endpoints: null
    },
    {
      id: 246,
      sql_fingerprint:
        'CREATE TABLE `projects` (\n  UNIQUE KEY `name` (`name`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',
      sql: 'CREATE TABLE `projects` (\n  UNIQUE KEY `name` (`name`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',
      source: {
        sql_source_type: 'mysql_slow_log',
        sql_source_desc: '慢日志',
        sql_source_ids: ['123']
      },
      instance_name: 'mysql',
      schema_name: 'dms',
      audit_result: [
        {
          level: 'error',
          message: '建议UNIQUE索引名使用 IDX_UK_表名_字段名',
          rule_name: 'ddl_check_unique_index'
        }
      ],
      first_appear_timestamp: '',
      last_receive_timestamp: '',
      fp_count: 0,
      assignees: null,
      status: 'unhandled',
      remark: '',
      endpoints: ['34']
    },
    {
      id: 1150087,
      sql_fingerprint: 'SELECT ?',
      sql: 'SELECT 1;',
      source: {
        sql_source_type: 'sql_audit_record',
        sql_source_desc: 'SQL审核',
        sql_source_ids: ['123']
      },
      instance_name: 'MYSQL_3307',
      schema_name: 'db1',
      audit_result: [
        {
          level: 'normal',
          message: '白名单',
          rule_name: ''
        }
      ],
      first_appear_timestamp: '',
      last_receive_timestamp: '',
      fp_count: 0,
      assignees: ['t3', 't2'],
      status: 'unhandled',
      remark: '',
      endpoints: [],
      priority: ''
    },
    {
      id: 11500871,
      sql_fingerprint: 'SELECT ?',
      sql: 'SELECT 1;',
      source: {
        sql_source_type: 'sql_audit_record',
        sql_source_desc: 'SQL审核',
        sql_source_ids: ['123']
      },
      instance_name: 'MYSQL_3307',
      schema_name: 'db1',
      audit_result: [
        {
          level: 'normal',
          message: '白名单',
          rule_name: ''
        }
      ],
      first_appear_timestamp: '',
      last_receive_timestamp: '',
      fp_count: 0,
      assignees: ['t3', 't2'],
      status: 'unhandled',
      remark: '',
      endpoints: [],
      priority: '',
      audit_status: SqlManageAuditStatusEnum.being_audited
    }
  ],
  sql_manage_bad_num: 1,
  sql_manage_optimized_num: 1,
  sql_manage_total_num: 2
};
