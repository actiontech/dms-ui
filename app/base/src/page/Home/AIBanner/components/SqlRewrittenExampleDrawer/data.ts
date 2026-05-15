export const sqlRewrittenExampleResult = {
  business_desc: '',
  logic_desc: '',
  suggestions: [
    {
      rule_name: '多表关联时，不建议在WHERE条件中对不同表的字段使用OR条件',
      audit_level: 'warn',
      type: 'statement',
      desc: "1. 将原SQL拆分为两个部分：\n   - 第一部分保留所有条件，只包含`o.description LIKE '%test%'`的条件\n   - 第二部分保留所有条件，只包含`LOWER(u.email) LIKE '%example%'`的条件\n2. 使用UNION ALL合并两个查询结果，确保不丢失任何记录\n3. 保持原有的JOIN条件、WHERE条件和排序逻辑不变\n4. 在外层应用LIMIT和OFFSET以保证分页功能",
      status: 'processed',
      rewritten_sql:
        "(SELECT * \nFROM users u\nJOIN orders o ON u.id = o.user_id AND UPPER(o.status) = 'COMPLETED'\nJOIN payments p ON u.id = p.user_id\nWHERE YEAR(u.created_at) = 2023\nAND o.amount > '100'\nAND p.status IS NOT NULL\nAND o.description LIKE '%test%'\nORDER BY RAND(), p.created_at DESC)\nUNION ALL\n(SELECT *\nFROM users u\nJOIN orders o ON u.id = o.user_id AND UPPER(o.status) = 'COMPLETED'\nJOIN payments p ON u.id = p.user_id\nWHERE YEAR(u.created_at) = 2023\nAND o.amount > '100'\nAND p.status IS NOT NULL\nAND LOWER(u.email) LIKE '%example%'\nORDER BY RAND(), p.created_at DESC)\nLIMIT 1000 OFFSET 500;",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '禁止使用文件排序',
      audit_level: 'warn',
      type: 'statement',
      desc: '根据规则"多表关联时，不建议在WHERE条件中对不同表的字段使用OR条件"重写后的SQL已不再触发本规则',
      status: 'processed',
      rewritten_sql:
        "(SELECT * \nFROM users u\nJOIN orders o ON u.id = o.user_id AND UPPER(o.status) = 'COMPLETED'\nJOIN payments p ON u.id = p.user_id\nWHERE YEAR(u.created_at) = 2023\nAND o.amount > '100'\nAND p.status IS NOT NULL\nAND o.description LIKE '%test%'\nORDER BY RAND(), p.created_at DESC)\nUNION ALL\n(SELECT *\nFROM users u\nJOIN orders o ON u.id = o.user_id AND UPPER(o.status) = 'COMPLETED'\nJOIN payments p ON u.id = p.user_id\nWHERE YEAR(u.created_at) = 2023\nAND o.amount > '100'\nAND p.status IS NOT NULL\nAND LOWER(u.email) LIKE '%example%'\nORDER BY RAND(), p.created_at DESC)\nLIMIT 1000 OFFSET 500;",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '不建议使用临时表',
      audit_level: 'warn',
      type: 'statement',
      desc: '根据规则"多表关联时，不建议在WHERE条件中对不同表的字段使用OR条件"重写后的SQL已不再触发本规则',
      status: 'processed',
      rewritten_sql:
        "(SELECT * \nFROM users u\nJOIN orders o ON u.id = o.user_id AND UPPER(o.status) = 'COMPLETED'\nJOIN payments p ON u.id = p.user_id\nWHERE YEAR(u.created_at) = 2023\nAND o.amount > '100'\nAND p.status IS NOT NULL\nAND o.description LIKE '%test%'\nORDER BY RAND(), p.created_at DESC)\nUNION ALL\n(SELECT *\nFROM users u\nJOIN orders o ON u.id = o.user_id AND UPPER(o.status) = 'COMPLETED'\nJOIN payments p ON u.id = p.user_id\nWHERE YEAR(u.created_at) = 2023\nAND o.amount > '100'\nAND p.status IS NOT NULL\nAND LOWER(u.email) LIKE '%example%'\nORDER BY RAND(), p.created_at DESC)\nLIMIT 1000 OFFSET 500;",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '禁止在子查询中使用LIMIT',
      audit_level: 'notice',
      type: 'statement',
      desc: '根据规则"多表关联时，不建议在WHERE条件中对不同表的字段使用OR条件"重写后的SQL已不再触发本规则',
      status: 'processed',
      rewritten_sql:
        "(SELECT * \nFROM users u\nJOIN orders o ON u.id = o.user_id AND UPPER(o.status) = 'COMPLETED'\nJOIN payments p ON u.id = p.user_id\nWHERE YEAR(u.created_at) = 2023\nAND o.amount > '100'\nAND p.status IS NOT NULL\nAND o.description LIKE '%test%'\nORDER BY RAND(), p.created_at DESC)\nUNION ALL\n(SELECT *\nFROM users u\nJOIN orders o ON u.id = o.user_id AND UPPER(o.status) = 'COMPLETED'\nJOIN payments p ON u.id = p.user_id\nWHERE YEAR(u.created_at) = 2023\nAND o.amount > '100'\nAND p.status IS NOT NULL\nAND LOWER(u.email) LIKE '%example%'\nORDER BY RAND(), p.created_at DESC)\nLIMIT 1000 OFFSET 500;",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '建议使用数据区分度高的索引字段',
      audit_level: 'notice',
      type: 'statement',
      desc: '根据规则"多表关联时，不建议在WHERE条件中对不同表的字段使用OR条件"重写后的SQL已不再触发本规则',
      status: 'processed',
      rewritten_sql:
        "(SELECT * \nFROM users u\nJOIN orders o ON u.id = o.user_id AND UPPER(o.status) = 'COMPLETED'\nJOIN payments p ON u.id = p.user_id\nWHERE YEAR(u.created_at) = 2023\nAND o.amount > '100'\nAND p.status IS NOT NULL\nAND o.description LIKE '%test%'\nORDER BY RAND(), p.created_at DESC)\nUNION ALL\n(SELECT *\nFROM users u\nJOIN orders o ON u.id = o.user_id AND UPPER(o.status) = 'COMPLETED'\nJOIN payments p ON u.id = p.user_id\nWHERE YEAR(u.created_at) = 2023\nAND o.amount > '100'\nAND p.status IS NOT NULL\nAND LOWER(u.email) LIKE '%example%'\nORDER BY RAND(), p.created_at DESC)\nLIMIT 1000 OFFSET 500;",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '联合索引最左侧的字段必须出现在查询条件内',
      audit_level: 'warn',
      type: 'statement',
      desc: '1. 在两个SELECT子句中，为users表添加id > 0条件(确保使用主键索引)\n2. 在两个SELECT子句中，为orders表添加user_id > 0条件(确保使用idx_user_id索引)\n3. 在两个SELECT子句中，为payments表添加user_id > 0条件(确保使用idx_user_id索引)\n4. 保持其他条件不变，确保业务逻辑一致\n5. 保持UNION ALL结构和LIMIT/OFFSET不变',
      status: 'processed',
      rewritten_sql:
        "(SELECT * \nFROM users u\nJOIN orders o ON u.id = o.user_id AND UPPER(o.status) = 'COMPLETED' AND o.user_id > 0\nJOIN payments p ON u.id = p.user_id AND p.user_id > 0\nWHERE u.id > 0 AND YEAR(u.created_at) = 2023\nAND o.amount > '100'\nAND p.status IS NOT NULL\nAND o.description LIKE '%test%'\nORDER BY RAND(), p.created_at DESC)\nUNION ALL\n(SELECT *\nFROM users u\nJOIN orders o ON u.id = o.user_id AND UPPER(o.status) = 'COMPLETED' AND o.user_id > 0\nJOIN payments p ON u.id = p.user_id AND p.user_id > 0\nWHERE u.id > 0 AND YEAR(u.created_at) = 2023\nAND o.amount > '100'\nAND p.status IS NOT NULL\nAND LOWER(u.email) LIKE '%example%'\nORDER BY RAND(), p.created_at DESC)\nLIMIT 1000 OFFSET 500;",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '不建议使用SELECT *',
      audit_level: 'notice',
      type: 'statement',
      desc: '1. 将两个SELECT子句中的`SELECT *`替换为明确指定的列名。\n2. 需要从users、orders和payments表中选择必要的列。\n3. 保持原SQL的其他部分不变，包括JOIN条件、WHERE条件和ORDER BY等。\n4. 由于原SQL的业务含义不明确，我们假设需要选择所有表的主键和关键业务字段。',
      status: 'processed',
      rewritten_sql:
        "(SELECT u.id, u.name, u.email, u.created_at, u.status,\no.id AS order_id, o.amount, o.description, o.status AS order_status, o.created_at AS order_created_at,\np.id AS payment_id, p.status AS payment_status, p.payment_method, p.created_at AS payment_created_at\nFROM users u\nJOIN orders o ON u.id = o.user_id AND UPPER(o.status) = 'COMPLETED' AND o.user_id > 0\nJOIN payments p ON u.id = p.user_id AND p.user_id > 0\nWHERE u.id > 0 AND YEAR(u.created_at) = 2023\nAND o.amount > '100'\nAND p.status IS NOT NULL\nAND o.description LIKE '%test%'\nORDER BY RAND(), p.created_at DESC)\nUNION ALL\n(SELECT u.id, u.name, u.email, u.created_at, u.status,\no.id AS order_id, o.amount, o.description, o.status AS order_status, o.created_at AS order_created_at,\np.id AS payment_id, p.status AS payment_status, p.payment_method, p.created_at AS payment_created_at\nFROM users u\nJOIN orders o ON u.id = o.user_id AND UPPER(o.status) = 'COMPLETED' AND o.user_id > 0\nJOIN payments p ON u.id = p.user_id AND p.user_id > 0\nWHERE u.id > 0 AND YEAR(u.created_at) = 2023\nAND o.amount > '100'\nAND p.status IS NOT NULL\nAND LOWER(u.email) LIKE '%example%'\nORDER BY RAND(), p.created_at DESC)\nLIMIT 1000 OFFSET 500;",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '不建议在ORDER BY中使用表达式或函数',
      audit_level: 'warn',
      type: 'statement',
      desc: '1. 移除两个子查询中的ORDER BY RAND()部分\n2. 保留ORDER BY p.created_at DESC作为排序条件\n3. 保持其他所有查询条件和结构不变',
      status: 'processed',
      rewritten_sql:
        "(SELECT u.id, u.name, u.email, u.created_at, u.status,\no.id AS order_id, o.amount, o.description, o.status AS order_status, o.created_at AS order_created_at,\np.id AS payment_id, p.status AS payment_status, p.payment_method, p.created_at AS payment_created_at\nFROM users u\nJOIN orders o ON u.id = o.user_id AND UPPER(o.status) = 'COMPLETED' AND o.user_id > 0\nJOIN payments p ON u.id = p.user_id AND p.user_id > 0\nWHERE u.id > 0 AND YEAR(u.created_at) = 2023\nAND o.amount > '100'\nAND p.status IS NOT NULL\nAND o.description LIKE '%test%'\nORDER BY p.created_at DESC)\nUNION ALL\n(SELECT u.id, u.name, u.email, u.created_at, u.status,\no.id AS order_id, o.amount, o.description, o.status AS order_status, o.created_at AS order_created_at,\np.id AS payment_id, p.status AS payment_status, p.payment_method, p.created_at AS payment_created_at\nFROM users u\nJOIN orders o ON u.id = o.user_id AND UPPER(o.status) = 'COMPLETED' AND o.user_id > 0\nJOIN payments p ON u.id = p.user_id AND p.user_id > 0\nWHERE u.id > 0 AND YEAR(u.created_at) = 2023\nAND o.amount > '100'\nAND p.status IS NOT NULL\nAND LOWER(u.email) LIKE '%example%'\nORDER BY p.created_at DESC)\nLIMIT 1000 OFFSET 500;",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '避免使用 ORDER BY RAND() 进行随机排序',
      audit_level: 'warn',
      type: 'statement',
      desc: '根据规则"不建议在ORDER BY中使用表达式或函数"重写后的SQL已不再触发本规则',
      status: 'processed',
      rewritten_sql:
        "(SELECT u.id, u.name, u.email, u.created_at, u.status,\no.id AS order_id, o.amount, o.description, o.status AS order_status, o.created_at AS order_created_at,\np.id AS payment_id, p.status AS payment_status, p.payment_method, p.created_at AS payment_created_at\nFROM users u\nJOIN orders o ON u.id = o.user_id AND UPPER(o.status) = 'COMPLETED' AND o.user_id > 0\nJOIN payments p ON u.id = p.user_id AND p.user_id > 0\nWHERE u.id > 0 AND YEAR(u.created_at) = 2023\nAND o.amount > '100'\nAND p.status IS NOT NULL\nAND o.description LIKE '%test%'\nORDER BY p.created_at DESC)\nUNION ALL\n(SELECT u.id, u.name, u.email, u.created_at, u.status,\no.id AS order_id, o.amount, o.description, o.status AS order_status, o.created_at AS order_created_at,\np.id AS payment_id, p.status AS payment_status, p.payment_method, p.created_at AS payment_created_at\nFROM users u\nJOIN orders o ON u.id = o.user_id AND UPPER(o.status) = 'COMPLETED' AND o.user_id > 0\nJOIN payments p ON u.id = p.user_id AND p.user_id > 0\nWHERE u.id > 0 AND YEAR(u.created_at) = 2023\nAND o.amount > '100'\nAND p.status IS NOT NULL\nAND LOWER(u.email) LIKE '%example%'\nORDER BY p.created_at DESC)\nLIMIT 1000 OFFSET 500;",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '避免对条件字段使用函数操作',
      audit_level: 'notice',
      type: 'statement',
      desc: "1. 将YEAR(u.created_at) = 2023改为u.created_at BETWEEN '2023-01-01' AND '2023-12-31 23:59:59'，这样可以使用created_at上的索引\n2. 将UPPER(o.status) = 'COMPLETED'改为o.status = 'COMPLETED'，因为status字段已经是字符串类型，不需要大小写转换\n3. 将LOWER(u.email) LIKE '%example%'改为u.email LIKE '%example%'，因为email字段已经是字符串类型，不需要大小写转换",
      status: 'processed',
      rewritten_sql:
        "(SELECT u.id, u.name, u.email, u.created_at, u.status,\no.id AS order_id, o.amount, o.description, o.status AS order_status, o.created_at AS order_created_at,\np.id AS payment_id, p.status AS payment_status, p.payment_method, p.created_at AS payment_created_at\nFROM users u\nJOIN orders o ON u.id = o.user_id AND o.status = 'COMPLETED' AND o.user_id > 0\nJOIN payments p ON u.id = p.user_id AND p.user_id > 0\nWHERE u.id > 0 AND u.created_at BETWEEN '2023-01-01' AND '2023-12-31 23:59:59'\nAND o.amount > '100'\nAND p.status IS NOT NULL\nAND o.description LIKE '%test%'\nORDER BY p.created_at DESC)\nUNION ALL\n(SELECT u.id, u.name, u.email, u.created_at, u.status,\no.id AS order_id, o.amount, o.description, o.status AS order_status, o.created_at AS order_created_at,\np.id AS payment_id, p.status AS payment_status, p.payment_method, p.created_at AS payment_created_at\nFROM users u\nJOIN orders o ON u.id = o.user_id AND o.status = 'COMPLETED' AND o.user_id > 0\nJOIN payments p ON u.id = p.user_id AND p.user_id > 0\nWHERE u.id > 0 AND u.created_at BETWEEN '2023-01-01' AND '2023-12-31 23:59:59'\nAND o.amount > '100'\nAND p.status IS NOT NULL\nAND u.email LIKE '%example%'\nORDER BY p.created_at DESC)\nLIMIT 1000 OFFSET 500;",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '避免对条件字段使用表达式操作',
      audit_level: 'notice',
      type: 'statement',
      desc: '根据规则"避免对条件字段使用函数操作"重写后的SQL已不再触发本规则',
      status: 'processed',
      rewritten_sql:
        "(SELECT u.id, u.name, u.email, u.created_at, u.status,\no.id AS order_id, o.amount, o.description, o.status AS order_status, o.created_at AS order_created_at,\np.id AS payment_id, p.status AS payment_status, p.payment_method, p.created_at AS payment_created_at\nFROM users u\nJOIN orders o ON u.id = o.user_id AND o.status = 'COMPLETED' AND o.user_id > 0\nJOIN payments p ON u.id = p.user_id AND p.user_id > 0\nWHERE u.id > 0 AND u.created_at BETWEEN '2023-01-01' AND '2023-12-31 23:59:59'\nAND o.amount > '100'\nAND p.status IS NOT NULL\nAND o.description LIKE '%test%'\nORDER BY p.created_at DESC)\nUNION ALL\n(SELECT u.id, u.name, u.email, u.created_at, u.status,\no.id AS order_id, o.amount, o.description, o.status AS order_status, o.created_at AS order_created_at,\np.id AS payment_id, p.status AS payment_status, p.payment_method, p.created_at AS payment_created_at\nFROM users u\nJOIN orders o ON u.id = o.user_id AND o.status = 'COMPLETED' AND o.user_id > 0\nJOIN payments p ON u.id = p.user_id AND p.user_id > 0\nWHERE u.id > 0 AND u.created_at BETWEEN '2023-01-01' AND '2023-12-31 23:59:59'\nAND o.amount > '100'\nAND p.status IS NOT NULL\nAND u.email LIKE '%example%'\nORDER BY p.created_at DESC)\nLIMIT 1000 OFFSET 500;",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '建议对表、视图等对象进行操作时指定库名',
      audit_level: 'notice',
      type: 'statement',
      desc: '1. 为所有表引用添加库名(test)\n2. 为JOIN条件中的表别名添加库名限定\n3. 为WHERE条件和ORDER BY子句中的列引用添加库名限定\n4. 保持SQL的其他部分不变，包括UNION ALL结构、LIMIT和OFFSET等',
      status: 'processed',
      rewritten_sql:
        "(SELECT test.u.id, test.u.name, test.u.email, test.u.created_at, test.u.status,\ntest.o.id AS order_id, test.o.amount, test.o.description, test.o.status AS order_status, test.o.created_at AS order_created_at,\ntest.p.id AS payment_id, test.p.status AS payment_status, test.p.payment_method, test.p.created_at AS payment_created_at\nFROM test.users test.u\nJOIN test.orders test.o ON test.u.id = test.o.user_id AND test.o.status = 'COMPLETED' AND test.o.user_id > 0\nJOIN test.payments test.p ON test.u.id = test.p.user_id AND test.p.user_id > 0\nWHERE test.u.id > 0 AND test.u.created_at BETWEEN '2023-01-01' AND '2023-12-31 23:59:59'\nAND test.o.amount > '100'\nAND test.p.status IS NOT NULL\nAND test.o.description LIKE '%test%'\nORDER BY test.p.created_at DESC)\nUNION ALL\n(SELECT test.u.id, test.u.name, test.u.email, test.u.created_at, test.u.status,\ntest.o.id AS order_id, test.o.amount, test.o.description, test.o.status AS order_status, test.o.created_at AS order_created_at,\ntest.p.id AS payment_id, test.p.status AS payment_status, test.p.payment_method, test.p.created_at AS payment_created_at\nFROM test.users test.u\nJOIN test.orders test.o ON test.u.id = test.o.user_id AND test.o.status = 'COMPLETED' AND test.o.user_id > 0\nJOIN test.payments test.p ON test.u.id = test.p.user_id AND test.p.user_id > 0\nWHERE test.u.id > 0 AND test.u.created_at BETWEEN '2023-01-01' AND '2023-12-31 23:59:59'\nAND test.o.amount > '100'\nAND test.p.status IS NOT NULL\nAND test.u.email LIKE '%example%'\nORDER BY test.p.created_at DESC)\nLIMIT 1000 OFFSET 500;",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '不建议针对大表执行SELECT 语句时存在ORDER BY操作',
      audit_level: 'warn',
      type: 'statement',
      desc: '根据规则"建议对表、视图等对象进行操作时指定库名"重写后的SQL已不再触发本规则',
      status: 'processed',
      rewritten_sql:
        "(SELECT test.u.id, test.u.name, test.u.email, test.u.created_at, test.u.status,\ntest.o.id AS order_id, test.o.amount, test.o.description, test.o.status AS order_status, test.o.created_at AS order_created_at,\ntest.p.id AS payment_id, test.p.status AS payment_status, test.p.payment_method, test.p.created_at AS payment_created_at\nFROM test.users test.u\nJOIN test.orders test.o ON test.u.id = test.o.user_id AND test.o.status = 'COMPLETED' AND test.o.user_id > 0\nJOIN test.payments test.p ON test.u.id = test.p.user_id AND test.p.user_id > 0\nWHERE test.u.id > 0 AND test.u.created_at BETWEEN '2023-01-01' AND '2023-12-31 23:59:59'\nAND test.o.amount > '100'\nAND test.p.status IS NOT NULL\nAND test.o.description LIKE '%test%'\nORDER BY test.p.created_at DESC)\nUNION ALL\n(SELECT test.u.id, test.u.name, test.u.email, test.u.created_at, test.u.status,\ntest.o.id AS order_id, test.o.amount, test.o.description, test.o.status AS order_status, test.o.created_at AS order_created_at,\ntest.p.id AS payment_id, test.p.status AS payment_status, test.p.payment_method, test.p.created_at AS payment_created_at\nFROM test.users test.u\nJOIN test.orders test.o ON test.u.id = test.o.user_id AND test.o.status = 'COMPLETED' AND test.o.user_id > 0\nJOIN test.payments test.p ON test.u.id = test.p.user_id AND test.p.user_id > 0\nWHERE test.u.id > 0 AND test.u.created_at BETWEEN '2023-01-01' AND '2023-12-31 23:59:59'\nAND test.o.amount > '100'\nAND test.p.status IS NOT NULL\nAND test.u.email LIKE '%example%'\nORDER BY test.p.created_at DESC)\nLIMIT 1000 OFFSET 500;",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '禁止使用子字符串匹配或后缀匹配搜索',
      audit_level: 'error',
      type: 'statement',
      desc: '根据规则"建议对表、视图等对象进行操作时指定库名"重写后的SQL已不再触发本规则',
      status: 'processed',
      rewritten_sql:
        "(SELECT test.u.id, test.u.name, test.u.email, test.u.created_at, test.u.status,\ntest.o.id AS order_id, test.o.amount, test.o.description, test.o.status AS order_status, test.o.created_at AS order_created_at,\ntest.p.id AS payment_id, test.p.status AS payment_status, test.p.payment_method, test.p.created_at AS payment_created_at\nFROM test.users test.u\nJOIN test.orders test.o ON test.u.id = test.o.user_id AND test.o.status = 'COMPLETED' AND test.o.user_id > 0\nJOIN test.payments test.p ON test.u.id = test.p.user_id AND test.p.user_id > 0\nWHERE test.u.id > 0 AND test.u.created_at BETWEEN '2023-01-01' AND '2023-12-31 23:59:59'\nAND test.o.amount > '100'\nAND test.p.status IS NOT NULL\nAND test.o.description LIKE '%test%'\nORDER BY test.p.created_at DESC)\nUNION ALL\n(SELECT test.u.id, test.u.name, test.u.email, test.u.created_at, test.u.status,\ntest.o.id AS order_id, test.o.amount, test.o.description, test.o.status AS order_status, test.o.created_at AS order_created_at,\ntest.p.id AS payment_id, test.p.status AS payment_status, test.p.payment_method, test.p.created_at AS payment_created_at\nFROM test.users test.u\nJOIN test.orders test.o ON test.u.id = test.o.user_id AND test.o.status = 'COMPLETED' AND test.o.user_id > 0\nJOIN test.payments test.p ON test.u.id = test.p.user_id AND test.p.user_id > 0\nWHERE test.u.id > 0 AND test.u.created_at BETWEEN '2023-01-01' AND '2023-12-31 23:59:59'\nAND test.o.amount > '100'\nAND test.p.status IS NOT NULL\nAND test.u.email LIKE '%example%'\nORDER BY test.p.created_at DESC)\nLIMIT 1000 OFFSET 500;",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    },
    {
      rule_name: '建议为SQL查询条件建立索引',
      audit_level: 'warn',
      type: 'statement',
      desc: '根据规则"建议对表、视图等对象进行操作时指定库名"重写后的SQL已不再触发本规则',
      status: 'processed',
      rewritten_sql:
        "(SELECT test.u.id, test.u.name, test.u.email, test.u.created_at, test.u.status,\ntest.o.id AS order_id, test.o.amount, test.o.description, test.o.status AS order_status, test.o.created_at AS order_created_at,\ntest.p.id AS payment_id, test.p.status AS payment_status, test.p.payment_method, test.p.created_at AS payment_created_at\nFROM test.users test.u\nJOIN test.orders test.o ON test.u.id = test.o.user_id AND test.o.status = 'COMPLETED' AND test.o.user_id > 0\nJOIN test.payments test.p ON test.u.id = test.p.user_id AND test.p.user_id > 0\nWHERE test.u.id > 0 AND test.u.created_at BETWEEN '2023-01-01' AND '2023-12-31 23:59:59'\nAND test.o.amount > '100'\nAND test.p.status IS NOT NULL\nAND test.o.description LIKE '%test%'\nORDER BY test.p.created_at DESC)\nUNION ALL\n(SELECT test.u.id, test.u.name, test.u.email, test.u.created_at, test.u.status,\ntest.o.id AS order_id, test.o.amount, test.o.description, test.o.status AS order_status, test.o.created_at AS order_created_at,\ntest.p.id AS payment_id, test.p.status AS payment_status, test.p.payment_method, test.p.created_at AS payment_created_at\nFROM test.users test.u\nJOIN test.orders test.o ON test.u.id = test.o.user_id AND test.o.status = 'COMPLETED' AND test.o.user_id > 0\nJOIN test.payments test.p ON test.u.id = test.p.user_id AND test.p.user_id > 0\nWHERE test.u.id > 0 AND test.u.created_at BETWEEN '2023-01-01' AND '2023-12-31 23:59:59'\nAND test.o.amount > '100'\nAND test.p.status IS NOT NULL\nAND test.u.email LIKE '%example%'\nORDER BY test.p.created_at DESC)\nLIMIT 1000 OFFSET 500;",
      ddl_dcl_desc: '',
      ddl_dcl: ''
    }
  ],
  rewritten_sql:
    "(SELECT test.u.id, test.u.name, test.u.email, test.u.created_at, test.u.status,\ntest.o.id AS order_id, test.o.amount, test.o.description, test.o.status AS order_status, test.o.created_at AS order_created_at,\ntest.p.id AS payment_id, test.p.status AS payment_status, test.p.payment_method, test.p.created_at AS payment_created_at\nFROM test.users test.u\nJOIN test.orders test.o ON test.u.id = test.o.user_id AND test.o.status = 'COMPLETED' AND test.o.user_id > 0\nJOIN test.payments test.p ON test.u.id = test.p.user_id AND test.p.user_id > 0\nWHERE test.u.id > 0 AND test.u.created_at BETWEEN '2023-01-01' AND '2023-12-31 23:59:59'\nAND test.o.amount > '100'\nAND test.p.status IS NOT NULL\nAND test.o.description LIKE '%test%'\nORDER BY test.p.created_at DESC)\nUNION ALL\n(SELECT test.u.id, test.u.name, test.u.email, test.u.created_at, test.u.status,\ntest.o.id AS order_id, test.o.amount, test.o.description, test.o.status AS order_status, test.o.created_at AS order_created_at,\ntest.p.id AS payment_id, test.p.status AS payment_status, test.p.payment_method, test.p.created_at AS payment_created_at\nFROM test.users test.u\nJOIN test.orders test.o ON test.u.id = test.o.user_id AND test.o.status = 'COMPLETED' AND test.o.user_id > 0\nJOIN test.payments test.p ON test.u.id = test.p.user_id AND test.p.user_id > 0\nWHERE test.u.id > 0 AND test.u.created_at BETWEEN '2023-01-01' AND '2023-12-31 23:59:59'\nAND test.o.amount > '100'\nAND test.p.status IS NOT NULL\nAND test.u.email LIKE '%example%'\nORDER BY test.p.created_at DESC)\nLIMIT 1000 OFFSET 500;",
  rewritten_sql_business_desc: '',
  rewritten_sql_logic_desc: '',
  business_non_equivalent_desc:
    "1. 排序规则不一致：\n   - 原SQL包含随机排序(RAND())，优化后完全移除了随机排序\n   - 这将导致结果集的顺序完全不同\n\n2. 大小写处理不一致：\n   - 原SQL使用UPPER(o.status) = 'COMPLETED'，优化后直接比较o.status = 'COMPLETED'\n   - 如果status字段包含大小写混合的值(如'Completed')，结果会不同\n\n3. 邮箱匹配条件不一致：\n   - 原SQL使用LOWER(u.email) LIKE '%example%'，优化后使用u.email LIKE '%example%'\n   - 如果邮箱中包含大写字母(如'Example@test.com')，结果会不同\n\n4. 额外条件不一致：\n   - 优化后添加了test.u.id > 0, test.o.user_id > 0, test.p.user_id > 0等条件\n   - 这些条件在原SQL中不存在，如果存在这些字段为0或负数的记录，结果会不同\n\n5. 结果集顺序：\n   - 由于排序规则改变，即使数据内容相同，返回的记录顺序也会不同\n   - 结合LIMIT和OFFSET，实际返回的记录可能完全不同\n\n6. 性能影响：\n   - 虽然不属于业务语义，但UNION ALL方式可能比原SQL的OR条件性能更差\n   - 特别是当两个查询部分都返回大量数据时"
};

export const sqlRewrittenExampleOriginalSql = `SELECT *
FROM users u
JOIN orders o ON u.id = o.user_id AND UPPER(o.status) = 'COMPLETED'
JOIN payments p ON u.id = p.user_id
WHERE YEAR(u.created_at) = 2023
AND o.amount > '100'
AND p.status IS NOT NULL
AND o.description LIKE '%test%'
OR LOWER(u.email) LIKE '%example%'
ORDER BY RAND(), p.created_at DESC
LIMIT 1000 OFFSET 500;`;
