import {
  IRelatedSQLInfo,
  ISqlPerformanceInsights
} from '../../../../api/sqle/service/common';
import { RelatedSQLInfoSourceEnum } from '../../../../api/sqle/service/common.enum';

export const mockSqlPerformanceInsightsData: ISqlPerformanceInsights = {
  task_support: true,
  task_enable: true,
  x_info: '时间',
  y_info: '会话数',
  message: '',
  lines: [
    {
      line_name: '活跃会话数',
      points: [
        {
          x: '2025-07-22 15:57:56',
          y: 0,
          info: [
            {
              会话数: '0'
            }
          ]
        },
        {
          x: '2025-07-22 18:21:56',
          y: 0,
          info: [
            {
              会话数: '0'
            }
          ]
        },
        {
          x: '2025-07-22 20:45:56',
          y: 1,
          info: [
            {
              会话数: '1'
            }
          ]
        },
        {
          x: '2025-07-22 23:09:56',
          y: 0,
          info: [
            {
              会话数: '0'
            }
          ]
        },
        {
          x: '2025-07-23 01:33:56',
          y: 0,
          info: [
            {
              会话数: '0'
            }
          ],
          status: 1
        },
        {
          x: '2025-07-23 03:57:56',
          y: 0,
          info: [
            {
              会话数: '0'
            }
          ]
        },
        {
          x: '2025-07-23 06:21:56',
          y: 0,
          info: [
            {
              会话数: '0'
            }
          ]
        },
        {
          x: '2025-07-23 08:45:56',
          y: 0,
          info: [
            {
              会话数: '0'
            }
          ]
        },
        {
          x: '2025-07-23 11:09:56',
          y: 0,
          info: [
            {
              会话数: '0'
            }
          ]
        },
        {
          x: '2025-07-23 13:33:56',
          y: 0,
          info: [
            {
              会话数: '0'
            }
          ]
        }
      ]
    }
  ]
};

export const mockSqlPerformanceInsightsRelatedSQLData: IRelatedSQLInfo[] = [
  {
    sql_fingerprint: 'SELECT * FROM `DMS`.`USERS` WHERE `name`!=?',
    source: RelatedSQLInfoSourceEnum.workflow,
    execute_time_avg: 0.011,
    execute_time_max: 0.011,
    execute_time_min: 0.011,
    execute_time_sum: 0.011,
    lock_wait_time: 0,
    execution_time_trend: {
      points: [
        {
          time: '2025-07-23T13:43:52.686+08:00',
          execute_time: 0.011,
          sql: "SELECT * FROM dms.users where name \u003c\u003e ''",
          id: 1,
          is_in_transaction: false,
          info: [{ 执行时长: '0.01' }]
        }
      ],
      x_info: '时间',
      y_info: '执行时长',
      message: ''
    }
  }
];
