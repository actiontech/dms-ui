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
      sql_fingerprint:
        'CREATE TABLE `members` (\n  `uid` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `created_at` datetime(3) DEFAULT NULL,\n  `updated_at` datetime(3) DEFAULT NULL,\n  `user_uid` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `project_uid` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  PRIMARY KEY (`uid`),\n  UNIQUE KEY `project_user_id` (`user_uid`,`project_uid`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',
      sql: 'CREATE TABLE `members` (\n  `uid` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `created_at` datetime(3) DEFAULT NULL,\n  `updated_at` datetime(3) DEFAULT NULL,\n  `user_uid` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `project_uid` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  PRIMARY KEY (`uid`),\n  UNIQUE KEY `project_user_id` (`user_uid`,`project_uid`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',
      source: {
        type: 'audit_plan',
        audit_plan_name: 'audit-plan-task1',
        sql_audit_record_ids: []
      },
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
        },
        {
          level: 'error',
          message: '主键建议使用 BIGINT 无符号类型，即 BIGINT UNSIGNED',
          rule_name: 'ddl_check_pk_without_bigint_unsigned'
        },
        {
          level: 'error',
          message: '除了自增列及大字段列之外，每个列都必须添加默认值',
          rule_name: 'ddl_check_column_without_default'
        },
        {
          level: 'error',
          message: '建议UNIQUE索引名使用 IDX_UK_表名_字段名',
          rule_name: 'ddl_check_unique_index'
        },
        {
          level: 'error',
          message: '建议UNIQUE索引要以"uniq_"为前缀',
          rule_name: 'ddl_check_unique_index_prefix'
        },
        {
          level: 'warn',
          message: '这些索引字段(user_uid,project_uid)需要有非空约束',
          rule_name: 'ddl_check_index_not_null_constraint'
        },
        {
          level: 'warn',
          message: '建议建表DDL包含CREATE_TIME字段且默认值为CURRENT_TIMESTAMP',
          rule_name: 'ddl_check_create_time_column'
        },
        {
          level: 'warn',
          message: '建议字段约束为NOT NULL时带默认值，以下字段不规范:uid',
          rule_name: 'ddl_check_field_not_null_must_contain_default_value'
        },
        {
          level: 'warn',
          message:
            '建表DDL需要包含UPDATE_TIME字段且默认值为CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
          rule_name: 'ddl_check_update_time_column'
        },
        {
          level: 'notice',
          message: '建议使用规定的数据库排序规则为utf8mb4_0900_ai_ci',
          rule_name: 'ddl_check_collation_database'
        },
        {
          level: 'notice',
          message:
            '建议字段created_at,updated_at,user_uid,project_uid设置NOT NULL约束',
          rule_name: 'ddl_check_column_not_null'
        },
        {
          level: 'notice',
          message: '列建议添加注释',
          rule_name: 'ddl_check_column_without_comment'
        },
        {
          level: 'notice',
          message: '建议主键命名为"PK_表名"',
          rule_name: 'ddl_check_pk_name'
        },
        {
          level: 'notice',
          message: '表建议添加注释',
          rule_name: 'ddl_check_table_without_comment'
        }
      ],
      first_appear_timestamp: '',
      last_receive_timestamp: '',
      fp_count: 0,
      assignees: ['test'],
      status: 'unhandled',
      remark: '',
      endpoints: []
    },
    {
      id: 248,
      sql_fingerprint:
        'CREATE TABLE `plugins` (\n  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `add_db_service_pre_check_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `del_db_service_pre_check_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `del_user_pre_check_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `del_user_group_pre_check_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `operate_data_resource_handle_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  PRIMARY KEY (`name`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',
      source: {
        type: 'audit_plan',
        audit_plan_name: 'audit-plan-task1',
        sql_audit_record_ids: null
      },
      instance_name: 'mysql',
      schema_name: 'dms',
      first_appear_timestamp: '',
      last_receive_timestamp: '',
      fp_count: 0,
      assignees: ['test', 'admin'],
      status: 'unhandled',
      remark: '',
      endpoints: []
    },
    {
      id: 247,
      sql_fingerprint:
        "CREATE TABLE `projects` (\n  `uid` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `created_at` datetime(3) DEFAULT NULL,\n  `updated_at` datetime(3) DEFAULT NULL,\n  `name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `desc` longtext COLLATE utf8mb4_unicode_ci,\n  `create_user_uid` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `status` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT 'active',\n  PRIMARY KEY (`uid`),\n  UNIQUE KEY `name` (`name`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
      sql: "CREATE TABLE `projects` (\n  `uid` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `created_at` datetime(3) DEFAULT NULL,\n  `updated_at` datetime(3) DEFAULT NULL,\n  `name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `desc` longtext COLLATE utf8mb4_unicode_ci,\n  `create_user_uid` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `status` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT 'active',\n  PRIMARY KEY (`uid`),\n  UNIQUE KEY `name` (`name`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
      source: {
        type: 'audit_plan',
        audit_plan_name: 'audit-plan-task1',
        sql_audit_record_ids: null
      },
      instance_name: 'mysql',
      schema_name: 'dms',
      audit_result: [
        {
          level: 'error',
          message: '建议UNIQUE索引名使用 IDX_UK_表名_字段名',
          rule_name: 'ddl_check_unique_index'
        },
        {
          level: 'error',
          message: '数据库对象命名禁止使用保留字 desc',
          rule_name: 'ddl_check_object_name_using_keyword'
        },
        {
          level: 'error',
          message: '主键建议使用自增',
          rule_name: 'ddl_check_pk_without_auto_increment'
        },
        {
          level: 'error',
          message: '除了自增列及大字段列之外，每个列都必须添加默认值',
          rule_name: 'ddl_check_column_without_default'
        },
        {
          level: 'error',
          message: '新建表建议加入 IF NOT EXISTS，保证重复执行不报错',
          rule_name: 'ddl_check_table_without_if_not_exists'
        },
        {
          level: 'error',
          message: '主键建议使用 BIGINT 无符号类型，即 BIGINT UNSIGNED',
          rule_name: 'ddl_check_pk_without_bigint_unsigned'
        },
        {
          level: 'error',
          message: '建议UNIQUE索引要以"uniq_"为前缀',
          rule_name: 'ddl_check_unique_index_prefix'
        },
        {
          level: 'warn',
          message: '建议字段约束为NOT NULL时带默认值，以下字段不规范:uid',
          rule_name: 'ddl_check_field_not_null_must_contain_default_value'
        },
        {
          level: 'warn',
          message: '这些索引字段(name)需要有非空约束',
          rule_name: 'ddl_check_index_not_null_constraint'
        },
        {
          level: 'warn',
          message: '建议建表DDL包含CREATE_TIME字段且默认值为CURRENT_TIMESTAMP',
          rule_name: 'ddl_check_create_time_column'
        },
        {
          level: 'warn',
          message:
            '建表DDL需要包含UPDATE_TIME字段且默认值为CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
          rule_name: 'ddl_check_update_time_column'
        },
        {
          level: 'notice',
          message: '不建议使用 BLOB 或 TEXT 类型',
          rule_name: 'ddl_check_column_blob_notice'
        },
        {
          level: 'notice',
          message: '列建议添加注释',
          rule_name: 'ddl_check_column_without_comment'
        },
        {
          level: 'notice',
          message: '建议主键命名为"PK_表名"',
          rule_name: 'ddl_check_pk_name'
        },
        {
          level: 'notice',
          message:
            '字段：desc为TEXT类型，建议和原表进行分拆，与原表主键单独组成另外一个表进行存放',
          rule_name: 'ddl_avoid_text'
        },
        {
          level: 'notice',
          message: '建议使用规定的数据库排序规则为utf8mb4_0900_ai_ci',
          rule_name: 'ddl_check_collation_database'
        },
        {
          level: 'notice',
          message: '表建议添加注释',
          rule_name: 'ddl_check_table_without_comment'
        },
        {
          level: 'notice',
          message:
            '建议字段created_at,updated_at,name,desc,create_user_uid,status设置NOT NULL约束',
          rule_name: 'ddl_check_column_not_null'
        }
      ],
      first_appear_timestamp: '',
      last_receive_timestamp: '',
      fp_count: 0,
      assignees: null,
      status: 'unhandled',
      remark: '',
      endpoints: []
    }
  ],
  sql_manage_bad_num: 1,
  sql_manage_optimized_num: 1,
  sql_manage_total_num: 2
};

export const exportSqlManageData = 'test';
