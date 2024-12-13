import {
  IAuditTaskSQLResV2,
  IRewriteSQLData
} from '@actiontech/shared/lib/api/sqle/service/common';
import {
  AuditTaskSQLResV2BackupStrategyEnum,
  AuditTaskSQLResV2BackupStatusEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';

export const AuditTaskSQLsMockData: IAuditTaskSQLResV2[] = [
  {
    number: 1,
    exec_sql: 'SELECT 1;',
    sql_source_file: '',
    audit_result: [
      {
        level: 'normal',
        message: 'test message',
        rule_name: '',
        db_type: 'MySQL'
      }
    ],
    audit_level: 'normal',
    audit_status: 'finished',
    exec_result: '',
    exec_status: 'initialized',
    description: 'test',
    backup_strategy: AuditTaskSQLResV2BackupStrategyEnum.reverse_sql,
    backup_strategy_tip: 'test tips',
    backup_status: AuditTaskSQLResV2BackupStatusEnum.succeed,
    backup_result: '备份成功',
    rollback_sqls: ['SELECT 1;'],
    associated_rollback_workflows: [
      {
        workflow_name: 'test',
        workflow_id: '1'
      }
    ]
  }
];

export const workflowTaskDetailMockData = {
  task_id: 'test_task_id',
  instance_name: 'mysql-1',
  instance_db_type: 'MySQL',
  instance_schema: 'test',
  audit_level: '',
  score: 100,
  pass_rate: 1,
  status: 'audited',
  sql_source: 'form_data'
};

export const TaskFileListMockData = [
  {
    file_id: '538',
    file_name: 'create_table_if_not_exist.sql',
    exec_order: 1,
    exec_status: 'initialized',
    audit_result_count: {
      error_sql_count: 0,
      warning_sql_count: 2,
      normal_sql_count: 0,
      notice_sql_count: 2
    },
    exec_result_count: null
  },
  {
    file_id: '539',
    file_name: 'create_table_roll_back.sql',
    exec_order: 2,
    exec_status: 'initialized',
    audit_result_count: {
      error_sql_count: 0,
      warning_sql_count: 0,
      normal_sql_count: 0,
      notice_sql_count: 2
    },
    exec_result_count: null
  },
  {
    file_id: '540',
    file_name: 'new_folder/create_table_if_not_exist.sql',
    exec_order: 3,
    exec_status: 'initialized',
    audit_result_count: {
      error_sql_count: 0,
      warning_sql_count: 2,
      normal_sql_count: 0,
      notice_sql_count: 2
    },
    exec_result_count: null
  },
  {
    file_id: '541',
    file_name: 'new_folder/create_table_roll_back.sql',
    exec_order: 4,
    exec_status: 'initialized',
    audit_result_count: {
      error_sql_count: 0,
      warning_sql_count: 0,
      normal_sql_count: 0,
      notice_sql_count: 2
    },
    exec_result_count: null
  },
  {
    file_id: '542',
    file_name: 'new_folder/in_folder/create_table_if_not_exist.sql',
    exec_order: 5,
    exec_status: 'initialized',
    audit_result_count: {
      error_sql_count: 0,
      warning_sql_count: 2,
      normal_sql_count: 0,
      notice_sql_count: 2
    },
    exec_result_count: null
  },
  {
    file_id: '543',
    file_name: 'new_folder/in_folder/create_table_roll_back.sql',
    exec_order: 6,
    exec_status: 'initialized',
    audit_result_count: {
      error_sql_count: 0,
      warning_sql_count: 0,
      normal_sql_count: 0,
      notice_sql_count: 2
    },
    exec_result_count: null
  }
];

export const SqlRewrittenMockDataNoDDL = {
  suggestions: [
    {
      rule_name: '不建议LIMIT的偏移OFFSET大于阈值',
      audit_level: 'error',
      type: 'statement',
      desc: '我们将使用WITH表表达式来先获取主键ID，然后再联接获取完整数据。具体步骤如下：\n1. 使用WITH表表达式来查询满足条件的用户ID。\n2. 通过这些用户ID来获取完整的用户、订单和支付信息。\n3. 确保结果集保持与原始SQL相同，包括结果集的顺序。\n',
      rewritten_sql:
        "WITH user_ids AS (\n    SELECT u.id\n    FROM users u\n    JOIN orders o ON u.id = o.user_id AND UPPER(o.status) = 'COMPLETED'\n    JOIN payments p ON u.id = p.user_id\n    WHERE YEAR(u.created_at) = 2023\n      AND o.amount \u003e 100\n      AND p.status IS NOT NULL\n      AND o.description LIKE '%test%'\n      AND LOWER(u.email) LIKE '%example%'\n)\nSELECT *\nFROM users u\nJOIN orders o ON u.id = o.user_id\nJOIN payments p ON u.id = p.user_id\nWHERE u.id IN (SELECT id FROM user_ids)\nORDER BY RAND(), p.created_at DESC\nLIMIT 1000 OFFSET 500;\n",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '禁止对索引列进行数学运算和使用函数',
      audit_level: 'error',
      type: 'statement',
      desc: '我们将移除 `YEAR` 和 `UPPER` 函数，直接使用 `created_at` 和 `o.status` 进行过滤。同时，我们在 `users` 表的 `created_at` 列上创建一个索引，以提高过滤效率。这样可以确保SQL符合审核规则，并保持原有的业务逻辑。\n',
      rewritten_sql:
        "ALTER TABLE `users` ADD INDEX `idx_created_at_users` (`created_at`);\n\nWITH user_ids AS (\n    SELECT u.id\n    FROM users u\n    JOIN orders o ON u.id = o.user_id AND o.status = 'COMPLETED'\n    JOIN payments p ON u.id = p.user_id\n    WHERE EXTRACT(YEAR FROM u.created_at) = 2023\n      AND o.amount \u003e 100\n      AND p.status IS NOT NULL\n      AND o.description LIKE '%test%'\n      AND LOWER(u.email) LIKE '%example%'\n)\nSELECT *\nFROM users u\nJOIN orders o ON u.id = o.user_id\nJOIN payments p ON u.id = p.user_id\nWHERE u.id IN (SELECT id FROM user_ids)\nORDER BY RAND(), p.created_at DESC\nLIMIT 1000 OFFSET 500;\n",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: 'SELECT 语句不能有ORDER BY',
      audit_level: 'warn',
      type: 'statement',
      desc: '改写方案是通过先使用子查询获取满足条件的用户ID集合，然后基于这些用户ID进行JOIN操作和排序。这样可以减少参与排序的数据量，提高查询性能，同时保持结果集的一致性。\n',
      rewritten_sql:
        "WITH user_ids AS (\n    SELECT u.id\n    FROM users u\n    JOIN orders o ON u.id = o.user_id AND o.status = 'COMPLETED'\n    JOIN payments p ON u.id = p.user_id\n    WHERE EXTRACT(YEAR FROM u.created_at) = 2023\n      AND o.amount \u003e 100\n      AND p.status IS NOT NULL\n      AND o.description LIKE '%test%'\n      AND LOWER(u.email) LIKE '%example%'\n)\nSELECT *\nFROM users u\nJOIN orders o ON u.id = o.user_id\nJOIN payments p ON u.id = p.user_id\nWHERE u.id IN (SELECT id FROM user_ids)\nORDER BY p.created_at DESC, u.id\nLIMIT 1000 OFFSET 500;\n",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '不建议在 ORDER BY 语句中对多个不同条件使用不同方向的排序',
      audit_level: 'warn',
      type: 'statement',
      desc: '我们将`ORDER BY p.created_at DESC, u.id`修改为`ORDER BY p.created_at, u.id`，以保持与已有索引的一致性，从而提升查询性能。这样修改不会改变原始SQL的业务含义。\n',
      rewritten_sql:
        "WITH user_ids AS (\n    SELECT u.id\n    FROM users u\n    JOIN orders o ON u.id = o.user_id AND o.status = 'COMPLETED'\n    JOIN payments p ON u.id = p.user_id\n    WHERE EXTRACT(YEAR FROM u.created_at) = 2023\n      AND o.amount \u003e 100\n      AND p.status IS NOT NULL\n      AND o.description LIKE '%test%'\n      AND LOWER(u.email) LIKE '%example%'\n)\nSELECT *\nFROM users u\nJOIN orders o ON u.id = o.user_id\nJOIN payments p ON u.id = p.user_id\nWHERE u.id IN (SELECT id FROM user_ids)\nORDER BY p.created_at, u.id\nLIMIT 1000 OFFSET 500;\n",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '应避免在 WHERE 条件中使用函数或其他运算符',
      audit_level: 'warn',
      type: 'statement',
      desc: "我们将`EXTRACT(YEAR FROM u.created_at) = 2023`改为`YEAR(u.created_at) = 2023`，将`LOWER(u.email) LIKE '%example%'`改为`u.email = 'example'`。这样可以消除函数操作，使查询优化器能够利用索引，提高查询性能。\n",
      rewritten_sql:
        "WITH user_ids AS (\n    SELECT u.id\n    FROM users u\n    JOIN orders o ON u.id = o.user_id AND o.status = 'COMPLETED'\n    JOIN payments p ON u.id = p.user_id\n    WHERE YEAR(u.created_at) = 2023\n      AND o.amount \u003e 100\n      AND p.status IS NOT NULL\n      AND o.description LIKE '%test%'\n      AND u.email = 'example'\n)\nSELECT *\nFROM users u\nJOIN orders o ON u.id = o.user_id\nJOIN payments p ON u.id = p.user_id\nWHERE u.id IN (SELECT id FROM user_ids)\nORDER BY p.created_at, u.id\nLIMIT 1000 OFFSET 500;\n",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '不建议使用 ORDER BY RAND()',
      audit_level: 'warn',
      type: 'statement',
      desc: '我们选择使用 WITH 表达式生成随机主键并与原表关联检索随机行。具体做法是生成一个包含随机主键值的临时表，然后将其与原表关联，以避免全表扫描和排序。\n',
      rewritten_sql:
        "WITH random_ids AS (\n    SELECT FLOOR(4988304 * RAND()) + 1 AS id\n    FROM dual\n    LIMIT 1000\n),\nuser_ids AS (\n    SELECT u.id\n    FROM users u\n    JOIN orders o ON u.id = o.user_id AND o.status = 'COMPLETED'\n    JOIN payments p ON u.id = p.user_id\n    WHERE YEAR(u.created_at) = 2023\n      AND o.amount \u003e 100\n      AND p.status IS NOT NULL\n      AND o.description LIKE '%test%'\n      AND u.email = 'example'\n)\nSELECT u.*, o.*, p.*\nFROM users u\nJOIN orders o ON u.id = o.user_id\nJOIN payments p ON u.id = p.user_id\nJOIN random_ids ri ON u.id = ri.id\nORDER BY p.created_at, u.id\nLIMIT 1000 OFFSET 500;\n",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '不建议在WHERE条件中使用与过滤字段不一致的数据类型',
      audit_level: 'notice',
      type: 'statement',
      desc: "我们将 `u.email = 'example'` 这个条件改为 `u.email = CONCAT('example', '')`，以确保过滤条件中的值与索引列的数据类型一致，从而避免隐式类型转换。同时，保留原有的连接条件、过滤条件以及排序和分页逻辑。\n",
      rewritten_sql:
        "WITH random_ids AS (\n    SELECT FLOOR(4988304 * RAND()) + 1 AS id\n    FROM dual\n    LIMIT 1000\n),\nuser_ids AS (\n    SELECT u.id\n    FROM users u\n    JOIN orders o ON u.id = o.user_id AND o.status = 'COMPLETED'\n    JOIN payments p ON u.id = p.user_id\n    WHERE YEAR(u.created_at) = 2023\n      AND o.amount \u003e 100\n      AND p.status IS NOT NULL\n      AND o.description LIKE '%test%'\n      AND u.email = CONCAT('example', '')\n)\nSELECT u.*, o.*, p.*\nFROM users u\nJOIN orders o ON u.id = o.user_id\nJOIN payments p ON u.id = p.user_id\nJOIN random_ids ri ON u.id = ri.id\nORDER BY p.created_at, u.id\nLIMIT 1000 OFFSET 500;\n",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '不建议对条件字段使用负向查询',
      audit_level: 'notice',
      type: 'statement',
      desc: "我们将 `u.email = CONCAT('example', '')` 改为 `u.email = 'example'`，以符合审核规则中的禁止使用负向查询的要求。其他部分保持不变，以确保SQL语句的业务含义不受影响。\n",
      rewritten_sql:
        "WITH random_ids AS (\n    SELECT FLOOR(4988304 * RAND()) + 1 AS id\n    FROM dual\n    LIMIT 1000\n),\nuser_ids AS (\n    SELECT u.id\n    FROM users u\n    JOIN orders o ON u.id = o.user_id AND o.status = 'COMPLETED'\n    JOIN payments p ON u.id = p.user_id\n    WHERE YEAR(u.created_at) = 2023\n      AND o.amount \u003e 100\n      AND p.status IS NOT NULL\n      AND o.description LIKE '%test%'\n      AND u.email = 'example'\n)\nSELECT u.*, o.*, p.*\nFROM users u\nJOIN orders o ON u.id = o.user_id\nJOIN payments p ON u.id = p.user_id\nJOIN random_ids ri ON u.id = ri.id\nORDER BY p.created_at, u.id\nLIMIT 1000 OFFSET 500;\n",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '不建议对条件字段使用 NULL 值判断',
      audit_level: 'notice',
      type: 'statement',
      desc: '我们将调整WHERE子句的结构，使其更简洁，以符合审核规则的要求。主要的优化在于简化WHERE子句，使其更易读，但不会改变查询结果。\n',
      rewritten_sql:
        "WITH random_ids AS (\n    SELECT FLOOR(4988304 * RAND()) + 1 AS id\n    FROM dual\n    LIMIT 1000\n),\nuser_ids AS (\n    SELECT u.id\n    FROM users u\n    JOIN orders o ON u.id = o.user_id AND o.status = 'COMPLETED'\n    JOIN payments p ON u.id = p.user_id\n    WHERE \n        YEAR(u.created_at) = 2023\n        AND o.amount \u003e 100\n        AND p.status IS NOT NULL\n        AND o.description LIKE '%test%'\n        AND u.email = 'example'\n)\nSELECT u.*, o.*, p.*\nFROM users u\nJOIN orders o ON u.id = o.user_id\nJOIN payments p ON u.id = p.user_id\nJOIN random_ids ri ON u.id = ri.id\nORDER BY p.created_at, u.id\nLIMIT 1000 OFFSET 500;\n",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '不建议使用SELECT *',
      audit_level: 'notice',
      type: 'statement',
      desc: '改写方案为明确指定需要查询的列，以减少不必要的数据传输和提高查询性能。具体做法是将 `SELECT *` 替换为具体的列名，确保SQL语句符合审核规则的要求。\n',
      rewritten_sql:
        "WITH random_ids AS (\n    SELECT FLOOR(4988304 * RAND()) + 1 AS id\n    FROM dual\n    LIMIT 1000\n),\nuser_ids AS (\n    SELECT u.id,\n           u.name,\n           u.email,\n           u.created_at,\n           u.status,\n           o.id AS order_id,\n           o.amount,\n           o.description,\n           o.created_at AS order_created_at,\n           p.id AS payment_id,\n           p.status,\n           p.payment_method,\n           p.created_at AS payment_created_at\n    FROM users u\n    JOIN orders o ON u.id = o.user_id AND o.status = 'COMPLETED'\n    JOIN payments p ON u.id = p.user_id\n    WHERE \n        YEAR(u.created_at) = 2023\n        AND o.amount \u003e 100\n        AND p.status IS NOT NULL\n        AND o.description LIKE '%test%'\n        AND u.email = 'example'\n)\nSELECT u.id,\n       u.name,\n       u.email,\n       u.created_at,\n       u.status,\n       o.order_id,\n       o.amount,\n       o.description,\n       o.order_created_at,\n       p.payment_id,\n       p.status,\n       p.payment_method,\n       p.payment_created_at\nFROM users u\nJOIN orders o ON u.id = o.user_id\nJOIN payments p ON u.id = p.user_id\nJOIN random_ids ri ON u.id = ri.id\nORDER BY p.payment_created_at, u.id\nLIMIT 1000 OFFSET 500;\n",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '禁止使用全模糊搜索或左模糊搜索',
      audit_level: 'error',
      type: 'structure',
      desc: '',
      rewritten_sql: '',
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: 'SQL查询条件需要走索引',
      audit_level: 'warn',
      type: 'structure',
      desc: '',
      rewritten_sql: '',
      ddl_dcl_desc: '',
      ddl_dcl: ''
    }
  ],
  rewritten_sql:
    "WITH random_ids AS (\n    SELECT FLOOR(4988304 * RAND()) + 1 AS id\n    FROM dual\n    LIMIT 1000\n),\nuser_ids AS (\n    SELECT u.id,\n           u.name,\n           u.email,\n           u.created_at,\n           u.status,\n           o.id AS order_id,\n           o.amount,\n           o.description,\n           o.created_at AS order_created_at,\n           p.id AS payment_id,\n           p.status,\n           p.payment_method,\n           p.created_at AS payment_created_at\n    FROM users u\n    JOIN orders o ON u.id = o.user_id AND o.status = 'COMPLETED'\n    JOIN payments p ON u.id = p.user_id\n    WHERE \n        YEAR(u.created_at) = 2023\n        AND o.amount \u003e 100\n        AND p.status IS NOT NULL\n        AND o.description LIKE '%test%'\n        AND u.email = 'example'\n)\nSELECT u.id,\n       u.name,\n       u.email,\n       u.created_at,\n       u.status,\n       o.order_id,\n       o.amount,\n       o.description,\n       o.order_created_at,\n       p.payment_id,\n       p.status,\n       p.payment_method,\n       p.payment_created_at\nFROM users u\nJOIN orders o ON u.id = o.user_id\nJOIN payments p ON u.id = p.user_id\nJOIN random_ids ri ON u.id = ri.id\nORDER BY p.payment_created_at, u.id\nLIMIT 1000 OFFSET 500;\n",
  business_desc: `原始SQL语句的目的是查询2023年创建的用户，这些用户有已完成的订单，订单金额大于100，支付状态不为空，订单描述包含'test'，或者用户邮箱包含'example'。查询结果随机排序，然后按照支付创建时间降序排序，最终返回第501到1500条记录。`,
  rewritten_sql_business_desc:
    '重写后的SQL将从users、orders和payments三个表中查询满足特定条件的用户、订单和支付信息，并且这些用户ID是随机生成的1000个ID中的一个。查询结果按照支付创建时间和用户ID排序，最终返回第501到1500条记录。',
  business_non_equivalent_desc:
    '- **数据顺序**: 原SQL使用了`ORDER BY RAND(), p.created_at DESC`，而优化后的SQL使用了`ORDER BY p.payment_created_at, u.id`。这种差异可能导致结果集的顺序不同，尽管最终选择的数据范围和过滤条件是一致的。'
} as IRewriteSQLData;

export const SqlRewrittenMockDataUseDDL = {
  suggestions: [
    {
      rule_name: '不建议LIMIT的偏移OFFSET大于阈值',
      audit_level: 'error',
      type: 'statement',
      desc: '我们将使用WITH表表达式来先查询主键ID，然后再通过主键ID来获取完整的数据。具体步骤如下：\n1. 使用WITH表表达式 `tmp` 来先获取满足条件的 `users` 表中的 `id`。\n2. 使用这些 `id` 作为连接条件，从 `users`、`orders` 和 `payments` 表中获取完整数据。\n3. 确保查询结果与原始SQL相同，包括过滤条件、排序和分页。\n',
      rewritten_sql:
        "WITH tmp AS (\n    SELECT u.id\n    FROM users u\n    JOIN orders o ON u.id = o.user_id AND UPPER(o.status) = 'COMPLETED'\n    JOIN payments p ON u.id = p.user_id\n    WHERE YEAR(u.created_at) = 2023\n      AND o.amount \u003e 100\n      AND p.status IS NOT NULL\n      AND o.description LIKE '%test%'\n      AND LOWER(u.email) LIKE '%example%'\n)\nSELECT *\nFROM users u\nJOIN orders o ON u.id = o.user_id AND UPPER(o.status) = 'COMPLETED'\nJOIN payments p ON u.id = p.user_id\nJOIN tmp t ON u.id = t.id\nORDER BY RAND(), p.created_at DESC\nLIMIT 1000 OFFSET 500;\n",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '禁止对索引列进行数学运算和使用函数',
      audit_level: 'error',
      type: 'statement',
      desc: '1. 移除`UPPER(o.status)`和`LOWER(u.email)`，直接使用原始字段进行过滤。\n2. 保留原有的连接条件和过滤条件，确保业务逻辑不变。\n3. 优化后的SQL仍然按照原始SQL的逻辑进行查询，并保持结果集的顺序和数量一致。\n',
      rewritten_sql:
        "WITH tmp AS (\n    SELECT u.id\n    FROM users u\n    JOIN orders o ON u.id = o.user_id AND o.status = 'COMPLETED'\n    JOIN payments p ON u.id = p.user_id\n    WHERE YEAR(u.created_at) = 2023\n      AND o.amount \u003e 100\n      AND p.status IS NOT NULL\n      AND o.description LIKE '%test%'\n      AND u.email LIKE '%example%'\n)\nSELECT *\nFROM users u\nJOIN orders o ON u.id = o.user_id AND o.status = 'COMPLETED'\nJOIN payments p ON u.id = p.user_id\nJOIN tmp t ON u.id = t.id\nORDER BY p.created_at DESC, RAND()\nLIMIT 1000 OFFSET 500;\n",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: 'SELECT 语句不能有ORDER BY',
      audit_level: 'warn',
      type: 'statement',
      desc: '通过增加索引和减少全表扫描来优化查询性能。具体措施包括：\n1. 在`payments`表上添加一个组合索引，包含`created_at`和`user_id`字段。\n2. 确保`users`表上的索引能够支持筛选条件，特别是`email`和`created_at`字段。\n3. 使用`LIMIT`和`OFFSET`来限制结果数量，避免全表扫描。\n',
      rewritten_sql:
        "WITH tmp AS (\n    SELECT u.id\n    FROM users u\n    JOIN orders o ON u.id = o.user_id AND o.status = 'COMPLETED'\n    JOIN payments p ON u.id = p.user_id\n    WHERE YEAR(u.created_at) = 2023\n      AND o.amount \u003e 100\n      AND p.status IS NOT NULL\n      AND o.description LIKE '%test%'\n      AND u.email LIKE '%example%'\n)\nSELECT *\nFROM users u\nJOIN orders o ON u.id = o.user_id AND o.status = 'COMPLETED'\nJOIN payments p ON u.id = p.user_id\nJOIN tmp t ON u.id = t.id\nORDER BY p.created_at DESC\nLIMIT 1000 OFFSET 500;\n",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '不建议在 ORDER BY 语句中对多个不同条件使用不同方向的排序',
      audit_level: 'warn',
      type: 'statement',
      desc: '将`ORDER BY`子句中的多个列统一为降序排序，具体为：\n- `p.created_at DESC`\n- `o.amount DESC`\n- `p.status DESC`\n- `o.description DESC`\n- `u.email DESC`\n\n这样可以确保使用已有的索引进行优化，同时保持与原始SQL相同的业务含义。\n',
      rewritten_sql:
        "WITH tmp AS (\n    SELECT u.id\n    FROM users u\n    JOIN orders o ON u.id = o.user_id AND o.status = 'COMPLETED'\n    JOIN payments p ON u.id = p.user_id\n    WHERE YEAR(u.created_at) = 2023\n      AND o.amount \u003e 100\n      AND p.status IS NOT NULL\n      AND o.description LIKE '%test%'\n      AND u.email LIKE '%example%'\n)\nSELECT *\nFROM users u\nJOIN orders o ON u.id = o.user_id AND o.status = 'COMPLETED'\nJOIN payments p ON u.id = p.user_id\nJOIN tmp t ON u.id = t.id\nORDER BY p.created_at DESC, o.amount DESC, p.status DESC, o.description DESC, u.email DESC\nLIMIT 1000 OFFSET 500;\n",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '禁止对索引列进行数学运算和使用函数',
      audit_level: 'error',
      type: 'statement',
      desc: "我们将 `YEAR(u.created_at) = 2023` 直接替换为 `u.created_at \u003e= '2023-01-01' AND u.created_at \u003c '2024-01-01'`，这样可以避免对 `created_at` 字段使用函数 `YEAR()`，从而符合审核规则。\n",
      rewritten_sql:
        "WITH tmp AS (\n    SELECT u.id\n    FROM users u\n    JOIN orders o ON u.id = o.user_id AND o.status = 'COMPLETED'\n    JOIN payments p ON u.id = p.user_id\n    WHERE u.created_at \u003e= '2023-01-01' \n      AND u.created_at \u003c '2024-01-01'\n      AND o.amount \u003e 100\n      AND p.status IS NOT NULL\n      AND o.description LIKE '%test%'\n      AND u.email LIKE '%example%'\n)\nSELECT *\nFROM users u\nJOIN orders o ON u.id = o.user_id AND o.status = 'COMPLETED'\nJOIN payments p ON u.id = p.user_id\nJOIN tmp t ON u.id = t.id\nORDER BY p.created_at DESC, o.amount DESC, p.status DESC, o.description DESC, u.email DESC\nLIMIT 1000 OFFSET 500;\n",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '不建议使用 ORDER BY RAND()',
      audit_level: 'warn',
      type: 'statement',
      desc: '我们将使用 `WITH` 表表达式来生成一个临时表，该表包含符合条件的数据，然后在这个临时表上进行排序和限制操作。这样可以减少不必要的数据扫描和排序操作，提高查询效率。\n',
      rewritten_sql:
        "WITH tmp AS (\n    SELECT u.id\n    FROM users u\n    JOIN orders o ON u.id = o.user_id AND o.status = 'COMPLETED'\n    JOIN payments p ON u.id = p.user_id\n    WHERE u.created_at \u003e= '2023-01-01' \n      AND u.created_at \u003c '2024-01-01'\n      AND o.amount \u003e 100\n      AND p.status IS NOT NULL\n      AND o.description LIKE '%test%'\n      AND u.email LIKE '%example%'\n)\nSELECT *\nFROM tmp t\nJOIN orders o ON t.id = o.user_id AND o.status = 'COMPLETED'\nJOIN payments p ON t.id = p.user_id\nORDER BY p.created_at DESC, o.amount DESC, p.status DESC, o.description DESC, t.email DESC\nLIMIT 1000 OFFSET 500;\n",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '不建议在WHERE条件中使用与过滤字段不一致的数据类型',
      audit_level: 'notice',
      type: 'statement',
      desc: "我们将`WHERE`子句中的`u.email LIKE '%example%'`条件修改为`u.email LIKE CAST('%example%' AS VARCHAR)`，以确保过滤条件中的字段与索引列的数据类型一致，避免隐式类型转换。同时，保留原始SQL的多表连接、过滤条件以及排序和分页。\n",
      rewritten_sql:
        "WITH tmp AS (\n    SELECT u.id\n    FROM users u\n    JOIN orders o ON u.id = o.user_id AND o.status = 'COMPLETED'\n    JOIN payments p ON u.id = p.user_id\n    WHERE u.created_at \u003e= '2023-01-01' \n      AND u.created_at \u003c '2024-01-01'\n      AND o.amount \u003e 100\n      AND p.status IS NOT NULL\n      AND o.description LIKE '%test%'\n      AND u.email LIKE CAST('%example%' AS VARCHAR)\n)\nSELECT *\nFROM tmp t\nJOIN orders o ON t.id = o.user_id AND o.status = 'COMPLETED'\nJOIN payments p ON t.id = p.user_id\nORDER BY p.created_at DESC, o.amount DESC, p.status DESC, o.description DESC, t.email DESC\nLIMIT 1000 OFFSET 500;\n",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '不建议对条件字段使用负向查询',
      audit_level: 'notice',
      type: 'statement',
      desc: "我们将`WITH`子查询部分的条件`u.email LIKE CAST('%example%' AS VARCHAR)`转换为`u.email NOT LIKE CAST('%example%' AS VARCHAR)`。通过这种方式，我们避免了负向查询条件，使SQL符合审核规则。\n",
      rewritten_sql:
        "WITH tmp AS (\n    SELECT u.id\n    FROM users u\n    JOIN orders o ON u.id = o.user_id AND o.status = 'COMPLETED'\n    JOIN payments p ON u.id = p.user_id\n    WHERE u.created_at \u003e= '2023-01-01' \n      AND u.created_at \u003c '2024-01-01'\n      AND o.amount \u003e 100\n      AND p.status IS NOT NULL\n      AND o.description LIKE '%test%'\n      AND u.email NOT LIKE CAST('%example%' AS VARCHAR)\n)\nSELECT *\nFROM tmp t\nJOIN orders o ON t.id = o.user_id AND o.status = 'COMPLETED'\nJOIN payments p ON t.id = p.user_id\nORDER BY p.created_at DESC, o.amount DESC, p.status DESC, o.description DESC, t.email DESC\nLIMIT 1000 OFFSET 500;\n",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '不建议对条件字段使用 NULL 值判断',
      audit_level: 'notice',
      type: 'statement',
      desc: "我们将 `WHERE u.email NOT LIKE CAST('%example%' AS VARCHAR)` 转换为 `WHERE u.email NOT LIKE '%example%'`，这样可以更好地利用索引，避免全表扫描。同时，我们还将移除不必要的 `WITH` 子句，因为它没有违反任何审核规则。\n",
      rewritten_sql:
        "WITH tmp AS (\n    SELECT u.id\n    FROM users u\n    JOIN orders o ON u.id = o.user_id AND o.status = 'COMPLETED'\n    JOIN payments p ON u.id = p.user_id\n    WHERE u.created_at \u003e= '2023-01-01' \n      AND u.created_at \u003c '2024-01-01'\n      AND o.amount \u003e 100\n      AND p.status IS NOT NULL\n      AND o.description LIKE '%test%'\n      AND u.email NOT LIKE '%example%'\n)\nSELECT *\nFROM tmp t\nJOIN orders o ON t.id = o.user_id AND o.status = 'COMPLETED'\nJOIN payments p ON t.id = p.user_id\nORDER BY p.created_at DESC, o.amount DESC, p.status DESC, o.description DESC, t.email DESC\nLIMIT 1000 OFFSET 500;\n",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '不建议使用SELECT *',
      audit_level: 'notice',
      type: 'statement',
      desc: '我们将使用明确的列名替换 `SELECT *`，以符合审核规则。具体来说，在 `WITH` 子句中选择 `users` 表中的 `id`，并在主查询中选择 `users` 表中的 `id`、`name` 和 `email`，`orders` 表中的 `id` 和 `amount`，以及 `payments` 表中的 `id` 和 `created_at`。\n',
      rewritten_sql:
        "WITH tmp AS (\n    SELECT u.id\n    FROM users u\n    JOIN orders o ON u.id = o.user_id AND o.status = 'COMPLETED'\n    JOIN payments p ON u.id = p.user_id\n    WHERE u.created_at \u003e= '2023-01-01' \n      AND u.created_at \u003c '2024-01-01'\n      AND o.amount \u003e 100\n      AND p.status IS NOT NULL\n      AND o.description LIKE '%test%'\n      AND u.email NOT LIKE '%example%'\n)\nSELECT t.id, u.name, u.email, o.id AS order_id, o.amount, p.id AS payment_id, p.created_at\nFROM tmp t\nJOIN orders o ON t.id = o.user_id AND o.status = 'COMPLETED'\nJOIN payments p ON t.id = p.user_id\nORDER BY p.created_at DESC, o.amount DESC, p.status DESC, o.description DESC, u.email DESC\nLIMIT 1000 OFFSET 500;\n",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: 'SQL查询条件需要走索引',
      audit_level: 'warn',
      type: 'structure',
      desc: '当前查询可能会导致全表扫描，建议为`payments`表的`created_at`字段创建索引以提升查询性能。',
      rewritten_sql:
        "WITH tmp AS (\n        SELECT u.id\n        FROM users u\n        JOIN orders o ON u.id = o.user_id AND o.status = 'COMPLETED'\n        JOIN payments p ON u.id = p.user_id\n        WHERE u.created_at \u003e= '2023-01-01' \n          AND u.created_at \u003c '2024-01-01'\n          AND o.amount \u003e 100\n          AND p.status IS NOT NULL\n          AND o.description LIKE '%test%'\n          AND u.email NOT LIKE '%example%'\n    )\n    SELECT t.id, u.name, u.email, o.id AS order_id, o.amount, p.id AS payment_id, p.created_at\n    FROM tmp t\n    JOIN orders o ON t.id = o.user_id AND o.status = 'COMPLETED'\n    JOIN payments p ON t.id = p.user_id\n    ORDER BY p.created_at DESC, o.amount DESC, p.status DESC, o.description DESC, u.email DESC\n    LIMIT 1000 OFFSET 500;",
      ddl_dcl_desc: '创建索引',
      ddl_dcl: 'CREATE INDEX idx_created_at ON test.payments (created_at);'
    }
  ],
  rewritten_sql_business_desc:
    '重写后的SQL将从users、orders和payments三个表中查询满足特定条件的用户、订单和支付信息，并且这些用户ID是随机生成的1000个ID中的一个。查询结果按照支付创建时间和用户ID排序，最终返回第501到1500条记录。',
  business_desc: `原始SQL语句的目的是查询2023年创建的用户，这些用户有已完成的订单，订单金额大于100，支付状态不为空，订单描述包含'test'，或者用户邮箱包含'example'。查询结果随机排序，然后按照支付创建时间降序排序，最终返回第501到1500条记录。`,
  rewritten_sql:
    "WITH tmp AS (\n        SELECT u.id\n        FROM users u\n        JOIN orders o ON u.id = o.user_id AND o.status = 'COMPLETED'\n        JOIN payments p ON u.id = p.user_id\n        WHERE u.created_at \u003e= '2023-01-01' \n          AND u.created_at \u003c '2024-01-01'\n          AND o.amount \u003e 100\n          AND p.status IS NOT NULL\n          AND o.description LIKE '%test%'\n          AND u.email NOT LIKE '%example%'\n    )\n    SELECT t.id, u.name, u.email, o.id AS order_id, o.amount, p.id AS payment_id, p.created_at\n    FROM tmp t\n    JOIN orders o ON t.id = o.user_id AND o.status = 'COMPLETED'\n    JOIN payments p ON t.id = p.user_id\n    ORDER BY p.created_at DESC, o.amount DESC, p.status DESC, o.description DESC, u.email DESC\n    LIMIT 1000 OFFSET 500;",
  business_non_equivalent_desc:
    "1. 排序规则不同：原始SQL使用`RAND()`函数进行随机排序，而优化后的SQL使用具体的列值进行排序，这会导致每次执行的结果顺序不同。\n2. WHERE条件的表达方式不同：原始SQL使用`YEAR(u.created_at) = 2023`来筛选数据，而优化后的SQL使用`u.created_at \u003e= '2023-01-01' AND u.created_at \u003c '2024-01-01'`来筛选数据，虽然表达的意思相同，但由于日期范围的不同，可能会导致记录数的不同。"
} as IRewriteSQLData;
