import {
  IDatabaseComparisonStatements,
  IDatabaseDiffModifySQL,
  ISchemaObject
} from '@actiontech/shared/lib/api/sqle/service/common';

export const getComparisonStatementMockData = {
  base_sql: {
    sql_statement:
      "CREATE TABLE `task` (\n  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,\n  `title` varchar(255) NOT NULL DEFAULT '',\n  `description` text,\n  `status` enum('pending','completed') NOT NULL DEFAULT 'pending',\n  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`)\n) ENGINE=InnoDB DEFAULT CHARSET=latin1",
    audit_results: [
      {
        level: 'error',
        message: '新建表建议加入 IF NOT EXISTS，保证重复执行不报错',
        rule_name: 'ddl_check_table_without_if_not_exists',
        db_type: 'MySQL',
        i18n_audit_result_info: {
          en: {
            Message:
              'Suggest adding IF NOT EXISTS when creating a new table to ensure that repeated execution does not cause errors'
          },
          zh: {
            Message: '新建表建议加入 IF NOT EXISTS，保证重复执行不报错'
          }
        }
      },
      {
        level: 'warn',
        message: '建议建表DDL包含CREATE_TIME字段且默认值为CURRENT_TIMESTAMP',
        rule_name: 'ddl_check_create_time_column',
        db_type: 'MySQL',
        i18n_audit_result_info: {
          en: {
            Message:
              'It is recommended that the table DDL include CREATE_TIME field and the default value is CURRENT_TIMESTAMP'
          },
          zh: {
            Message: '建议建表DDL包含CREATE_TIME字段且默认值为CURRENT_TIMESTAMP'
          }
        }
      }
    ]
  }
} as IDatabaseComparisonStatements;

export const executeDatabaseComparisonMockData = [
  {
    base_schema_name: 'test',
    comparison_schema_name: 'test',
    comparison_result: 'same',
    database_diff_objects: [
      {
        inconsistent_num: 0,
        object_type: 'TABLE',
        objects_diff_result: [
          { comparison_result: 'same', object_name: 'task' }
        ]
      }
    ],
    inconsistent_num: 0
  },
  {
    base_schema_name: 'test2',
    comparison_schema_name: 'test2',
    comparison_result: 'same',
    database_diff_objects: [
      {
        inconsistent_num: 0,
        object_type: 'TABLE',
        objects_diff_result: [
          { comparison_result: 'same', object_name: 'task' }
        ]
      }
    ],
    inconsistent_num: 0
  },
  {
    base_schema_name: 'test3',
    comparison_schema_name: '',
    comparison_result: 'comparison_not_exist',
    database_diff_objects: [
      {
        inconsistent_num: 2,
        object_type: 'TABLE',
        objects_diff_result: [
          { comparison_result: 'comparison_not_exist', object_name: 'task' },
          {
            comparison_result: 'comparison_not_exist',
            object_name: 'task_copy'
          }
        ]
      }
    ],
    inconsistent_num: 2
  }
] as ISchemaObject[];

export const genDatabaseDiffModifySQLsMockData = [
  {
    schema_name: 'test',
    modify_sqls: [
      {
        sql_statement: 'USE test;\n',
        audit_results: []
      },
      {
        sql_statement:
          "CREATE TABLE `task` (\n  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,\n  `title` varchar(255) NOT NULL DEFAULT '',\n  `description` text,\n  `status` enum('pending','completed') NOT NULL DEFAULT 'pending',\n  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`)\n) ENGINE=InnoDB DEFAULT CHARSET=latin1;\n",
        audit_results: [
          {
            level: 'error',
            message: '新建表建议加入 IF NOT EXISTS，保证重复执行不报错',
            rule_name: 'ddl_check_table_without_if_not_exists',
            db_type: 'MySQL',
            i18n_audit_result_info: {
              en: {
                Message:
                  'Suggest adding IF NOT EXISTS when creating a new table to ensure that repeated execution does not cause errors'
              },
              zh: {
                Message: '新建表建议加入 IF NOT EXISTS，保证重复执行不报错'
              }
            }
          }
        ]
      }
    ]
  },
  {
    schema_name: 'test2',
    modify_sqls: [
      {
        sql_statement:
          'CREATE DATABASE `test2` CHARACTER SET latin1 COLLATE latin1_swedish_ci;\nUSE `test2`;\n',
        audit_results: []
      },
      {
        sql_statement:
          "CREATE TABLE `task` (\n  `id` int(11) NOT NULL AUTO_INCREMENT,\n  `title` varchar(255) NOT NULL,\n  `description` text,\n  `status` enum('pending','completed') NOT NULL DEFAULT 'pending',\n  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`)\n) ENGINE=InnoDB DEFAULT CHARSET=latin1;\n",
        audit_results: [
          {
            level: 'error',
            message: 'schema  不存在',
            rule_name: '',
            db_type: 'MySQL',
            i18n_audit_result_info: {
              en: {
                Message: 'Schema  does not exist.'
              },
              zh: {
                Message: 'schema  不存在'
              }
            }
          },
          {
            level: 'error',
            message: '除了自增列及大字段列之外，每个列都必须添加默认值',
            rule_name: 'ddl_check_column_without_default',
            db_type: 'MySQL',
            i18n_audit_result_info: {
              en: {
                Message:
                  'Except for auto-increment column and large field column, each column must add default value'
              },
              zh: {
                Message: '除了自增列及大字段列之外，每个列都必须添加默认值'
              }
            }
          },
          {
            level: 'error',
            message: '主键建议使用 BIGINT 无符号类型，即 BIGINT UNSIGNED',
            rule_name: 'ddl_check_pk_without_bigint_unsigned',
            db_type: 'MySQL',
            i18n_audit_result_info: {
              en: {
                Message:
                  'Suggest using BIGINT unsigned type for primary key, i.e. BIGINT UNSIGNED'
              },
              zh: {
                Message: '主键建议使用 BIGINT 无符号类型，即 BIGINT UNSIGNED'
              }
            }
          },
          {
            level: 'error',
            message: '新建表建议加入 IF NOT EXISTS，保证重复执行不报错',
            rule_name: 'ddl_check_table_without_if_not_exists',
            db_type: 'MySQL',
            i18n_audit_result_info: {
              en: {
                Message:
                  'Suggest adding IF NOT EXISTS when creating a new table to ensure that repeated execution does not cause errors'
              },
              zh: {
                Message: '新建表建议加入 IF NOT EXISTS，保证重复执行不报错'
              }
            }
          }
        ]
      }
    ]
  },
  {
    schema_name: 'test3',
    modify_sqls: [
      {
        sql_statement:
          'CREATE DATABASE `test3` CHARACTER SET latin1 COLLATE latin1_swedish_ci;\nUSE `test3`;\n',
        audit_results: []
      },
      {
        sql_statement:
          "CREATE TABLE `task` (\n  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,\n  `title` varchar(255) NOT NULL DEFAULT '',\n  `description` text,\n  `status` enum('pending','completed') NOT NULL DEFAULT 'pending',\n  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`)\n) ENGINE=InnoDB DEFAULT CHARSET=latin1;\n",
        audit_results: [
          {
            level: 'error',
            message: 'schema  不存在',
            rule_name: '',
            db_type: 'MySQL',
            i18n_audit_result_info: {
              en: {
                Message: 'Schema  does not exist.'
              },
              zh: {
                Message: 'schema  不存在'
              }
            }
          },
          {
            level: 'error',
            message: '新建表建议加入 IF NOT EXISTS，保证重复执行不报错',
            rule_name: 'ddl_check_table_without_if_not_exists',
            db_type: 'MySQL',
            i18n_audit_result_info: {
              en: {
                Message:
                  'Suggest adding IF NOT EXISTS when creating a new table to ensure that repeated execution does not cause errors'
              },
              zh: {
                Message: '新建表建议加入 IF NOT EXISTS，保证重复执行不报错'
              }
            }
          }
        ]
      },
      {
        sql_statement:
          "CREATE TABLE `task_copy` (\n  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,\n  `title` varchar(255) NOT NULL DEFAULT '',\n  `description` text,\n  `status` enum('pending','completed') NOT NULL DEFAULT 'pending',\n  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`)\n) ENGINE=InnoDB DEFAULT CHARSET=latin1;\n",
        audit_results: [
          {
            level: 'error',
            message: 'schema  不存在',
            rule_name: '',
            db_type: 'MySQL',
            i18n_audit_result_info: {
              en: {
                Message: 'Schema  does not exist.'
              },
              zh: {
                Message: 'schema  不存在'
              }
            }
          },
          {
            level: 'error',
            message: '新建表建议加入 IF NOT EXISTS，保证重复执行不报错',
            rule_name: 'ddl_check_table_without_if_not_exists',
            db_type: 'MySQL',
            i18n_audit_result_info: {
              en: {
                Message:
                  'Suggest adding IF NOT EXISTS when creating a new table to ensure that repeated execution does not cause errors'
              },
              zh: {
                Message: '新建表建议加入 IF NOT EXISTS，保证重复执行不报错'
              }
            }
          }
        ]
      }
    ]
  }
] as IDatabaseDiffModifySQL[];
