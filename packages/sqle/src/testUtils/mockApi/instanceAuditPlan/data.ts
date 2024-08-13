import {
  IInstanceAuditPlanResV1,
  IAuditPlanTypesV1,
  IAuditPlanMetaV1,
  IInstanceAuditPlanInfo,
  IAuditPlanSQLDataResV1,
  IAuditPlanSQLMetaResV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import {
  InstanceAuditPlanResV1ActiveStatusEnum,
  AuditPlanTypesV1InstanceTypeEnum,
  AuditPlanParamResV1TypeEnum,
  InstanceAuditPlanInfoActiveStatusEnum,
  AuditPlanSQLHeadV1TypeEnum,
  FilterMetaFilterInputTypeEnum,
  FilterMetaFilterOpTypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';

export const mockInstanceAuditPlanListData: IInstanceAuditPlanResV1[] = [
  {
    instance_audit_plan_id: 1,
    instance_name: '',
    business: 'test',
    instance_type: 'MySQL',
    audit_plan_types: [
      {
        audit_plan_id: 1,
        type: 'sql_file',
        desc: 'SQL文件'
      }
    ],
    active_status: InstanceAuditPlanResV1ActiveStatusEnum.normal,
    create_time: '2024-07-29T16:12:35.858+08:00',
    creator: 'admin'
  },
  {
    instance_audit_plan_id: 2,
    instance_name: 'test instance name',
    business: 'test',
    instance_type: '',
    audit_plan_types: [
      {
        audit_plan_id: 1,
        type: 'sql_file',
        desc: 'SQL文件'
      },
      {
        audit_plan_id: 2,
        type: 'mysql_schema_meta',
        desc: 'MySQL库表元数据'
      },
      {
        audit_plan_id: 3,
        type: 'all_app_extract',
        desc: '应用程序SQL抓取'
      }
    ],
    active_status: InstanceAuditPlanResV1ActiveStatusEnum.disabled,
    create_time: '2024-07-29T16:12:35.858+08:00',
    creator: 'admin'
  },
  {
    instance_audit_plan_id: 3,
    instance_name: '',
    business: 'test',
    instance_type: '',
    audit_plan_types: [],
    create_time: '2024-07-29T16:12:35.858+08:00',
    creator: 'admin'
  }
];

export const mockAuditPlanTypesData: IAuditPlanTypesV1[] = [
  {
    type: 'default',
    desc: '自定义',
    instance_type: AuditPlanTypesV1InstanceTypeEnum.UNKNOWN
  },
  {
    type: 'mysql_slow_log',
    desc: '慢日志',
    instance_type: AuditPlanTypesV1InstanceTypeEnum.MySQL
  },
  {
    type: 'mysql_mybatis',
    desc: 'Mybatis 扫描',
    instance_type: AuditPlanTypesV1InstanceTypeEnum.MySQL
  },
  {
    type: 'mysql_schema_meta',
    desc: '库表元数据',
    instance_type: AuditPlanTypesV1InstanceTypeEnum.MySQL
  },
  {
    type: 'ali_rds_mysql_slow_log',
    desc: '阿里RDS MySQL慢日志',
    instance_type: AuditPlanTypesV1InstanceTypeEnum.MySQL
  },
  {
    type: 'ali_rds_mysql_audit_log',
    desc: '阿里RDS MySQL审计日志',
    instance_type: AuditPlanTypesV1InstanceTypeEnum.MySQL
  },
  {
    type: 'oracle_top_sql',
    desc: 'Oracle TOP SQL',
    instance_type: AuditPlanTypesV1InstanceTypeEnum.Oracle
  },
  {
    type: 'all_app_extract',
    desc: '应用程序SQL抓取',
    instance_type: AuditPlanTypesV1InstanceTypeEnum.UNKNOWN
  },
  {
    type: 'tidb_audit_log',
    desc: 'TiDB审计日志',
    instance_type: AuditPlanTypesV1InstanceTypeEnum.TiDB
  },
  {
    type: 'ocean_base_for_mysql_mybatis',
    desc: 'Mybatis 扫描',
    instance_type: AuditPlanTypesV1InstanceTypeEnum.UNKNOWN
  },
  {
    type: 'ocean_base_for_mysql_top_sql',
    desc: 'Top SQL',
    instance_type: AuditPlanTypesV1InstanceTypeEnum['OceanBase For MySQL']
  }
];

export const mockAuditPlanMetaData: IAuditPlanMetaV1[] = [
  {
    audit_plan_type: 'default',
    audit_plan_type_desc: '自定义',
    instance_type: ''
  },
  {
    audit_plan_type: 'mysql_mybatis',
    audit_plan_type_desc: 'Mybatis 扫描',
    instance_type: ''
  },
  {
    audit_plan_type: 'mysql_schema_meta',
    audit_plan_type_desc: 'MySQL库表元数据',
    instance_type: 'MySQL',
    audit_plan_params: [
      {
        key: 'collect_interval_minute',
        desc: '采集周期（分钟）',
        value: '60',
        type: AuditPlanParamResV1TypeEnum.int
      },
      {
        key: 'collect_view',
        desc: '是否采集视图信息',
        value: '0',
        type: AuditPlanParamResV1TypeEnum.bool
      }
    ]
  },
  {
    audit_plan_type: 'ali_rds_mysql_slow_log',
    audit_plan_type_desc: '阿里RDS MySQL慢日志',
    instance_type: 'MySQL',
    audit_plan_params: [
      {
        key: 'db_instance_id',
        desc: '实例ID',
        value: '',
        type: AuditPlanParamResV1TypeEnum.string
      },
      {
        key: 'access_key_id',
        desc: 'Access Key ID',
        value: '',
        type: AuditPlanParamResV1TypeEnum.password
      },
      {
        key: 'access_key_secret',
        desc: 'Access Key Secret',
        value: '',
        type: AuditPlanParamResV1TypeEnum.password
      },
      {
        key: 'first_sqls_scrapped_in_last_period_hours',
        desc: '启动任务时拉取慢日志时间范围(单位:小时,最大31天)',
        value: '',
        type: AuditPlanParamResV1TypeEnum.int
      },
      {
        key: 'audit_sqls_scrapped_in_last_period_minute',
        desc: '审核过去时间段内抓取的SQL（分钟）',
        value: '0',
        type: AuditPlanParamResV1TypeEnum.int
      },
      {
        key: 'rds_path',
        desc: 'RDS Open API地址',
        value: 'rds.aliyuncs.com',
        type: AuditPlanParamResV1TypeEnum.string
      }
    ]
  },
  {
    audit_plan_type: 'sql_file',
    audit_plan_type_desc: 'SQL文件',
    instance_type: ''
  },
  // test data
  {
    audit_plan_type: 'custom_plan',
    audit_plan_type_desc: '测试扫描类型',
    instance_type: 'MySQL',
    audit_plan_params: [
      {
        key: 'custom_plan_ENV',
        desc: '扫描环境',
        value: 'DEV',
        enums_value: [
          {
            desc: 'DEV',
            value: 'DEV'
          },
          {
            desc: 'PROD',
            value: 'PROD'
          }
        ]
      }
    ]
  }
];

export const mockAuditPlanDetailData = {
  business: 'business1',
  instance_type: 'MySQL',
  instance_name: 'mysql-1',
  instance_id: '1739531854064652288',
  audit_plans: [
    {
      audit_plan_params: [],
      audit_plan_type: {
        audit_plan_id: 9,
        type: 'default',
        desc: '自定义'
      },
      rule_template_name: 'default_MySQL1'
    },
    {
      audit_plan_params: [
        {
          key: 'collect_interval_minute',
          desc: '采集周期（分钟）',
          value: '61',
          type: AuditPlanParamResV1TypeEnum.int
        },
        {
          key: 'collect_view',
          desc: '是否采集视图信息',
          value: 'true',
          type: AuditPlanParamResV1TypeEnum.bool
        }
      ],
      audit_plan_type: {
        audit_plan_id: 10,
        type: 'mysql_schema_meta',
        desc: 'MySQL库表元数据'
      },
      rule_template_name: 'default_MySQL'
    }
  ]
};

export const mockInstanceAuditPlanInfo: IInstanceAuditPlanInfo[] = [
  {
    id: 1,
    audit_plan_type: {
      audit_plan_id: 1,
      type: 'mysql_schema_meta',
      desc: '库表元数据'
    },
    audit_plan_db_type: 'MySQL',
    audit_plan_instance_name: 'mysql-1',
    exec_cmd: '',
    audit_plan_rule_template: {
      name: 'default_MySQL',
      is_global_rule_template: true
    },
    total_sql_nums: 0,
    unsolved_sql_nums: 0,
    last_collection_time: '2024-08-06T11:30:43+08:00',
    active_status: InstanceAuditPlanInfoActiveStatusEnum.normal
  },
  {
    id: 2,
    audit_plan_type: {
      audit_plan_id: 2,
      type: 'mysql_slow_log',
      desc: '慢日志'
    },
    audit_plan_db_type: 'MySQL',
    audit_plan_instance_name: 'mysql-1',
    exec_cmd:
      './scannerd mysql_slow_log --project=default --host=127.0.0.1 --port=10000  --audit_plan_id=2  --token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcG4iOiJjNGNhNDIzOGEwYjkyMzgyMGRjYzUwOWE2Zjc1ODQ5YiIsImV4cCI6MTc1NDM3Njk1MywiaXNzIjoiYWN0aW9udGVjaCBkbXMiLCJ1aWQiOiI3MDAyMDAifQ.nNEiVaSfy8XWapN4mv_VwXib4qJy6FVZxw0bx01XsRA',
    audit_plan_rule_template: {
      name: 'mysql_rule_template',
      is_global_rule_template: false
    },
    total_sql_nums: 0,
    unsolved_sql_nums: 0,
    last_collection_time: undefined,
    active_status: InstanceAuditPlanInfoActiveStatusEnum.disabled
  },
  {
    id: 3,
    audit_plan_type: {
      audit_plan_id: 3,
      type: 'mysql_processlist',
      desc: 'processlist 列表'
    },
    audit_plan_db_type: 'MySQL',
    audit_plan_instance_name: 'mysql-1',
    exec_cmd: '',
    audit_plan_rule_template: {
      name: 'default_MySQL',
      is_global_rule_template: true
    },
    total_sql_nums: 0,
    unsolved_sql_nums: 0,
    last_collection_time: undefined,
    active_status: InstanceAuditPlanInfoActiveStatusEnum.normal
  },
  {
    id: 4,
    audit_plan_type: {
      audit_plan_id: 4,
      type: 'default',
      desc: '自定义'
    },
    audit_plan_db_type: 'MySQL',
    audit_plan_instance_name: 'mysql-1',
    exec_cmd: '',
    audit_plan_rule_template: {
      name: 'default_MySQL',
      is_global_rule_template: true
    },
    total_sql_nums: 0,
    unsolved_sql_nums: 0,
    last_collection_time: undefined,
    active_status: InstanceAuditPlanInfoActiveStatusEnum.normal
  }
];

export const mockAuditPlanSQLMeta: IAuditPlanSQLMetaResV1 = {
  head: [
    {
      field_name: 'fingerprint',
      desc: 'SQL指纹',
      type: AuditPlanSQLHeadV1TypeEnum.sql,
      sortable: false
    },
    {
      field_name: 'sql',
      desc: 'SQL',
      type: AuditPlanSQLHeadV1TypeEnum.sql,
      sortable: false
    },
    {
      field_name: 'audit_results',
      desc: '审核结果',
      sortable: false
    },
    {
      field_name: 'counter',
      desc: '出现次数',
      sortable: true
    },
    {
      field_name: 'last_receive_timestamp',
      desc: '最后匹配时间',
      sortable: true
    },
    {
      field_name: 'query_time_avg',
      desc: '平均执行时间',
      sortable: true
    },
    {
      field_name: 'query_time_max',
      desc: '最长执行时间',
      sortable: true
    },
    {
      field_name: 'row_examined_avg',
      desc: '平均扫描行数',
      sortable: true
    },
    {
      field_name: 'db_user',
      desc: '用户',
      sortable: false
    },
    {
      field_name: 'schema_name',
      desc: 'Schema',
      sortable: false
    }
  ],
  filter_meta_list: [
    {
      filter_name: 'sql',
      desc: 'SQL',
      filter_input_type: FilterMetaFilterInputTypeEnum.string,
      filter_op_type: FilterMetaFilterOpTypeEnum.equal,
      filter_tip_list: []
    },
    {
      filter_name: 'rule_name',
      desc: '审核规则',
      filter_input_type: FilterMetaFilterInputTypeEnum.string,
      filter_op_type: FilterMetaFilterOpTypeEnum.equal,
      filter_tip_list: [
        {
          value: 'all_check_where_is_invalid',
          desc: '禁止使用没有WHERE条件或者WHERE条件恒为TRUE的SQL',
          group: 'MySQL'
        },
        {
          value: 'ddl_check_char_length',
          desc: '禁止char, varchar类型字段字符长度总和超过阈值',
          group: 'MySQL'
        },
        {
          value: 'ddl_check_column_timestamp_without_default',
          desc: 'TIMESTAMP 类型的列必须添加默认值',
          group: 'MySQL'
        },
        {
          value: 'ddl_check_column_without_default',
          desc: '除了自增列及大字段列之外，每个列都必须添加默认值',
          group: 'MySQL'
        },
        {
          value: 'ddl_check_table_without_if_not_exists',
          desc: '新建表建议加入 IF NOT EXISTS，保证重复执行不报错',
          group: 'MySQL'
        },
        {
          value: 'dml_check_fuzzy_search',
          desc: '禁止使用全模糊搜索或左模糊搜索',
          group: 'MySQL'
        },
        {
          value: 'dml_check_join_field_use_index',
          desc: 'JOIN字段必须包含索引',
          group: 'MySQL'
        },
        {
          value: 'dml_check_math_computation_or_func_on_index',
          desc: '禁止对索引列进行数学运算和使用函数',
          group: 'MySQL'
        }
      ]
    },
    {
      filter_name: 'db_user',
      desc: '用户',
      filter_input_type: FilterMetaFilterInputTypeEnum.string,
      filter_op_type: FilterMetaFilterOpTypeEnum.equal,
      filter_tip_list: [
        {
          value: '',
          desc: '',
          group: ''
        }
      ]
    },
    {
      filter_name: 'schema_name',
      desc: 'schema',
      filter_input_type: FilterMetaFilterInputTypeEnum.string,
      filter_op_type: FilterMetaFilterOpTypeEnum.equal,
      filter_tip_list: [
        {
          value: 'test123',
          desc: 'test123',
          group: ''
        },
        {
          value: '',
          desc: '',
          group: ''
        },
        {
          value: 'sqle',
          desc: 'sqle',
          group: ''
        },
        {
          value: 'test',
          desc: 'test',
          group: ''
        }
      ]
    },
    {
      filter_name: 'counter',
      desc: '出现次数 \u003e ',
      filter_input_type: FilterMetaFilterInputTypeEnum.int,
      filter_op_type: FilterMetaFilterOpTypeEnum.equal,
      filter_tip_list: []
    },
    {
      filter_name: 'query_time_avg',
      desc: '平均执行时间 \u003e ',
      filter_input_type: FilterMetaFilterInputTypeEnum.int,
      filter_op_type: FilterMetaFilterOpTypeEnum.equal,
      filter_tip_list: []
    },
    {
      filter_name: 'row_examined_avg',
      desc: '平均扫描行数 \u003e ',
      filter_input_type: FilterMetaFilterInputTypeEnum.int,
      filter_op_type: FilterMetaFilterOpTypeEnum.equal,
      filter_tip_list: []
    },
    {
      filter_name: 'last_receive_timestamp',
      desc: '最后匹配时间',
      filter_input_type: FilterMetaFilterInputTypeEnum.date_time,
      filter_op_type: FilterMetaFilterOpTypeEnum.between,
      filter_tip_list: []
    }
  ]
};

export const mockAuditPlanSQLData: IAuditPlanSQLDataResV1 = {
  rows: [
    {
      audit_results: 'null',
      counter: '598',
      db_user: '',
      fingerprint: 'SELECT ?,SLEEP(?) LIMIT ?,?',
      last_receive_timestamp: '2024-08-06T05:29:54Z',
      query_time_avg: '11',
      query_time_max: '11',
      row_examined_avg: '0',
      schema_name: 'test123',
      sql: '/* ApplicationName=DBeaver 24.1.2 - SQLEditor \u003cConsole\u003e */ select 1,SLEEP(11)\nLIMIT 0, 200'
    },
    {
      audit_results: 'null',
      counter: '299',
      db_user: '',
      fingerprint: 'SELECT ?,?,?,?,?,SLEEP(?) LIMIT ?,?',
      last_receive_timestamp: '2024-08-06T05:29:54Z',
      query_time_avg: '11',
      query_time_max: '11',
      row_examined_avg: '0',
      schema_name: '',
      sql: '/* ApplicationName=DBeaver 24.1.2 - SQLEditor \u003cConsole\u003e */ select 1,1,1,1,1,SLEEP(11)\nLIMIT 0, 200'
    },
    {
      audit_results: 'null',
      counter: '299',
      db_user: '',
      fingerprint: 'SELECT SLEEP(?) LIMIT ?,?',
      last_receive_timestamp: '2024-08-06T05:29:54Z',
      query_time_avg: '11',
      query_time_max: '11',
      row_examined_avg: '0',
      schema_name: '',
      sql: '/* ApplicationName=DBeaver 24.1.2 - SQLEditor \u003cConsole\u003e */ SELECT SLEEP(11) \nLIMIT 0, 200'
    },
    {
      audit_results:
        '[{"level": "warn", "message": "语法错误或者解析器不支持，请人工确认SQL正确性", "rule_name": ""}]',
      counter: '2388',
      db_user: '',
      fingerprint: 'Prepare',
      last_receive_timestamp: '2024-08-06T05:31:20Z',
      query_time_avg: '0',
      query_time_max: '0',
      row_examined_avg: '0',
      schema_name: 'sqle',
      sql: 'Prepare'
    },
    {
      audit_results: 'null',
      counter: '8559',
      db_user: '',
      fingerprint: 'COMMIT',
      last_receive_timestamp: '2024-08-06T05:31:21Z',
      query_time_avg: '0',
      query_time_max: '0',
      row_examined_avg: '0',
      schema_name: 'sqle',
      sql: 'COMMIT'
    },
    {
      audit_results: 'null',
      counter: '299',
      db_user: '',
      fingerprint:
        'INSERT INTO `audit_plan_sqls_v2` (`audit_plan_id`,`fingerprint_md5`,`fingerprint`,`sql_content`,`info`,`schema`) VALUES (?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?)',
      last_receive_timestamp: '2024-08-06T05:29:54Z',
      query_time_avg: '1',
      query_time_max: '1',
      row_examined_avg: '0',
      schema_name: 'sqle',
      sql: "INSERT INTO `audit_plan_sqls_v2` (`audit_plan_id`,`fingerprint_md5`, `fingerprint`, `sql_content`, `info`, `schema`) VALUES (3, 'a62860c563df5399c2acb800673ae715', 'CREATE TABLE `audit_files` (\\n  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,\\n  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,\\n  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\\n  `deleted_at` datetime DEFAULT NULL,\\n  `task_id` int(10) unsigned DEFAULT NULL,\\n  `unique_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\\n  `file_host` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\\n  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\\n  PRIMARY KEY (`id`)"
    }
  ]
};
