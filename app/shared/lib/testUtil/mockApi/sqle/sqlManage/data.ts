import { SqlManageAuditStatusEnum } from '../../../../api/sqle/service/common.enum';
import { IAbnormalAuditPlanInstance } from '../../../../api/sqle/service/common.d';

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

export const mockGlobalSqlManageListData = [
  {
    id: 249,
    source: {
      sql_source_type: 'mysql_slow_log',
      sql_source_desc: '慢日志',
      sql_source_ids: ['123']
    },
    sql: 'CREATE TABLE `projects` (\n  UNIQUE KEY `name` (`name`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',
    instance_id: '1739531854064652288',
    instance_name: 'mysql-1',
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
    status: 'unhandled',
    project_priority: 'high',
    project_name: 'default',
    project_uid: '700300',
    problem_descriptions: ['test desc 1', 'test desc 2']
  },
  {
    id: 211,
    sql: 'CREATE TABLE `projects` (\n  UNIQUE KEY `name` (`name`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',
    instance_id: '1739531854064652288',
    instance_name: 'mysql-1',
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
    project_priority: 'high'
  }
];

export const mockSqlManageSqlAnalysisChartData = {
  points: [
    {
      y: 1.2,
      x: '2025-01-06T09:22:53.713Z',
      info: [
        {
          id: '1',
          select_id: '1',
          table: 'test_table',
          partitions: 'a,b,c',
          type: 'const',
          possible_keys: 'a,b,c',
          key: 'key_name',
          key_len: '231',
          ref: 'abc',
          rows: '100',
          filtered: '100',
          select_type: 'SIMPLE'
        }
      ]
    },
    {
      y: 3.2,
      x: '2025-01-07T09:32:53.713Z',
      info: [
        {
          id: '2',
          select_id: '1',
          table: 'test_table',
          partitions: 'a,b,c',
          type: 'const',
          possible_keys: 'a,b,c',
          key: 'key_name',
          key_len: '231',
          ref: 'abc',
          rows: '100',
          filtered: '100',
          select_type: 'SIMPLE'
        }
      ]
    },
    {
      y: 2.2,
      x: '2025-01-07T09:42:53.713Z',
      info: [
        {
          id: '3',
          select_id: '1',
          table: 'test_table',
          partitions: 'a,b,c',
          type: 'const',
          possible_keys: 'a,b,c',
          key: 'key_name',
          key_len: '231',
          ref: 'abc',
          rows: '100',
          filtered: '100',
          select_type: 'SIMPLE'
        }
      ]
    },
    {
      y: 5.2,
      x: '2025-01-07T09:52:53.713Z',
      info: [
        {
          id: '4',
          select_id: '1',
          table: 'test_table',
          partitions: 'a,b,c',
          type: 'const',
          possible_keys: 'a,b,c',
          key: 'key_name',
          key_len: '231',
          ref: 'abc',
          rows: '100',
          filtered: '100',
          select_type: 'SIMPLE'
        }
      ]
    }
  ]
};

export const mockAbnormalInstanceAuditPlansData: IAbnormalAuditPlanInstance[] =
  [
    {
      instance_audit_plan_id: 1,
      instance_name: 'mysql-1',
      abnormal_status_code: 1
    },
    {
      instance_audit_plan_id: 2,
      instance_name: 'mysql-2',
      abnormal_status_code: 4,
      token_exp: 1749027937
    },
    {
      instance_audit_plan_id: 3,
      instance_name: 'mysql-3',
      abnormal_status_code: 2
    }
  ];
