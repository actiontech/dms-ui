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
  business_desc: `原始SQL语句的目的是查询2023年创建的用户，这些用户有已完成的订单，订单金额大于100，支付状态不为空，订单描述包含'test'，或者用户邮箱包含'example'。查询结果随机排序，然后按照支付创建时间降序排序，最终返回第501到1500条记录。`,
  rewritten_sql:
    "WITH tmp AS (\n        SELECT u.id\n        FROM users u\n        JOIN orders o ON u.id = o.user_id AND o.status = 'COMPLETED'\n        JOIN payments p ON u.id = p.user_id\n        WHERE u.created_at \u003e= '2023-01-01' \n          AND u.created_at \u003c '2024-01-01'\n          AND o.amount \u003e 100\n          AND p.status IS NOT NULL\n          AND o.description LIKE '%test%'\n          AND u.email NOT LIKE '%example%'\n    )\n    SELECT t.id, u.name, u.email, o.id AS order_id, o.amount, p.id AS payment_id, p.created_at\n    FROM tmp t\n    JOIN orders o ON t.id = o.user_id AND o.status = 'COMPLETED'\n    JOIN payments p ON t.id = p.user_id\n    ORDER BY p.created_at DESC, o.amount DESC, p.status DESC, o.description DESC, u.email DESC\n    LIMIT 1000 OFFSET 500;",
  business_non_equivalent_desc:
    "1. 排序规则不同：原始SQL使用`RAND()`函数进行随机排序，而优化后的SQL使用具体的列值进行排序，这会导致每次执行的结果顺序不同。\n2. WHERE条件的表达方式不同：原始SQL使用`YEAR(u.created_at) = 2023`来筛选数据，而优化后的SQL使用`u.created_at \u003e= '2023-01-01' AND u.created_at \u003c '2024-01-01'`来筛选数据，虽然表达的意思相同，但由于日期范围的不同，可能会导致记录数的不同。"
} as IRewriteSQLData;

export const SqlRewrittenMockDataWithLogic = {
  business_desc:
    '此SQL查询旨在获取2023年注册的用户，其中订单金额超过100，支付状态不为空，订单描述包含"test"，并且邮箱地址包含"example"。最终结果将根据随机数和支付创建时间降序排列，并限制返回1000条记录，跳过前500条。\n',
  logic_desc:
    '1. 基础表选择：\n   - 从users表开始，作为主表\n   - 通过JOIN连接orders表获取订单信息\n   - 通过JOIN连接payments表获取支付信息\n\n2. 数据筛选条件：\n   - 用户注册时间限制：created_at在2023年\n   - 订单金额限制：amount大于100\n   - 支付状态不为空：p.status IS NOT NULL\n   - 订单描述包含"test"：o.description LIKE \'%test%\'\n   - 邮箱地址包含"example"：LOWER(u.email) LIKE \'%example%\'\n\n3. 连接条件：\n   - users表和orders表通过user_id关联\n   - users表和payments表通过user_id关联\n\n4. 结果排序：\n   - 首先使用ORDER BY RAND()进行随机排序\n   - 然后根据支付创建时间降序排列：p.created_at DESC\n\n5. 结果限制：\n   - LIMIT 1000 OFFSET 500：跳过前500条记录，返回接下来的1000条记录\n',
  suggestions: [
    {
      rule_name: '不建议LIMIT的偏移OFFSET大于阈值',
      audit_level: 'error',
      type: 'statement',
      desc: '我们将使用WITH表表达式先查询主键ID，再联接获取完整数据。具体步骤如下：\n1. 使用WITH表表达式提取符合条件的用户ID。\n2. 使用提取的用户ID进行关联查询，获取完整的用户、订单和支付信息。\n3. 确保查询结果与原SQL一致，包括结果集的顺序。\n',
      rewritten_sql:
        "WITH user_ids AS (\n    SELECT u.id\n    FROM users u\n    JOIN orders o ON u.id = o.user_id AND UPPER(o.status) = 'COMPLETED'\n    JOIN payments p ON u.id = p.user_id\n    WHERE YEAR(u.created_at) = 2023\n    AND o.amount \u003e 100\n    AND p.status IS NOT NULL\n    AND o.description LIKE '%test%'\n    OR LOWER(u.email) LIKE '%example%'\n)\nSELECT *\nFROM users u\nJOIN orders o ON u.id = o.user_id\nJOIN payments p ON u.id = p.user_id\nWHERE u.id IN (SELECT id FROM user_ids)\nORDER BY RAND(), p.created_at DESC\nLIMIT 1000 OFFSET 500;\n",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '应避免在 WHERE 条件中使用函数或其他运算符',
      audit_level: 'warn',
      type: 'statement',
      desc: "我们将`user_ids`子查询中的`LOWER(u.email) LIKE '%example%'`替换为`u.email LIKE '%example%'`，以消除函数操作，符合审核规则的要求。同时，我们保留了原有的业务逻辑，确保查询结果不变。\n",
      rewritten_sql:
        "WITH user_ids AS (\n    SELECT u.id\n    FROM users u\n    JOIN orders o ON u.id = o.user_id AND UPPER(o.status) = 'COMPLETED'\n    JOIN payments p ON u.id = p.user_id\n    WHERE YEAR(u.created_at) = 2023\n    AND o.amount \u003e 100\n    AND p.status IS NOT NULL\n    AND o.description LIKE '%test%'\n    AND u.email LIKE '%example%'\n)\nSELECT *\nFROM users u\nJOIN orders o ON u.id = o.user_id\nJOIN payments p ON u.id = p.user_id\nWHERE u.id IN (SELECT id FROM user_ids)\nORDER BY RAND(), p.created_at DESC\nLIMIT 1000 OFFSET 500;\n",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: 'SELECT 语句不能有ORDER BY',
      audit_level: 'warn',
      type: 'statement',
      desc: '我们将移除 `ORDER BY RAND()` 和 `ORDER BY p.created_at DESC` 的排序操作，并使用 `LIMIT` 和 `OFFSET` 来控制返回的记录数量。这将减少全表扫描，提高查询性能。\n',
      rewritten_sql:
        "WITH user_ids AS (\n    SELECT u.id\n    FROM users u\n    JOIN orders o ON u.id = o.user_id AND UPPER(o.status) = 'COMPLETED'\n    JOIN payments p ON u.id = p.user_id\n    WHERE YEAR(u.created_at) = 2023\n    AND o.amount \u003e 100\n    AND p.status IS NOT NULL\n    AND o.description LIKE '%test%'\n    AND u.email LIKE '%example%'\n)\nSELECT *\nFROM users u\nJOIN orders o ON u.id = o.user_id\nJOIN payments p ON u.id = p.user_id\nWHERE u.id IN (SELECT id FROM user_ids)\nLIMIT 1000 OFFSET 500;\n",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '不建议在 ORDER BY 语句中对多个不同条件使用不同方向的排序',
      audit_level: 'warn',
      type: 'statement',
      desc: '我们将 `user_ids` CTE 中的 `ORDER BY` 子句统一为升序，并在主查询中也将 `ORDER BY` 子句改为 `u.id`，以确保与 `user_ids` CTE 中的排序方向一致。\n',
      rewritten_sql:
        "WITH user_ids AS (\n    SELECT u.id\n    FROM users u\n    JOIN orders o ON u.id = o.user_id AND UPPER(o.status) = 'COMPLETED'\n    JOIN payments p ON u.id = p.user_id\n    WHERE YEAR(u.created_at) = 2023\n    AND o.amount \u003e 100\n    AND p.status IS NOT NULL\n    AND o.description LIKE '%test%'\n    AND u.email LIKE '%example%'\n    ORDER BY u.id\n)\nSELECT *\nFROM users u\nJOIN orders o ON u.id = o.user_id\nJOIN payments p ON u.id = p.user_id\nWHERE u.id IN (SELECT id FROM user_ids)\nLIMIT 1000 OFFSET 500;\n",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '应避免在 WHERE 条件中使用函数或其他运算符',
      audit_level: 'warn',
      type: 'statement',
      desc: "1. 将 `UPPER(o.status)` 替换为直接比较 `o.status`。\n2. 将 `o.description LIKE '%test%'` 替换为范围查询。\n3. 将 `YEAR(u.created_at) = 2023` 替换为范围查询。\n4. 将 `u.email LIKE '%example%'` 替换为范围查询。\n5. 确保每个子查询都有合适的索引支持，以减少全表扫描。\n",
      rewritten_sql:
        "WITH user_ids AS (\n    SELECT u.id\n    FROM users u\n    JOIN orders o ON u.id = o.user_id\n    JOIN payments p ON u.id = p.user_id\n    WHERE o.status = 'COMPLETED'\n    AND o.amount \u003e 100\n    AND p.status IS NOT NULL\n    AND o.description LIKE 'test%'\n    AND u.email LIKE 'example%'\n    AND u.created_at \u003e= '2023-01-01'\n    AND u.created_at \u003c '2024-01-01'\n    ORDER BY u.id\n)\nSELECT *\nFROM users u\nJOIN orders o ON u.id = o.user_id\nJOIN payments p ON u.id = p.user_id\nWHERE u.id IN (SELECT id FROM user_ids)\nLIMIT 1000 OFFSET 500;\n",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '不建议使用 ORDER BY RAND()',
      audit_level: 'warn',
      type: 'statement',
      desc: '使用 `WITH` 表达式生成随机主键值，并将其与 `users` 表关联，以避免全表扫描和临时表的使用。具体步骤如下：\n\n1. 使用 `WITH` 表达式生成随机主键值。\n2. 将生成的随机主键值与 `users` 表的主键 `id` 进行关联。\n3. 确保生成的随机主键值能够有效匹配实际存在的记录。\n4. 通过这种方式，避免了全表扫描和临时表的使用，提高了查询效率。\n',
      rewritten_sql:
        "WITH random_ids AS (\n    SELECT FLOOR(RAND() * 4999999) + 1 AS id\n    FROM DUAL\n    LIMIT 1000\n),\nfiltered_users AS (\n    SELECT u.*\n    FROM users u\n    JOIN orders o ON u.id = o.user_id\n    JOIN payments p ON u.id = p.user_id\n    WHERE o.status = 'COMPLETED'\n    AND o.amount \u003e 100\n    AND p.status IS NOT NULL\n    AND o.description LIKE 'test%'\n    AND u.email LIKE 'example%'\n    AND u.created_at \u003e= '2023-01-01'\n    AND u.created_at \u003c '2024-01-01'\n    AND u.id IN (SELECT id FROM random_ids)\n)\nSELECT *\nFROM filtered_users\nLIMIT 1000 OFFSET 500;\n",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '不建议在WHERE条件中使用与过滤字段不一致的数据类型',
      audit_level: 'notice',
      type: 'statement',
      desc: "我们通过使用显式转换函数 `CONCAT` 将 `u.email LIKE 'example%'` 和 `u.description LIKE 'test%'` 这两个条件改为 `u.email LIKE CONCAT('example%', '')` 和 `u.description LIKE CONCAT('test%', '')`。同时，确保 `u.created_at \u003e= '2023-01-01' AND u.created_at \u003c '2024-01-01'` 这部分条件的数据类型一致。此外，确保 `u.id IN (SELECT id FROM random_ids)` 这个子查询返回的数据类型与 `u.id` 字段的数据类型一致。\n",
      rewritten_sql:
        "WITH random_ids AS (\n    SELECT FLOOR(RAND() * 4999999) + 1 AS id\n    FROM DUAL\n    LIMIT 1000\n),\nfiltered_users AS (\n    SELECT u.*\n    FROM users u\n    JOIN orders o ON u.id = o.user_id\n    JOIN payments p ON u.id = p.user_id\n    WHERE o.status = 'COMPLETED'\n    AND o.amount \u003e 100\n    AND p.status IS NOT NULL\n    AND o.description LIKE CONCAT('test%', '')\n    AND u.email LIKE CONCAT('example%', '')\n    AND u.created_at \u003e= '2023-01-01'\n    AND u.created_at \u003c '2024-01-01'\n    AND u.id IN (SELECT id FROM random_ids)\n)\nSELECT *\nFROM filtered_users\nLIMIT 1000 OFFSET 500;\n",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '不建议对条件字段使用负向查询',
      audit_level: 'notice',
      type: 'statement',
      desc: '我们将使用 `NOT EXISTS` 代替 `NOT LIKE` 和 `LIKE` 的组合。这样可以避免负向查询，并且通过连接查询来提高查询效率。\n',
      rewritten_sql:
        "WITH random_ids AS (\n    SELECT FLOOR(RAND() * 4999999) + 1 AS id\n    FROM DUAL\n    LIMIT 1000\n),\nfiltered_users AS (\n    SELECT u.*\n    FROM users u\n    JOIN orders o ON u.id = o.user_id\n    JOIN payments p ON u.id = p.user_id\n    WHERE o.status = 'COMPLETED'\n    AND o.amount \u003e 100\n    AND p.status IS NOT NULL\n    AND o.description LIKE CONCAT('test%', '')\n    AND u.created_at \u003e= '2023-01-01'\n    AND u.created_at \u003c '2024-01-01'\n    AND NOT EXISTS (SELECT 1 FROM dual WHERE email LIKE CONCAT('example%', '')) ESCAPE '\\' AND u.email LIKE CONCAT('example%', '')\n    AND u.id IN (SELECT id FROM random_ids)\n)\nSELECT *\nFROM filtered_users\nLIMIT 1000 OFFSET 500;\n",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '不建议对条件字段使用 NULL 值判断',
      audit_level: 'notice',
      type: 'statement',
      desc: '我们将移除`EXISTS (SELECT 1 FROM dual)`条件，并优化`u.id IN (SELECT id FROM random_ids)`部分，通过创建临时表来提高性能。这样可以避免全表扫描，同时保持原始SQL的业务含义不变。\n',
      rewritten_sql:
        "WITH random_ids AS (\n    SELECT FLOOR(RAND() * 4999999) + 1 AS id\n    FROM DUAL\n    LIMIT 1000\n),\nfiltered_users AS (\n    SELECT u.*\n    FROM users u\n    JOIN orders o ON u.id = o.user_id\n    JOIN payments p ON u.id = p.user_id\n    WHERE o.status = 'COMPLETED'\n    AND o.amount \u003e 100\n    AND p.status IS NOT NULL\n    AND o.description LIKE CONCAT('test%', '')\n    AND u.created_at \u003e= '2023-01-01'\n    AND u.created_at \u003c '2024-01-01'\n    AND u.email LIKE CONCAT('example%', '')\n    AND u.id IN (SELECT id FROM random_ids)\n)\nSELECT *\nFROM filtered_users\nLIMIT 1000 OFFSET 500;\n",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '不建议使用SELECT *',
      audit_level: 'notice',
      type: 'statement',
      desc: '我们首先移除 `SELECT *`，明确指定需要的列。然后，优化子查询以减少不必要的计算。具体步骤如下：\n1. 将 `SELECT *` 替换为具体的列名。\n2. 确保子查询和连接条件正确应用。\n3. 优化子查询以减少不必要的计算。\n',
      rewritten_sql:
        "WITH random_ids AS (\n    SELECT FLOOR(RAND() * 4999999) + 1 AS id\n    FROM DUAL\n    LIMIT 1000\n),\nfiltered_users AS (\n    SELECT u.id, u.name, u.email, u.created_at\n    FROM users u\n    JOIN orders o ON u.id = o.user_id\n    JOIN payments p ON u.id = p.user_id\n    WHERE o.status = 'COMPLETED'\n    AND o.amount \u003e 100\n    AND p.status IS NOT NULL\n    AND o.description LIKE CONCAT('test%', '')\n    AND u.created_at \u003e= '2023-01-01'\n    AND u.created_at \u003c '2024-01-01'\n    AND u.email LIKE CONCAT('example%', '')\n    AND u.id IN (SELECT id FROM random_ids)\n)\nSELECT *\nFROM filtered_users\nLIMIT 1000 OFFSET 500;\n",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '禁止使用全模糊搜索或左模糊搜索',
      audit_level: 'error',
      type: 'other',
      desc: "结构级重写建议: - 方向1: 创建函数索引以支持后缀或子字符串匹配。例如，对于使用 `LIKE '%t'` 的SQL语句，可以在 `name` 字段上创建 `REVERSE(name)` 的索引：\n  \n  ```sql\n  ALTER TABLE t2 ADD INDEX idx_t2_func (REVERSE(name));\n  ```\n  \n  并将查询语句修改为使用函数索引，如：\n  \n  ```sql\n  SELECT * FROM t2 WHERE REVERSE(name) LIKE REVERSE('t%');\n  ```\n\n  方向1适用场景: \n  - 当需要对某个字段进行后缀匹配（如 `LIKE '%t'`）或子字符串匹配（如 `LIKE '%t%'`）时。\n  - 数据库版本支持函数索引，例如 MySQL 8.0.13 及以上版本。\n  - 现有查询因无法利用索引导致全表扫描，影响性能。\n  - 需要优化查询以提高检索效率并减少全表扫描带来的性能开销。\n\n- 方向2: 确保查询涉及的所有相关字段均已建立适当的索引，以便数据库能够通过全索引查找代替全表扫描。例如，对于需要模糊匹配的多个字段，可以为每个字段添加单独的索引：\n  \n  ```sql\n  ALTER TABLE t2 ADD INDEX idx_t2_addr (addr);\n  ALTER TABLE t2 ADD INDEX idx_t2_type (type);\n  ```\n  \n  这样，在执行涉及这些字段的查询时，数据库可以高效利用这些索引。\n\n  方向2适用场景:\n  - 查询条件中涉及多个字段的模糊匹配（如多个 `LIKE '%value%'` 条件）。\n  - 需要优化涉及多个字段的复杂查询，以减少查询时间。\n  - 数据库表结构允许添加额外的索引，不会显著增加存储开销或影响写操作性能。\n  - 现有查询因缺乏必要的索引导致无法有效利用索引，从而进行全表扫描。\n\n- 方向3: 创建全文索引以支持高效的文本搜索 全文索引（FULLTEXT Index）适用于需要在文本字段中执行复杂搜索的场景，如自然语言搜索或包含多个关键词的查询。通过使用全文索引，可以显著提升文本搜索的性能，避免全表扫描。 例如，对于需要在 addr 字段中进行复杂匹配的SQL语句，可以创建全文索引：\n  \n  ```sql\n ALTER TABLE t2 ADD FULLTEXT INDEX idx_t2_addr_fulltext (addr);\n ```\n\n  并将查询语句修改为使用 MATCH...AGAINST 语法，如：\n  \n  ```sql\n SELECT * FROM t2 WHERE MATCH(addr) AGAINST('t' IN BOOLEAN MODE);\n  ```\n\n  方向3适用场景:\n - 当查询需要在文本字段中进行复杂的匹配和搜索（如自然语言搜索或包含多个关键词的查询）时。 \n - 数据库版本支持全文索引，例如 MySQL 5.6 及以上版本。 \n - 现有查询使用 LIKE '%word%' 等模式匹配，导致全表扫描且性能较低。\n - 需要优化文本搜索性能，提升查询效率并减少全表扫描带来的性能开销。 \n - 数据库表结构中包含大量文本数据，适合使用全文索引进行优化。\n",
      rewritten_sql: '',
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: 'SQL查询条件需要走索引',
      audit_level: 'warn',
      type: 'other',
      desc: '结构级重写建议: - 方向1: 针对SQL查询中的WHERE条件字段添加索引。例如，对于包含`WHERE age = 20`的SQL，添加`age`字段的索引。\n  方向1适用场景: 当SQL查询中包含WHERE子句用于过滤数据，并且过滤字段在表中未建立索引时，尤其是在处理大量数据的表中，通过为这些WHERE条件字段添加索引，可以显著提高查询性能。\n\n- 方向2: 针对SQL查询中的GROUP BY或ORDER BY字段添加索引。例如，对于包含`ORDER BY age DESC`的SQL，添加`age`字段的索引。\n  方向2适用场景: 当SQL查询中使用GROUP BY或ORDER BY对某些字段进行分组或排序，并且这些字段在表中未建立索引时，特别是在数据量较大的表中，通过为这些字段添加索引，可以减少排序或分组的开销，从而提升查询效率。',
      rewritten_sql: '',
      ddl_dcl_desc: '',
      ddl_dcl: ''
    }
  ],
  rewritten_sql:
    "WITH random_ids AS (\n    SELECT FLOOR(RAND() * 4999999) + 1 AS id\n    FROM DUAL\n    LIMIT 1000\n),\nfiltered_users AS (\n    SELECT u.id, u.name, u.email, u.created_at\n    FROM users u\n    JOIN orders o ON u.id = o.user_id\n    JOIN payments p ON u.id = p.user_id\n    WHERE o.status = 'COMPLETED'\n    AND o.amount \u003e 100\n    AND p.status IS NOT NULL\n    AND o.description LIKE CONCAT('test%', '')\n    AND u.created_at \u003e= '2023-01-01'\n    AND u.created_at \u003c '2024-01-01'\n    AND u.email LIKE CONCAT('example%', '')\n    AND u.id IN (SELECT id FROM random_ids)\n)\nSELECT *\nFROM filtered_users\nLIMIT 1000 OFFSET 500;\n",
  rewritten_sql_business_desc:
    '此SQL查询旨在获取2023年注册的用户中，订单金额超过100且支付状态不为空、订单描述包含“test”、邮箱地址包含“example”的用户信息。此外，结果会根据随机数和支付创建时间降序排列，并最终返回第501到第1500条记录。\n',
  rewritten_sql_logic_desc:
    "1. 基础表选择：\n   - 从users表开始，作为主表\n   - 通过JOIN连接orders表获取订单信息\n   - 通过JOIN连接payments表获取支付信息\n\n2. 数据筛选条件：\n   - 用户注册时间限制：created_at在2023年\n   - 订单金额限制：amount大于100\n   - 支付状态不为空：p.status IS NOT NULL\n   - 订单描述包含“test”：o.description LIKE '%test%'\n   - 邮箱地址包含“example”：LOWER(u.email) LIKE '%example%'\n\n3. 连接条件：\n   - users表与orders表通过user_id关联\n   - users表与payments表通过user_id关联\n\n4. 结果排序：\n   - 随机数排序：ORDER BY RAND()\n   - 支付创建时间降序：ORDER BY p.created_at DESC\n\n5. 结果限制：\n   - LIMIT 1000 OFFSET 500：返回第501到第1500条记录\n",
  business_non_equivalent_desc:
    '- **记录数的不确定性**: 原始 SQL 使用 `ORDER BY RAND()` 可能会导致记录数的不确定性，因为随机排序可能导致不同的记录被选中。而优化后的 SQL 使用 `u.id IN (SELECT id FROM random_ids)`，虽然也实现了随机选择，但具体的记录选择可能会不同，导致记录数的不确定性。\n- **数据内容的差异**: 由于记录的选择可能不同，因此数据内容也可能不同。\n- **数据顺序的差异**: 虽然两种方法都实现了随机选择，但具体的选择顺序可能会不同，导致数据顺序的差异。'
} as IRewriteSQLData;
