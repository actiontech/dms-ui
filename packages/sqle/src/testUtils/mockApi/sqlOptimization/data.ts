import {
  IOptimizationRecord,
  IOptimizeSQLResData,
  IOptimizationDetail,
  IOptimizationSQL,
  IOptimizationSQLDetail,
  IDBPerformanceImproveOverview,
  IOptimizationRecordOverview
} from '@actiontech/shared/lib/api/sqle/service/common';

export const sqlOptimizationRecordsMockData: IOptimizationRecord[] = [
  {
    optimization_id: '123456',
    optimization_name: 'UI20240417112938231',
    instance_name: 'dd1',
    db_type: 'MySQL',
    performance_gain: 1108.2454657790013,
    created_time: '2024-04-17T03:33:09Z',
    created_user: 'admin',
    status: 'finish'
  },
  {
    optimization_id: '1234567',
    optimization_name: 'SQLfile20240417112938232',
    instance_name: 'dd1',
    db_type: '',
    status: 'failed'
  },
  {
    optimization_id: '12345678',
    optimization_name: 'GIT20240417112938233',
    instance_name: 'dd1',
    db_type: 'MySQL',
    performance_gain: 1108.2454657790013,
    created_time: '2024-04-17T03:33:09Z',
    created_user: 'admin',
    status: 'optimizing'
  }
];

export const createOptimizationResMockData: IOptimizeSQLResData = {
  sql_optimization_record_id: '1234567'
};

export const optimizationRecordMockData: IOptimizationDetail = {
  optimization_id: '1234567',
  optimization_name: 'optmz_20240417112938238',
  instance_name: 'dd1',
  db_type: 'MySQL',
  created_time: '2024-04-17T03:33:09Z',
  created_user: 'admin',
  basic_summary: {
    number_of_query: 5,
    number_of_syntax_error: 1,
    number_of_rewrite: 3,
    number_of_rewritten_query: 3,
    number_of_index: 3,
    number_of_query_index: 5,
    performance_gain: 1108.2454657790013
  },
  index_recommendations: [
    'CREATE INDEX PAWSQL_IDX0725431411 ON optimization.orders(o_custkey);',
    'CREATE INDEX PAWSQL_IDX0423139512 ON optimization.orders(o_orderdate,o_custkey);'
  ],
  status: 'finish'
};

export const optimizationRecordSqlMockData: IOptimizationSQL[] = [
  {
    number: 1,
    original_sql:
      'select * from customer where c_custkey in (select o_custkey from orders where O_ORDERDATE\u003e=current_date - interval 1 year)',
    number_of_rewrite: 1,
    number_of_syntax_error: 0,
    number_of_index: 2,
    number_of_hit_index: 1,
    performance: 0.4163,
    contributing_indices: 'PAWSQL_IDX1327276661'
  },
  {
    number: 2,
    original_sql: 'select * from tpch.customer where c_acctbal + 100 = 10000.0',
    number_of_rewrite: 0,
    number_of_syntax_error: 1,
    number_of_index: 0,
    number_of_hit_index: 0,
    performance: 0,
    contributing_indices: ''
  }
];

export const optimizationDetailMockData: IOptimizationSQLDetail = {
  original_sql:
    'select * from customer where c_custkey in (select o_custkey from orders where O_ORDERDATE\u003e=current_date - interval 1 year)',
  optimized_sql:
    "select *\r\nfrom customer\r\nwhere customer.c_custkey in (\r\n          select orders.o_custkey\r\n          from orders\r\n          where orders.O_ORDERDATE \u003e= current_date - interval '1' YEAR\r\n          )\r\n",
  triggered_rule: [
    {
      rule_code: '',
      rule_name: 'RuleInSubqueryRewrite',
      message: 'IN子查询优化',
      rewritten_queries_str:
        '["select *\\nfrom customer\\nwhere exists (\\n          select orders.o_custkey\\n          from orders\\n          where orders.O_ORDERDATE \\u003e\\u003d current_date - interval \\u00271\\u0027 YEAR\\n          and orders.o_custkey \\u003d customer.c_custkey\\n          )\\n"]',
      violated_queries_str:
        '["customer.c_custkey in ( select orders.o_custkey from orders where orders.O_ORDERDATE \\u003e\\u003d current_date - interval \\u00271\\u0027 YEAR )"]'
    }
  ],
  index_recommendations: [
    'CREATE INDEX PAWSQL_IDX1327276661 ON optimization.orders(o_custkey,o_orderdate);'
  ],
  explain_validation_details: {
    before_cost: 0.0375,
    after_cost: 0.0306,
    before_plan:
      '-\u003e Nested loop inner join  (cost=0.55 rows=1) (actual time=0.0375..0.0375 rows=0 loops=1)',
    after_plan:
      '-\u003e Nested loop inner join  (cost=1.1 rows=3) (actual time=0.0306..0.0306 rows=0 loops=1)',
    perform_improve_per: 0.23
  }
};

export const performanceImproveMockData: IDBPerformanceImproveOverview[] = [
  {
    instance_name: 'dd1',
    avg_performance_improve: 369.4151552596671
  },
  {
    instance_name: 'rds-0423',
    avg_performance_improve: 0.1292965074445121
  }
];

export const optimizationRecordOverviewMockData: IOptimizationRecordOverview[] =
  [
    {
      record_number: 1,
      time: '2024-04-17'
    },
    {
      record_number: 0,
      time: '2024-04-18'
    },
    {
      record_number: 0,
      time: '2024-04-19'
    },
    {
      record_number: 0,
      time: '2024-04-20'
    },
    {
      record_number: 0,
      time: '2024-04-21'
    },
    {
      record_number: 0,
      time: '2024-04-22'
    },
    {
      record_number: 9,
      time: '2024-04-23'
    }
  ];
