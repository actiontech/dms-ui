import {
  IOptimizationRecord,
  IOptimizeSQLResData,
  IOptimizationDetail,
  IOptimizationSQL,
  IOptimizationSQLDetail,
  IDBPerformanceImproveOverview,
  IOptimizationRecordOverview
} from '../../../../api/sqle/service/common';
import {
  OptimizationRecordStatusEnum,
  OptimizationSQLDetailStatusEnum
} from '../../../../api/sqle/service/common.enum';

export const sqlOptimizationRecordsMockData: IOptimizationRecord[] = [
  {
    optimization_id: '123456',
    optimization_name: 'UI20240417112938231',
    instance_name: 'dd1',
    db_type: 'MySQL',
    created_time: '2024-04-17T03:33:09Z',
    created_user: 'admin',
    status: OptimizationRecordStatusEnum.finish,
    number_of_index: 2,
    number_of_rule: 2,
    performance_improve: 2.384615385
  },
  {
    optimization_id: '1234567',
    optimization_name: 'SQLfile20240417112938232',
    instance_name: 'dd1',
    db_type: '',
    status: OptimizationRecordStatusEnum.failed,
    status_detail: 'Optimize total state: pending'
  },
  {
    optimization_id: '12345678',
    optimization_name: 'GIT20240417112938233',
    created_time: '2024-04-17T03:33:09Z',
    created_user: 'admin',
    status: OptimizationRecordStatusEnum.optimizing,
    number_of_index: 0,
    number_of_rule: 0,
    performance_improve: 0
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
  id: 1,
  status: OptimizationSQLDetailStatusEnum.finish,
  status_detail: '',
  origin_sql:
    "SELECT \r\n    s.student_id\r\nFROM \r\n    students s\r\nLEFT JOIN\r\n    student_classes sc\r\nON \r\n    s.student_id = sc.student_id\r\nWHERE\r\n    s.student_id IN (\r\n        SELECT student_id FROM enrollments\r\n    )\r\n    AND DATE(s.create_at) >= '2024-01-01'",
  metadata:
    'CREATE TABLE students (\r\n    student_id INT AUTO_INCREMENT PRIMARY KEY,  -- \u5b66\u751f\u552f\u4e00\u6807\u8bc6\r\n    student_name VARCHAR(100),                  -- \u5b66\u751f\u59d3\u540d\r\n    phone_number VARCHAR(20),                   -- \u5b66\u751f\u7535\u8bdd\u53f7\u7801\r\n    create_at DATETIME,                         -- \u5b66\u751f\u8d26\u6237\u521b\u5efa\u65f6\u95f4\r\n    age INT,                                    -- \u5b66\u751f\u5e74\u9f84\r\n);\r\n\r\nCREATE TABLE student_classes (\r\n    student_id INT PRIMARY KEY, -- \u5b66\u751f\u552f\u4e00\u6807\u8bc6\r\n    class_id INT,               -- \u73ed\u7ea7\u552f\u4e00\u6807\u8bc6\r\n);\r\n\r\nCREATE TABLE enrollments (\r\n    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,  -- \u9009\u8bfe\u8bb0\u5f55ID\r\n    student_id INT,                               -- \u5b66\u751f\u552f\u4e00\u6807\u8bc6\r\n    course_id INT,                                -- \u8bfe\u7a0b\u552f\u4e00\u6807\u8bc6\r\n    enrollment_date DATETIME,                     -- \u9009\u8bfe\u65e5\u671f\r\n);',
  total_state: 'done',
  origin_query_plan: {
    state: 'done',
    query_plan_desc: [
      {
        summary: ['1 column'],
        children: [
          {
            summary: ['2 conditions'],
            children: [
              {
                summary: ['Left Outer Join'],
                children: [
                  {
                    summary: ['students s'],
                    children: [],
                    operator: 'Table Scan'
                  },
                  {
                    summary: ['student_classes sc'],
                    children: [],
                    operator: 'Table Scan'
                  }
                ],
                operator: 'Join'
              },
              {
                summary: ['(subquery1)'],
                children: [
                  {
                    summary: ['student_id'],
                    children: [
                      {
                        summary: ['enrollments'],
                        children: [],
                        operator: 'Table Scan'
                      }
                    ],
                    operator: 'Projection'
                  }
                ],
                operator: 'Subquery'
              }
            ],
            operator: 'Filter'
          }
        ],
        operator: 'Projection'
      }
    ]
  },
  optimize: {
    state: 'done',
    steps: [
      {
        rule_id: 'rule0003',
        rule_name: '外连接表消除',
        rule_desc: '可以消除LEFT JOIN，从而优化查询性能。',
        optimized_sql:
          "SELECT \n    s.student_id\nFROM \n    students s\nWHERE\n    s.student_id IN (\n        SELECT student_id FROM enrollments\n    )\n    AND DATE(s.create_at) >= '2024-01-01'",
        chat_id: 'eb5c2961-7ad3-4588-baad-e7a1cd78f563',
        query_plan: {
          state: 'done',
          query_plan_desc: [
            {
              summary: ['s.student_id'],
              children: [
                {
                  summary: ['2 conditions'],
                  children: [
                    {
                      summary: ['students s'],
                      children: [],
                      operator: 'Table Scan'
                    },
                    {
                      summary: ['(subquery1)'],
                      children: [
                        {
                          summary: ['student_id'],
                          children: [
                            {
                              summary: ['enrollments'],
                              children: [],
                              operator: 'Table Scan'
                            }
                          ],
                          operator: 'Projection'
                        }
                      ],
                      operator: 'Subquery'
                    }
                  ],
                  operator: 'Filter'
                }
              ],
              operator: 'Projection'
            }
          ]
        },
        analysis: {
          state: 'done',
          improvement_rate: 0.8461538461538461,
          improvement_desc:
            '\u4e0e\u539f\u59cb SQL \u76f8\u6bd4\uff0c\u6539\u5199\u540e\u7684 SQL \u79fb\u9664\u4e86\u5bf9 student_classes \u8868\u7684\u4e0d\u5fc5\u8981\u7684 LEFT JOIN\uff0c\u7b80\u5316\u4e86\u67e5\u8be2\u7ed3\u6784\u3002\u8fd9\u51cf\u5c11\u4e86\u5bf9 student_classes \u8868\u7684\u7d22\u5f15\u67e5\u627e\u64cd\u4f5c\uff0c\u964d\u4f4e\u4e86\u67e5\u8be2\u7684\u590d\u6742\u5ea6\u548c\u5904\u7406\u5f00\u9500\uff0c\u4ece\u800c\u63d0\u9ad8\u4e86\u67e5\u8be2\u6027\u80fd\u3002\u6b64\u5916\uff0c\u7b80\u5316\u540e\u7684 SQL \u66f4\u6613\u4e8e\u7406\u89e3\u548c\u7ef4\u62a4\u3002',
          detail: [
            {
              category: '\u6267\u884c\u8ba1\u5212',
              optimized_score: 2,
              original_score: 1
            },
            {
              category: '\u626b\u63cf\u9884\u4f30',
              optimized_score: 1,
              original_score: 1
            },
            {
              category: '\u7d22\u5f15\u4f7f\u7528',
              optimized_score: 2,
              original_score: 1
            },
            {
              category: 'SQL\u590d\u6742\u5ea6',
              optimized_score: 5,
              original_score: 1
            },
            {
              category: '\u7f51\u7edc\u4f20\u8f93',
              optimized_score: 4,
              original_score: 4
            },
            {
              category: '\u5176\u4ed6',
              optimized_score: 4,
              original_score: 4
            }
          ],
          total_score: 24.0
        }
      },
      {
        rule_id: 'rule0006',
        rule_name: '隐式转换',
        rule_desc:
          "\u5c06\u6761\u4ef6`DATE(s.create_at) >= '2024-01-01'`\u6539\u5199\u4e3a`s.create_at >= '2024-01-01 00:00:00'`\uff0c\u6d88\u9664\u4e86\u5bf9\u5b57\u6bb5\u7684\u51fd\u6570\u64cd\u4f5c\uff0c\u907f\u514d\u4e86\u9690\u5f0f\u8f6c\u6362\uff0c\u63d0\u9ad8\u4e86\u67e5\u8be2\u6027\u80fd\u3002",
        optimized_sql:
          "SELECT \n    s.student_id\nFROM \n    students s\nWHERE\n    s.student_id IN (\n        SELECT student_id FROM enrollments\n    )\n    AND s.create_at >= '2024-01-01 00:00:00'",
        chat_id: 'f6a04fc5-db21-4104-bdae-dbc799399db6',
        query_plan: {
          state: 'done',
          query_plan_desc: [
            {
              summary: ['1 column'],
              children: [
                {
                  summary: ['2 conditions'],
                  children: [
                    {
                      summary: ['students s'],
                      children: [],
                      operator: 'Table Scan'
                    },
                    {
                      summary: ['(subquery1)'],
                      children: [
                        {
                          summary: ['student_id'],
                          children: [
                            {
                              summary: ['enrollments'],
                              children: [],
                              operator: 'Table Scan'
                            }
                          ],
                          operator: 'Projection'
                        }
                      ],
                      operator: 'Subquery'
                    }
                  ],
                  operator: 'Filter'
                }
              ],
              operator: 'Projection'
            }
          ]
        },
        analysis: {
          state: 'done',
          improvement_rate: 0.2916666666666667,
          improvement_desc:
            '\u76f8\u8f83\u4e8e\u539f\u59cb SQL\uff0c\u6539\u5199\u540e\u7684 SQL \u53bb\u9664\u4e86\u5bf9 s.create_at \u7684\u51fd\u6570 DATE() \u7684\u4f7f\u7528\u3002\u8fd9\u4e00\u6539\u8fdb\u4f7f\u5f97\u6761\u4ef6\u7b5b\u9009\u53ef\u4ee5\u76f4\u63a5\u4f5c\u7528\u4e8e s.create_at \u5b57\u6bb5\uff0c\u51cf\u5c11\u4e86\u6bcf\u884c\u8bb0\u5f55\u8ba1\u7b97\u51fd\u6570\u7684\u5f00\u9500\u3002\u540c\u65f6\uff0c\u4f18\u5316\u5668\u80fd\u591f\u66f4\u51c6\u786e\u5730\u5229\u7528 s.create_at \u5b57\u6bb5\u7684\u7edf\u8ba1\u4fe1\u606f\uff0c\u4f30\u8ba1\u9009\u62e9\u6027\uff0c\u63d0\u9ad8\u6267\u884c\u8ba1\u5212\u7684\u8d28\u91cf\u3002\u5c3d\u7ba1\u7531\u4e8e\u7f3a\u5c11\u9488\u5bf9 s.create_at \u7684\u7d22\u5f15\uff0c\u65e0\u6cd5\u7acb\u5373\u53d7\u76ca\u4e8e\u7d22\u5f15\u626b\u63cf\uff0c\u4f46\u53bb\u9664\u51fd\u6570\u540e\uff0c\u4e3a\u540e\u7eed\u4f18\u5316\u63d0\u4f9b\u4e86\u53ef\u80fd\u6027\u3002\u6b64\u5916\uff0cSQL \u7ed3\u6784\u66f4\u52a0\u7b80\u6d01\uff0c\u589e\u5f3a\u4e86\u53ef\u8bfb\u6027\u548c\u7ef4\u62a4\u6027\u3002\u603b\u4f53\u800c\u8a00\uff0c\u6027\u80fd\u6709\u6240\u63d0\u5347\uff0c\u8ba1\u7b97\u5f00\u9500\u51cf\u5c11\uff0c\u67e5\u8be2\u6548\u7387\u63d0\u9ad8\u3002',
          detail: [
            {
              category: '\u6267\u884c\u8ba1\u5212',
              optimized_score: 3,
              original_score: 2
            },
            {
              category: '\u626b\u63cf\u9884\u4f30',
              optimized_score: 1,
              original_score: 1
            },
            {
              category: '\u7d22\u5f15\u4f7f\u7528',
              optimized_score: 2,
              original_score: 2
            },
            {
              category: 'SQL\u590d\u6742\u5ea6',
              optimized_score: 7,
              original_score: 5
            },
            {
              category: '\u7f51\u7edc\u4f20\u8f93',
              optimized_score: 4,
              original_score: 4
            },
            {
              category: '\u5176\u4ed6',
              optimized_score: 6,
              original_score: 4
            }
          ],
          total_score: 31.0
        }
      },
      {
        rule_id: 'rule0010',
        rule_name: '\u5173\u8054\u5b50\u67e5\u8be2\u4f18\u5316',
        rule_desc:
          '\u5c06\u975e\u5173\u8054\u7684\u5b50\u67e5\u8be2\u6539\u5199\u4e3a\u5173\u8054\u5b50\u67e5\u8be2\uff0c\u901a\u8fc7\u5728\u5b50\u67e5\u8be2\u4e2d\u6dfb\u52a0\u5173\u8054\u6761\u4ef6 s.student_id = enrollments.student_id\uff0c\u51cf\u5c11\u4e86\u4e0d\u5fc5\u8981\u7684\u5168\u8868\u626b\u63cf\uff0c\u63d0\u5347\u4e86\u67e5\u8be2\u6027\u80fd\u3002',
        optimized_sql:
          "SELECT \n    s.student_id\nFROM \n    students s\nWHERE\n    s.student_id IN (\n        SELECT student_id FROM enrollments WHERE s.student_id = enrollments.student_id\n    )\n    AND s.create_at >= '2024-01-01 00:00:00'",
        chat_id: 'dfb41f85-b8ab-4d52-96de-d85807890e4b',
        query_plan: {
          state: 'done',
          query_plan_desc: [
            {
              summary: ['s.student_id'],
              children: [
                {
                  summary: ['2 conditions'],
                  children: [
                    {
                      summary: ['students s'],
                      children: [],
                      operator: 'Table Scan'
                    },
                    {
                      summary: ['(subquery1)'],
                      children: [
                        {
                          summary: ['student_id'],
                          children: [
                            {
                              summary: [
                                's.student_id = enrollments.student_id'
                              ],
                              children: [
                                {
                                  summary: ['enrollments'],
                                  children: [],
                                  operator: 'Table Scan'
                                }
                              ],
                              operator: 'Filter'
                            }
                          ],
                          operator: 'Projection'
                        }
                      ],
                      operator: 'Subquery'
                    }
                  ],
                  operator: 'Filter'
                }
              ],
              operator: 'Projection'
            }
          ]
        },
        analysis: {
          state: 'done',
          improvement_rate: -0.06451612903225806,
          improvement_desc:
            '\u4e0e\u539f\u59cb SQL \u76f8\u6bd4\uff0c\u6539\u5199\u540e\u7684 SQL \u5728\u5b50\u67e5\u8be2\u4e2d\u52a0\u5165\u4e86 WHERE \u6761\u4ef6 `s.student_id = enrollments.student_id`\uff0c\u4f7f\u5f97\u5b50\u67e5\u8be2\u53ea\u8fd4\u56de\u4e0e\u5f53\u524d\u5b66\u751f\u5339\u914d\u7684\u8bb0\u5f55\u3002\u8fd9\u51cf\u5c11\u4e86\u5b50\u67e5\u8be2\u8fd4\u56de\u7684\u6570\u636e\u91cf\uff0c\u4ece\u539f\u5148\u7684 3,000,000 \u6761\u964d\u81f3\u6bcf\u4e2a\u5b66\u751f\u6700\u591a\u4e00\u6761\u3002\u8fd9\u6709\u52a9\u4e8e\u51cf\u5c11 IN \u5b50\u53e5\u4e2d\u9700\u8981\u5904\u7406\u7684\u6570\u636e\u91cf\uff0c\u6f5c\u5728\u5730\u964d\u4f4e\u5185\u5b58\u548c CPU \u5f00\u9500\u3002\u540c\u65f6\uff0c\u901a\u8fc7\u5c06\u5b50\u67e5\u8be2\u7f16\u5199\u4e3a\u76f8\u5173\u5b50\u67e5\u8be2\uff0c\u4e3a\u4f18\u5316\u5668\u63d0\u4f9b\u4e86\u66f4\u591a\u7684\u4f18\u5316\u673a\u4f1a\uff0c\u53ef\u80fd\u5c06\u5176\u8f6c\u6362\u4e3a EXISTS \u8bed\u53e5\uff0c\u4ece\u800c\u63d0\u9ad8\u67e5\u8be2\u6548\u7387\u3002',
          detail: [
            {
              category: '\u6267\u884c\u8ba1\u5212',
              optimized_score: 4,
              original_score: 3
            },
            {
              category: '\u626b\u63cf\u9884\u4f30',
              optimized_score: 1,
              original_score: 1
            },
            {
              category: '\u7d22\u5f15\u4f7f\u7528',
              optimized_score: 1,
              original_score: 2
            },
            {
              category: 'SQL\u590d\u6742\u5ea6',
              optimized_score: 4,
              original_score: 7
            },
            {
              category: '\u7f51\u7edc\u4f20\u8f93',
              optimized_score: 4,
              original_score: 4
            },
            {
              category: '\u5176\u4ed6',
              optimized_score: 6,
              original_score: 6
            }
          ],
          total_score: 29.0
        }
      }
    ]
  },
  total_analysis: {
    state: 'done',
    improvement_rate: 2.384615385,
    improvement_desc:
      '\u4e0e\u539f\u59cb SQL \u76f8\u6bd4\uff0c\u6539\u5199\u540e\u7684 SQL \u5728\u5b50\u67e5\u8be2\u4e2d\u52a0\u5165\u4e86 WHERE \u6761\u4ef6 `s.student_id = enrollments.student_id`\uff0c\u4f7f\u5f97\u5b50\u67e5\u8be2\u53ea\u8fd4\u56de\u4e0e\u5f53\u524d\u5b66\u751f\u5339\u914d\u7684\u8bb0\u5f55\u3002\u8fd9\u51cf\u5c11\u4e86\u5b50\u67e5\u8be2\u8fd4\u56de\u7684\u6570\u636e\u91cf\uff0c\u4ece\u539f\u5148\u7684 3,000,000 \u6761\u964d\u81f3\u6bcf\u4e2a\u5b66\u751f\u6700\u591a\u4e00\u6761\u3002\u8fd9\u6709\u52a9\u4e8e\u51cf\u5c11 IN \u5b50\u53e5\u4e2d\u9700\u8981\u5904\u7406\u7684\u6570\u636e\u91cf\uff0c\u6f5c\u5728\u5730\u964d\u4f4e\u5185\u5b58\u548c CPU \u5f00\u9500\u3002\u540c\u65f6\uff0c\u901a\u8fc7\u5c06\u5b50\u67e5\u8be2\u7f16\u5199\u4e3a\u76f8\u5173\u5b50\u67e5\u8be2\uff0c\u4e3a\u4f18\u5316\u5668\u63d0\u4f9b\u4e86\u66f4\u591a\u7684\u4f18\u5316\u673a\u4f1a\uff0c\u53ef\u80fd\u5c06\u5176\u8f6c\u6362\u4e3a EXISTS \u8bed\u53e5\uff0c\u4ece\u800c\u63d0\u9ad8\u67e5\u8be2\u6548\u7387\u3002',
    detail: [
      {
        category: '\u6267\u884c\u8ba1\u5212',
        optimized_score: 4,
        original_score: 1
      },
      {
        category: '\u626b\u63cf\u9884\u4f30',
        optimized_score: 1,
        original_score: 1
      },
      {
        category: '\u7d22\u5f15\u4f7f\u7528',
        optimized_score: 1,
        original_score: 1
      },
      {
        category: 'SQL\u590d\u6742\u5ea6',
        optimized_score: 7,
        original_score: 1
      },
      {
        category: '\u7f51\u7edc\u4f20\u8f93',
        optimized_score: 4,
        original_score: 4
      },
      {
        category: '\u5176\u4ed6',
        optimized_score: 6,
        original_score: 4
      }
    ],
    total_score: 31.0
  },
  advised_index: {
    state: 'done',
    has_advice: true,
    other_advice: undefined,
    indexes: [
      {
        create_index_statement:
          'CREATE INDEX idx_students_create_at ON students(create_at);',
        reason:
          '\u67e5\u8be2\u8bed\u53e5\u4e2d\u6709\u5bf9students\u8868\u7684create_at\u5b57\u6bb5\u7684\u8303\u56f4\u67e5\u8be2\uff0c\u9700\u8981\u5bf9\u8be5\u5b57\u6bb5\u6dfb\u52a0\u7d22\u5f15\u4ee5\u63d0\u9ad8\u67e5\u8be2\u6548\u7387\u3002'
      },
      {
        create_index_statement:
          'CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);',
        reason:
          '\u67e5\u8be2\u8bed\u53e5\u4e2d\u9700\u8981\u5728enrollments\u8868\u4e2d\u6839\u636estudent_id\u8fdb\u884c\u5339\u914d\uff0c\u7ed9enrollments\u8868\u7684student_id\u5b57\u6bb5\u6dfb\u52a0\u7d22\u5f15\u53ef\u4ee5\u52a0\u5feb\u5b50\u67e5\u8be2\u7684\u6267\u884c\u3002'
      }
    ]
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
