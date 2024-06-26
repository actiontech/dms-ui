export const tableSchemas = [
  {
    tableMeta: {
      name: 'global_configuration_ldap',
      schema: 'sqle',
      columns: {
        rows: [
          {
            CHARACTER_SET_NAME: '',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: '',
            COLUMN_KEY: 'PRI',
            COLUMN_NAME: 'id',
            COLUMN_TYPE: 'int(10) unsigned',
            EXTRA: 'auto_increment',
            IS_NULLABLE: 'NO'
          },
          {
            CHARACTER_SET_NAME: '',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: 'CURRENT_TIMESTAMP',
            COLUMN_KEY: '',
            COLUMN_NAME: 'created_at',
            COLUMN_TYPE: 'datetime',
            EXTRA: '',
            IS_NULLABLE: 'YES'
          },
          {
            CHARACTER_SET_NAME: '',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: 'CURRENT_TIMESTAMP',
            COLUMN_KEY: '',
            COLUMN_NAME: 'updated_at',
            COLUMN_TYPE: 'datetime',
            EXTRA: 'on update CURRENT_TIMESTAMP',
            IS_NULLABLE: 'YES'
          },
          {
            CHARACTER_SET_NAME: '',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: '',
            COLUMN_KEY: 'MUL',
            COLUMN_NAME: 'deleted_at',
            COLUMN_TYPE: 'datetime',
            EXTRA: '',
            IS_NULLABLE: 'YES'
          },
          {
            CHARACTER_SET_NAME: '',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: '',
            COLUMN_KEY: '',
            COLUMN_NAME: 'enable',
            COLUMN_TYPE: 'tinyint(1)',
            EXTRA: '',
            IS_NULLABLE: 'NO'
          },
          {
            CHARACTER_SET_NAME: '',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: '',
            COLUMN_KEY: '',
            COLUMN_NAME: 'enable_ssl',
            COLUMN_TYPE: 'tinyint(1)',
            EXTRA: '',
            IS_NULLABLE: 'NO'
          },
          {
            CHARACTER_SET_NAME: 'utf8mb4',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: '',
            COLUMN_KEY: '',
            COLUMN_NAME: 'host',
            COLUMN_TYPE: 'varchar(255)',
            EXTRA: '',
            IS_NULLABLE: 'NO'
          },
          {
            CHARACTER_SET_NAME: 'utf8mb4',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: '',
            COLUMN_KEY: '',
            COLUMN_NAME: 'port',
            COLUMN_TYPE: 'varchar(255)',
            EXTRA: '',
            IS_NULLABLE: 'NO'
          },
          {
            CHARACTER_SET_NAME: 'utf8mb4',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: '',
            COLUMN_KEY: '',
            COLUMN_NAME: 'connect_dn',
            COLUMN_TYPE: 'varchar(255)',
            EXTRA: '',
            IS_NULLABLE: 'NO'
          },
          {
            CHARACTER_SET_NAME: 'utf8mb4',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: '',
            COLUMN_KEY: '',
            COLUMN_NAME: 'connect_secret_password',
            COLUMN_TYPE: 'varchar(255)',
            EXTRA: '',
            IS_NULLABLE: 'NO'
          },
          {
            CHARACTER_SET_NAME: 'utf8mb4',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: '',
            COLUMN_KEY: '',
            COLUMN_NAME: 'base_dn',
            COLUMN_TYPE: 'varchar(255)',
            EXTRA: '',
            IS_NULLABLE: 'NO'
          },
          {
            CHARACTER_SET_NAME: 'utf8mb4',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: '',
            COLUMN_KEY: '',
            COLUMN_NAME: 'user_name_rdn_key',
            COLUMN_TYPE: 'varchar(255)',
            EXTRA: '',
            IS_NULLABLE: 'NO'
          },
          {
            CHARACTER_SET_NAME: 'utf8mb4',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: '',
            COLUMN_KEY: '',
            COLUMN_NAME: 'user_email_rdn_key',
            COLUMN_TYPE: 'varchar(255)',
            EXTRA: '',
            IS_NULLABLE: 'NO'
          }
        ],
        head: [
          { field_name: 'COLUMN_NAME', desc: '列名' },
          { field_name: 'COLUMN_TYPE', desc: '列类型' },
          { field_name: 'CHARACTER_SET_NAME', desc: '列字符集' },
          { field_name: 'IS_NULLABLE', desc: '是否可以为空' },
          { field_name: 'COLUMN_KEY', desc: '列索引' },
          { field_name: 'COLUMN_DEFAULT', desc: '默认值' },
          { field_name: 'EXTRA', desc: '拓展信息' },
          { field_name: 'COLUMN_COMMENT', desc: '列说明' }
        ]
      },
      indexes: {
        rows: [
          {
            Cardinality: '0',
            Column_name: 'id',
            Comment: '',
            Index_type: 'BTREE',
            Key_name: 'PRIMARY',
            Null: 'NO',
            Seq_in_index: '1',
            Unique: 'YES'
          },
          {
            Cardinality: '0',
            Column_name: 'deleted_at',
            Comment: '',
            Index_type: 'BTREE',
            Key_name: 'idx_global_configuration_ldap_deleted_at',
            Null: 'YES',
            Seq_in_index: '1',
            Unique: 'NO'
          }
        ],
        head: [
          { field_name: 'Column_name', desc: '列名' },
          { field_name: 'Key_name', desc: '索引名' },
          { field_name: 'Unique', desc: '唯一性' },
          { field_name: 'Seq_in_index', desc: '列序列' },
          { field_name: 'Cardinality', desc: '基数' },
          { field_name: 'Null', desc: '是否可以为空' },
          { field_name: 'Index_type', desc: '索引类型' },
          { field_name: 'Comment', desc: '备注' }
        ]
      },
      message: '',
      create_table_sql:
        'CREATE TABLE `global_configuration_ldap` (\n  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,\n  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,\n  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n  `deleted_at` datetime DEFAULT NULL,\n  `enable` tinyint(1) NOT NULL,\n  `enable_ssl` tinyint(1) NOT NULL,\n  `host` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `port` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `connect_dn` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `connect_secret_password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `base_dn` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `user_name_rdn_key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `user_email_rdn_key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,\n  PRIMARY KEY (`id`),\n  KEY `idx_global_configuration_ldap_deleted_at` (`deleted_at`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    },
    id: 'a-b-c',
    errorMessage: ''
  },
  {
    tableMeta: {
      name: 'execute_sql_detail',
      schema: 'sqle',
      columns: {
        rows: [
          {
            CHARACTER_SET_NAME: '',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: '',
            COLUMN_KEY: 'PRI',
            COLUMN_NAME: 'id',
            COLUMN_TYPE: 'int(10) unsigned',
            EXTRA: 'auto_increment',
            IS_NULLABLE: 'NO'
          },
          {
            CHARACTER_SET_NAME: '',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: 'CURRENT_TIMESTAMP',
            COLUMN_KEY: '',
            COLUMN_NAME: 'created_at',
            COLUMN_TYPE: 'datetime',
            EXTRA: '',
            IS_NULLABLE: 'YES'
          },
          {
            CHARACTER_SET_NAME: '',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: 'CURRENT_TIMESTAMP',
            COLUMN_KEY: '',
            COLUMN_NAME: 'updated_at',
            COLUMN_TYPE: 'datetime',
            EXTRA: 'on update CURRENT_TIMESTAMP',
            IS_NULLABLE: 'YES'
          },
          {
            CHARACTER_SET_NAME: '',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: '',
            COLUMN_KEY: 'MUL',
            COLUMN_NAME: 'deleted_at',
            COLUMN_TYPE: 'datetime',
            EXTRA: '',
            IS_NULLABLE: 'YES'
          },
          {
            CHARACTER_SET_NAME: '',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: '',
            COLUMN_KEY: 'MUL',
            COLUMN_NAME: 'task_id',
            COLUMN_TYPE: 'int(10) unsigned',
            EXTRA: '',
            IS_NULLABLE: 'YES'
          },
          {
            CHARACTER_SET_NAME: '',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: '',
            COLUMN_KEY: '',
            COLUMN_NAME: 'number',
            COLUMN_TYPE: 'int(10) unsigned',
            EXTRA: '',
            IS_NULLABLE: 'YES'
          },
          {
            CHARACTER_SET_NAME: 'utf8mb4',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: '',
            COLUMN_KEY: '',
            COLUMN_NAME: 'content',
            COLUMN_TYPE: 'longtext',
            EXTRA: '',
            IS_NULLABLE: 'YES'
          },
          {
            CHARACTER_SET_NAME: 'utf8mb4',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: '',
            COLUMN_KEY: '',
            COLUMN_NAME: 'description',
            COLUMN_TYPE: 'text',
            EXTRA: '',
            IS_NULLABLE: 'YES'
          },
          {
            CHARACTER_SET_NAME: 'utf8mb4',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: '',
            COLUMN_KEY: '',
            COLUMN_NAME: 'start_binlog_file',
            COLUMN_TYPE: 'varchar(255)',
            EXTRA: '',
            IS_NULLABLE: 'YES'
          },
          {
            CHARACTER_SET_NAME: '',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: '',
            COLUMN_KEY: '',
            COLUMN_NAME: 'start_binlog_pos',
            COLUMN_TYPE: 'bigint(20)',
            EXTRA: '',
            IS_NULLABLE: 'YES'
          },
          {
            CHARACTER_SET_NAME: 'utf8mb4',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: '',
            COLUMN_KEY: '',
            COLUMN_NAME: 'end_binlog_file',
            COLUMN_TYPE: 'varchar(255)',
            EXTRA: '',
            IS_NULLABLE: 'YES'
          },
          {
            CHARACTER_SET_NAME: '',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: '',
            COLUMN_KEY: '',
            COLUMN_NAME: 'end_binlog_pos',
            COLUMN_TYPE: 'bigint(20)',
            EXTRA: '',
            IS_NULLABLE: 'YES'
          },
          {
            CHARACTER_SET_NAME: '',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: '',
            COLUMN_KEY: '',
            COLUMN_NAME: 'row_affects',
            COLUMN_TYPE: 'bigint(20)',
            EXTRA: '',
            IS_NULLABLE: 'YES'
          },
          {
            CHARACTER_SET_NAME: 'utf8mb4',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: 'initialized',
            COLUMN_KEY: '',
            COLUMN_NAME: 'exec_status',
            COLUMN_TYPE: 'varchar(255)',
            EXTRA: '',
            IS_NULLABLE: 'YES'
          },
          {
            CHARACTER_SET_NAME: 'utf8mb4',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: '',
            COLUMN_KEY: '',
            COLUMN_NAME: 'exec_result',
            COLUMN_TYPE: 'text',
            EXTRA: '',
            IS_NULLABLE: 'YES'
          },
          {
            CHARACTER_SET_NAME: 'utf8mb4',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: 'initialized',
            COLUMN_KEY: '',
            COLUMN_NAME: 'audit_status',
            COLUMN_TYPE: 'varchar(255)',
            EXTRA: '',
            IS_NULLABLE: 'YES'
          },
          {
            CHARACTER_SET_NAME: 'utf8mb4',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: '',
            COLUMN_KEY: '',
            COLUMN_NAME: 'audit_result',
            COLUMN_TYPE: 'text',
            EXTRA: '',
            IS_NULLABLE: 'YES'
          },
          {
            CHARACTER_SET_NAME: 'utf8mb4',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: '',
            COLUMN_KEY: 'MUL',
            COLUMN_NAME: 'audit_fingerprint',
            COLUMN_TYPE: 'char(32)',
            EXTRA: '',
            IS_NULLABLE: 'YES'
          },
          {
            CHARACTER_SET_NAME: 'utf8mb4',
            COLUMN_COMMENT: '',
            COLUMN_DEFAULT: '',
            COLUMN_KEY: '',
            COLUMN_NAME: 'audit_level',
            COLUMN_TYPE: 'varchar(255)',
            EXTRA: '',
            IS_NULLABLE: 'YES'
          }
        ],
        head: [
          { field_name: 'COLUMN_NAME', desc: '列名' },
          { field_name: 'COLUMN_TYPE', desc: '列类型' },
          { field_name: 'CHARACTER_SET_NAME', desc: '列字符集' },
          { field_name: 'IS_NULLABLE', desc: '是否可以为空' },
          { field_name: 'COLUMN_KEY', desc: '列索引' },
          { field_name: 'COLUMN_DEFAULT', desc: '默认值' },
          { field_name: 'EXTRA', desc: '拓展信息' },
          { field_name: 'COLUMN_COMMENT', desc: '列说明' }
        ]
      },
      indexes: {
        rows: [
          {
            Cardinality: '3',
            Column_name: 'id',
            Comment: '',
            Index_type: 'BTREE',
            Key_name: 'PRIMARY',
            Null: 'NO',
            Seq_in_index: '1',
            Unique: 'YES'
          },
          {
            Cardinality: '1',
            Column_name: 'deleted_at',
            Comment: '',
            Index_type: 'BTREE',
            Key_name: 'idx_execute_sql_detail_deleted_at',
            Null: 'YES',
            Seq_in_index: '1',
            Unique: 'NO'
          },
          {
            Cardinality: '1',
            Column_name: 'task_id',
            Comment: '',
            Index_type: 'BTREE',
            Key_name: 'idx_execute_sql_detail_task_id',
            Null: 'YES',
            Seq_in_index: '1',
            Unique: 'NO'
          },
          {
            Cardinality: '3',
            Column_name: 'audit_fingerprint',
            Comment: '',
            Index_type: 'BTREE',
            Key_name: 'idx_execute_sql_detail_audit_fingerprint',
            Null: 'YES',
            Seq_in_index: '1',
            Unique: 'NO'
          }
        ],
        head: [
          { field_name: 'Column_name', desc: '列名' },
          { field_name: 'Key_name', desc: '索引名' },
          { field_name: 'Unique', desc: '唯一性' },
          { field_name: 'Seq_in_index', desc: '列序列' },
          { field_name: 'Cardinality', desc: '基数' },
          { field_name: 'Null', desc: '是否可以为空' },
          { field_name: 'Index_type', desc: '索引类型' },
          { field_name: 'Comment', desc: '备注' }
        ]
      },
      message: '',
      create_table_sql:
        "CREATE TABLE `execute_sql_detail` (\n  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,\n  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,\n  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n  `deleted_at` datetime DEFAULT NULL,\n  `task_id` int(10) unsigned DEFAULT NULL,\n  `number` int(10) unsigned DEFAULT NULL,\n  `content` longtext COLLATE utf8mb4_unicode_ci,\n  `description` text COLLATE utf8mb4_unicode_ci,\n  `start_binlog_file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `start_binlog_pos` bigint(20) DEFAULT NULL,\n  `end_binlog_file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `end_binlog_pos` bigint(20) DEFAULT NULL,\n  `row_affects` bigint(20) DEFAULT NULL,\n  `exec_status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'initialized',\n  `exec_result` text COLLATE utf8mb4_unicode_ci,\n  `audit_status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'initialized',\n  `audit_result` text COLLATE utf8mb4_unicode_ci,\n  `audit_fingerprint` char(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `audit_level` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  PRIMARY KEY (`id`),\n  KEY `idx_execute_sql_detail_deleted_at` (`deleted_at`),\n  KEY `idx_execute_sql_detail_task_id` (`task_id`),\n  KEY `idx_execute_sql_detail_audit_fingerprint` (`audit_fingerprint`)\n) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    },
    id: 'd-b-c',
    errorMessage: ''
  }
];

export const sqlExecPlans = [
  {
    id: 'a',
    hide: false,
    sql: 'SELECT * from tasks;',
    message: '',
    classic_result: {
      rows: [
        {
          Extra: '',
          filtered: '100.00',
          id: '1',
          key: '',
          key_len: '',
          partitions: '',
          possible_keys: '',
          ref: '',
          rows: '1',
          select_type: 'SIMPLE',
          table: 'tasks',
          type: 'ALL'
        }
      ],
      head: [
        { field_name: 'id', desc: '' },
        { field_name: 'select_type', desc: '' },
        { field_name: 'table', desc: '' },
        { field_name: 'partitions', desc: '' },
        { field_name: 'type', desc: '' },
        { field_name: 'possible_keys', desc: '' },
        { field_name: 'key', desc: '' },
        { field_name: 'key_len', desc: '' },
        { field_name: 'ref', desc: '' },
        { field_name: 'rows', desc: '' },
        { field_name: 'filtered', desc: '' },
        { field_name: 'Extra', desc: '' }
      ]
    }
  },
  {
    id: 'b',
    hide: false,
    sql: 'SELECT * from users;',
    message: '',
    classic_result: {
      rows: [
        {
          Extra: '',
          filtered: '100.00',
          id: '1',
          key: '',
          key_len: '',
          partitions: '',
          possible_keys: '',
          ref: '',
          rows: '1',
          select_type: 'SIMPLE',
          table: 'users',
          type: 'ALL'
        }
      ],
      head: [
        { field_name: 'id', desc: '' },
        { field_name: 'select_type', desc: '' },
        { field_name: 'table', desc: '' },
        { field_name: 'partitions', desc: '' },
        { field_name: 'type', desc: '' },
        { field_name: 'possible_keys', desc: '' },
        { field_name: 'key', desc: '' },
        { field_name: 'key_len', desc: '' },
        { field_name: 'ref', desc: '' },
        { field_name: 'rows', desc: '' },
        { field_name: 'filtered', desc: '' },
        { field_name: 'Extra', desc: '' }
      ]
    }
  }
];

export const AuditPlanSqlAnalyzeData = {
  sql_explain: {
    sql: sqlExecPlans[0].sql,
    classic_result: sqlExecPlans[0].classic_result,
    performance_statistics: {
      affect_rows: {
        count: 10,
        err_message: ''
      }
    }
  },
  table_metas: {
    err_message: '',
    table_meta_items: tableSchemas.map((e) => e.tableMeta)
  }
};

export const WorkflowSqlAnalyzeData = {
  sql_explain: {
    sql: sqlExecPlans[0].sql,
    classic_result: sqlExecPlans[0].classic_result,
    err_message: ''
  },
  table_metas: {
    err_message: '',
    table_meta_items: tableSchemas.map((e) => e.tableMeta)
  },
  performance_statistics: {
    affect_rows: {
      count: 10,
      err_message: ''
    }
  }
};

export const SQLManageSqlAnalyzeData = {
  sql_explain: {
    sql: sqlExecPlans[0].sql,
    classic_result: sqlExecPlans[1].classic_result,
    err_message: ''
  },
  table_metas: {
    err_message: '',
    table_meta_items: tableSchemas.map((e) => e.tableMeta)
  },
  performance_statistics: {
    affect_rows: {
      count: 10,
      err_message: ''
    }
  }
};
